import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'

import { field } from '@/lib/validation'

export * from '@/lib/validation'

/**
 * Shared helpers for the public submission forms.
 *
 * Everything here runs server-side. Client-side checks are for the visitor's
 * benefit; these are the ones that decide what reaches the database.
 */

export function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * Salted hash of the caller's IP. Enough to rate limit repeat submissions
 * without keeping an identifier for someone who filled in a form.
 */
export function submitterHash(request: Request): string {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const salt = process.env.SUPABASE_SECRET_KEY || 'salt';
  return createHash('sha256').update(`${ip}:${salt}`).digest('hex').slice(0, 32);
}

/** True when this submitter has exceeded the hourly limit for a table. */
export async function isRateLimited(
  supabase: any, table: string, hash: string, maxPerHour = 5
): Promise<boolean> {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq('submitter_hash', hash)
    .gte('created_at', since);
  if (error) return false;   // never block a genuine submission on our own bug
  return (count || 0) >= maxPerHour;
}

/**
 * A hidden field real people never fill in. Bots complete every input they
 * find, so a value here is a reliable signal without burdening the visitor
 * with a captcha.
 */
export function looksLikeBot(body: Record<string, unknown>): boolean {
  return Boolean(field(body.company));
}
