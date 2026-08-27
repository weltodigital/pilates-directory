import { createHash, createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Admin sessions.
 *
 * One operator, one password held in the environment, and a signed cookie
 * rather than a session table. The cookie carries a fingerprint of the
 * current password, so changing ADMIN_PASSWORD signs every existing session
 * out - which is the only revocation a stateless cookie otherwise lacks.
 */

export const ADMIN_COOKIE = 'pcn_admin'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30

function signingSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SECRET_KEY || '';
}

/** Short hash of the live password, embedded in every issued cookie. */
function passwordFingerprint(): string {
  return createHash('sha256')
    .update(`fp:${process.env.ADMIN_PASSWORD || ''}`)
    .digest('hex')
    .slice(0, 16);
}

/** False when the deployment has no password set, so nothing can sign in. */
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && signingSecret());
}

/** Constant-time comparison, so a wrong guess reveals nothing by timing. */
export function passwordMatches(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected) return false;
  const a = createHash('sha256').update(candidate).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

function sign(payload: string): string {
  return createHmac('sha256', signingSecret()).update(payload).digest('hex');
}

export function issueSessionToken(): string {
  const payload = `${Date.now() + MAX_AGE_SECONDS * 1000}.${passwordFingerprint()}`;
  return `${payload}.${sign(payload)}`;
}

export function sessionTokenIsValid(token: string | undefined): boolean {
  if (!token || !adminConfigured()) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [expiry, fingerprint, signature] = parts;
  const expected = sign(`${expiry}.${fingerprint}`);
  if (signature.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  if (fingerprint !== passwordFingerprint()) return false;   // password changed
  return Number(expiry) > Date.now();
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MAX_AGE_SECONDS,
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return sessionTokenIsValid(store.get(ADMIN_COOKIE)?.value);
}

/** For server components: send anyone without a valid session to the login. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect('/admin/login');
}

/**
 * Append to the audit trail. Every approval and rejection is recorded, so a
 * change to a live listing can be traced back to the decision behind it.
 */
export async function recordAction(
  supabase: any,
  action: string,
  targetTable: string,
  targetId: string | null,
  detail?: Record<string, unknown> | null,
  note?: string | null
) {
  await supabase.from('admin_actions').insert({
    action,
    target_table: targetTable,
    target_id: targetId,
    note: note || null,
    detail: detail || null,
  });
}
