import { createHash, randomBytes } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { serverClient } from '@/lib/forms'
import { sendEmail, siteUrl } from '@/lib/email'

/**
 * Studio owner sign-in.
 *
 * Owners never set a password. They ask for a link, it arrives at the address
 * an approved claim recorded, and following it starts a session. That address
 * was already checked against the studio's own domain when the claim was
 * approved, so delivery to it is the proof of ownership - the claim form on
 * its own only ever proved the domain existed.
 *
 * Tokens are stored hashed. Nothing in the database can be replayed to sign
 * in as somebody.
 */

export const OWNER_COOKIE = 'pcn_owner'
const SESSION_DAYS = 30
const LINK_MINUTES = 30

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

/**
 * Email a sign-in link, if this address belongs to an owner.
 *
 * Returns nothing either way. Telling an anonymous caller whether an address
 * is registered would turn the login form into a way of finding out which
 * studios have owners.
 */
export async function requestLoginLink(email: string, requesterHash: string): Promise<void> {
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

  const token = randomBytes(32).toString('base64url');
  const { error } = await supabase.from('owner_login_tokens').insert({
    owner_id: owner.id,
    token_hash: hash(token),
    expires_at: new Date(Date.now() + LINK_MINUTES * 60 * 1000).toISOString(),
    requester_hash: requesterHash,
  });
  if (error) {
    console.error('Login token insert failed:', error.message);
    return;
  }

  const link = `${siteUrl()}/studio-login/verify?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: owner.email,
    subject: 'Your sign-in link for Pilates Classes Near',
    text: [
      owner.name ? `Hi ${owner.name},` : 'Hi,',
      '',
      'Here is your link to sign in and manage your studio listing:',
      '',
      link,
      '',
      `It works once and expires in ${LINK_MINUTES} minutes.`,
      '',
      'If you did not ask for this, you can ignore it - nobody can sign in without the link.',
      '',
      'Pilates Classes Near',
    ].join('\n'),
  });
}

/** Exchange a link token for a session token, or null if it will not do. */
export async function consumeLoginToken(
  token: string,
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

  // Mark used before issuing the session, and only accept the update if it
  // was still unused, so two near-simultaneous clicks cannot both succeed.
  const { data: claimed } = await supabase
    .from('owner_login_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('id', row.id)
    .is('used_at', null)
    .select('id')
    .single();
  if (!claimed) return null;

  const sessionToken = randomBytes(32).toString('base64url');
  const { error } = await supabase.from('owner_sessions').insert({
    owner_id: row.owner_id,
    token_hash: hash(sessionToken),
    expires_at: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    user_agent: userAgent?.slice(0, 300) || null,
  });
  if (error) return null;

  await supabase
    .from('studio_owners')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', row.owner_id);

  return sessionToken;
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
    .select('studio_id, pilates_studios(id,name,city,county,full_url_path,is_verified)')
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
