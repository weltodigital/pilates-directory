import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'

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

/** Trim, collapse whitespace, cap length, and treat empty as absent. */
export function field(value: unknown, maxLength = 300): string | null {
  if (typeof value !== 'string') return null;
  const s = value.replace(/\s+/g, ' ').trim();
  if (!s) return null;
  return s.slice(0, maxLength);
}

export function isEmail(value: string): boolean {
  // Deliberately permissive: the only real test of an address is delivery.
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value) && value.length <= 254;
}

export function normaliseUrl(value: string | null): string | null {
  if (!value) return null;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const u = new URL(withScheme);
    return u.hostname.includes('.') ? u.toString() : null;
  } catch {
    return null;
  }
}

const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

export function normalisePostcode(value: string | null): string | null {
  if (!value) return null;
  const s = value.toUpperCase().replace(/\s+/g, '');
  if (!UK_POSTCODE.test(s)) return null;
  return `${s.slice(0, -3)} ${s.slice(-3)}`;
}

/** Resolve a postcode to its town and county, confirming it is real. */
export async function lookupPostcode(postcode: string) {
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.replace(/\s+/g, ''))}`
    );
    if (!res.ok) return null;
    const j = await res.json();
    if (!j.result) return null;
    // "Wandsworth, unparished area" is an administrative label, not a town,
    // and anything after a comma is the wider district rather than the place.
    const parish: string | null =
      j.result.parish && !/unparished/i.test(j.result.parish)
        ? String(j.result.parish).split(',')[0].trim()
        : null;

    return {
      town: j.result.post_town || parish || j.result.admin_district || null,
      county: j.result.admin_county || j.result.admin_district || null,
      country: j.result.country as string,
      latitude: j.result.latitude as number,
      longitude: j.result.longitude as number,
    };
  } catch {
    return null;
  }
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

export const CLASS_TYPE_OPTIONS = [
  'Reformer Pilates',
  'Mat Pilates',
  'Clinical Pilates',
  'Prenatal Pilates',
  'Postnatal Pilates',
  'Barre',
  'Tower Pilates',
  'Chair Pilates',
  'Private Pilates',
  'Beginner Pilates',
];

export function cleanClassTypes(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const allowed = new Set(CLASS_TYPE_OPTIONS);
  const out = value.filter((v): v is string => typeof v === 'string' && allowed.has(v));
  return out.length ? out : null;
}

/**
 * Registrable-ish domain from a URL or email address, lowercased and without
 * a leading www. Not a public-suffix parser: it keeps the full host, which is
 * what the claim check compares.
 */
export function domainOf(value: string | null | undefined): string | null {
  if (!value) return null;
  const raw = value.includes('@') ? value.split('@').pop()! : value;
  try {
    const host = raw.includes('://')
      ? new URL(raw).hostname
      : new URL(`https://${raw}`).hostname;
    return host.toLowerCase().replace(/^www\./, '') || null;
  } catch {
    return null;
  }
}

/**
 * Website builders and marketplaces host studios on a shared domain, so an
 * address there proves nothing about the business.
 */
const SHARED_HOSTS = [
  'wixsite.com', 'squarespace.com', 'weebly.com', 'wordpress.com', 'business.site',
  'godaddysites.com', 'myshopify.com', 'sitey.me', 'webador.co.uk', 'mailchimpsites.com',
  'linktr.ee', 'facebook.com', 'instagram.com', 'google.com', 'sites.google.com',
  'classpass.com', 'mindbodyonline.com', 'momence.com', 'teamup.com', 'bookwhen.com',
  'gymcatch.com', 'glofox.com', 'acuityscheduling.com',
];

/** True when the domain cannot be used to prove ownership of a studio. */
export function isSharedHost(domain: string | null): boolean {
  if (!domain) return true;
  return SHARED_HOSTS.some(h => domain === h || domain.endsWith(`.${h}`));
}

/**
 * Whether an email address belongs to a studio's own domain. Subdomains on
 * either side are accepted, so info@mail.studio.co.uk matches studio.co.uk.
 */
export function emailMatchesDomain(email: string, siteDomain: string): boolean {
  const emailDomain = domainOf(email);
  if (!emailDomain) return false;
  return (
    emailDomain === siteDomain ||
    emailDomain.endsWith(`.${siteDomain}`) ||
    siteDomain.endsWith(`.${emailDomain}`)
  );
}
