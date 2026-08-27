import { createHash, randomBytes } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { serverClient } from '@/lib/forms'
import { sendEmail, siteUrl } from '@/lib/email'
import { hashPassword, verifyPassword } from '@/lib/password'

/**
 * Studio owner sign-in.
 *
 * Owners sign in with an email address and a password. The emailed link is
 * still how the first password gets set, and how a forgotten one is replaced,
 * because that link is the only thing that proves the claimant reads mail at
 * the studio's domain - the claim form on its own proved only that the domain
 * exists.
 *
 * Tokens and passwords are both stored hashed. Nothing in the database can be
 * replayed to sign in as somebody.
 */

export const OWNER_COOKIE = 'pcn_owner'
const SESSION_DAYS = 30
const SETUP_HOURS = 72
const RESET_MINUTES = 60

/** Failed sign-ins tolerated before an account pauses, and for how long. */
const MAX_FAILURES = 8
const LOCKOUT_MINUTES = 15

function hash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export const ownerCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_DAYS * 24 * 60 * 60,
}

export type LinkPurpose = 'set_password' | 'reset'

/**
 * Email a link for setting or resetting a password, if this address belongs
 * to an owner.
 *
 * Returns nothing either way. Telling an anonymous caller whether an address
 * is registered would turn the forgotten-password form into a way of finding
 * out which studios have owners.
 */
export async function requestPasswordLink(
  email: string,
  purpose: LinkPurpose,
  requesterHash: string
): Promise<void> {
  const supabase = serverClient();
  if (!supabase) return;

  const { data: owner } = await supabase
    .from('studio_owners')
    .select('id,email,name')
    .eq('email', email.toLowerCase())
    .single();
  if (!owner) return;

  // Cap link requests per owner: an attacker who knows the address should not
  // be able to use us to flood the owner's inbox.
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('owner_login_tokens')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', owner.id)
    .gte('created_at', since);
  if ((count || 0) >= 5) return;

  const setup = purpose === 'set_password';
  const lifetimeMs = setup ? SETUP_HOURS * 60 * 60 * 1000 : RESET_MINUTES * 60 * 1000;

  const token = randomBytes(32).toString('base64url');
  const { error } = await supabase.from('owner_login_tokens').insert({
    owner_id: owner.id,
    token_hash: hash(token),
    purpose,
    expires_at: new Date(Date.now() + lifetimeMs).toISOString(),
    requester_hash: requesterHash,
  });
  if (error) {
    console.error('Password link insert failed:', error.message);
    return;
  }

  const link = `${siteUrl()}/studio-login/set?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: owner.email,
    subject: setup
      ? 'Set your password for Pilates Classes Near'
      : 'Reset your Pilates Classes Near password',
    text: [
      owner.name ? `Hi ${owner.name},` : 'Hi,',
      '',
      setup
        ? 'Your claim has been approved. Choose a password and you can manage your listing:'
        : 'Here is your link to choose a new password:',
      '',
      link,
      '',
      setup
        ? `It works once and expires in ${SETUP_HOURS} hours.`
        : `It works once and expires in ${RESET_MINUTES} minutes.`,
      '',
      setup
        ? `After that, sign in any time at ${siteUrl()}/studio-login`
        : 'If you did not ask for this, you can ignore it - your password has not changed.',
      '',
      'Pilates Classes Near',
    ].join('\n'),
  });
}

/** Start a session for an owner, returning the raw cookie value. */
async function startSession(
  supabase: any,
  ownerId: string,
  userAgent: string | null
): Promise<string | null> {
  const sessionToken = randomBytes(32).toString('base64url');
  const { error } = await supabase.from('owner_sessions').insert({
    owner_id: ownerId,
    token_hash: hash(sessionToken),
    expires_at: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    user_agent: userAgent?.slice(0, 300) || null,
  });
  if (error) return null;

  await supabase
    .from('studio_owners')
    .update({
      last_login_at: new Date().toISOString(),
      failed_login_count: 0,
      last_failed_login_at: null,
    })
    .eq('id', ownerId);

  return sessionToken;
}

/**
 * Check a password-link token without spending it.
 *
 * The token has to survive being shown a form, so it is only marked used when
 * the new password is actually saved.
 */
export async function peekPasswordToken(token: string): Promise<{ email: string } | null> {
  const supabase = serverClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from('owner_login_tokens')
    .select('expires_at,used_at,studio_owners(email)')
    .eq('token_hash', hash(token))
    .single();

  if (!data || data.used_at || new Date(data.expires_at) < new Date()) return null;
  const owner = (data as any).studio_owners;
  return owner ? { email: owner.email } : null;
}

/**
 * Spend a password-link token, save the new password, and sign the owner in.
 *
 * Every other session is dropped at the same time: someone resetting a
 * password may be doing it because a device was lost.
 */
export async function setPasswordWithToken(
  token: string,
  password: string,
  userAgent: string | null
): Promise<string | null> {
  const supabase = serverClient();
  if (!supabase) return null;

  const { data: row } = await supabase
    .from('owner_login_tokens')
    .select('id,owner_id,expires_at,used_at')
    .eq('token_hash', hash(token))
    .single();

  if (!row || row.used_at || new Date(row.expires_at) < new Date()) return null;

  // Claim the token before doing anything else, and only if it was still
  // unused, so two near-simultaneous submissions cannot both succeed.
  const { data: claimed } = await supabase
    .from('owner_login_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('id', row.id)
    .is('used_at', null)
    .select('id')
    .single();
  if (!claimed) return null;

  const { error } = await supabase
    .from('studio_owners')
    .update({
      password_hash: hashPassword(password),
      failed_login_count: 0,
      last_failed_login_at: null,
    })
    .eq('id', row.owner_id);
  if (error) return null;

  await supabase.from('owner_sessions').delete().eq('owner_id', row.owner_id);

  return startSession(supabase, row.owner_id, userAgent);
}

/** A throwaway hash, built once, to compare against for unknown addresses. */
let decoy: string | null = null
function decoyHash(): string {
  return (decoy ||= hashPassword(randomBytes(16).toString('hex')));
}

export type SignInResult =
  | { ok: true; session: string }
  | { ok: false; reason: 'credentials' | 'locked' | 'no_password' }

/**
 * Sign in with an email address and password.
 *
 * A wrong password and an unknown address are the same answer to the caller.
 * The one exception is an account that has never set a password, which is
 * told to use the emailed link - that is a state we created, not something an
 * attacker can produce, and leaving the owner guessing would be unkind.
 */
export async function signIn(
  email: string,
  password: string,
  userAgent: string | null
): Promise<SignInResult> {
  const supabase = serverClient();
  if (!supabase) return { ok: false, reason: 'credentials' };

  const { data: owner } = await supabase
    .from('studio_owners')
    .select('id,password_hash,failed_login_count,last_failed_login_at')
    .eq('email', email.toLowerCase())
    .single();

  if (!owner) {
    // Do the same work as a real check, so how long the answer takes does not
    // say whether the account exists.
    verifyPassword(password, decoyHash());
    return { ok: false, reason: 'credentials' };
  }

  const lockedUntil = owner.last_failed_login_at
    ? new Date(owner.last_failed_login_at).getTime() + LOCKOUT_MINUTES * 60 * 1000
    : 0;
  if ((owner.failed_login_count || 0) >= MAX_FAILURES && lockedUntil > Date.now()) {
    return { ok: false, reason: 'locked' };
  }

  if (!owner.password_hash) return { ok: false, reason: 'no_password' };

  if (!verifyPassword(password, owner.password_hash)) {
    // Restart the count when the lockout window has passed, rather than
    // letting old failures accumulate into a permanent lock.
    const stale = lockedUntil > 0 && lockedUntil <= Date.now();
    await supabase
      .from('studio_owners')
      .update({
        failed_login_count: stale ? 1 : (owner.failed_login_count || 0) + 1,
        last_failed_login_at: new Date().toISOString(),
      })
      .eq('id', owner.id);
    return { ok: false, reason: 'credentials' };
  }

  const session = await startSession(supabase, owner.id, userAgent);
  return session ? { ok: true, session } : { ok: false, reason: 'credentials' };
}

export interface OwnerSession {
  id: string;
  email: string;
  name: string | null;
}

/** The signed-in owner, or null. Reads the cookie set by the verify route. */
export async function getOwner(): Promise<OwnerSession | null> {
  const store = await cookies();
  const token = store.get(OWNER_COOKIE)?.value;
  if (!token) return null;

  const supabase = serverClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from('owner_sessions')
    .select('id,expires_at,studio_owners(id,email,name)')
    .eq('token_hash', hash(token))
    .single();

  if (!data || new Date(data.expires_at) < new Date()) return null;
  const owner = (data as any).studio_owners;
  return owner ? { id: owner.id, email: owner.email, name: owner.name } : null;
}

export async function requireOwner(): Promise<OwnerSession> {
  const owner = await getOwner();
  if (!owner) redirect('/studio-login');
  return owner;
}

export async function endSession(token: string | undefined): Promise<void> {
  if (!token) return;
  const supabase = serverClient();
  if (!supabase) return;
  await supabase.from('owner_sessions').delete().eq('token_hash', hash(token));
}

/** The studios this owner may edit. */
export async function ownedStudios(ownerId: string) {
  const supabase = serverClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('studio_owner_studios')
    .select('studio_id, pilates_studios(id,name,city,county,city_slug,county_slug,full_url_path,is_verified)')
    .eq('owner_id', ownerId);

  return (data || [])
    .map((row: any) => row.pilates_studios)
    .filter(Boolean);
}

export async function ownsStudio(ownerId: string, studioId: string): Promise<boolean> {
  const supabase = serverClient();
  if (!supabase) return false;
  const { count } = await supabase
    .from('studio_owner_studios')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', ownerId)
    .eq('studio_id', studioId);
  return (count || 0) > 0;
}
