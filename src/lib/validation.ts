/**
 * Validation and normalisation with no dependencies.
 *
 * Split out of forms.ts so client components can import these without pulling
 * the Supabase SDK into the browser bundle - importing one helper from a
 * module that also creates a database client was costing 130 kB on the owner
 * dashboard.
 */

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
    if (!u.hostname.includes('.')) return null;

    // An email address typed into a website field parses as a URL: the part
    // before the @ becomes the username and gmail.com becomes the host. It
    // published as a link to https://someone@gmail.com/, which goes nowhere.
    // Credentials in a URL are never something a studio means to give us.
    if (u.username || u.password) return null;

    return u.toString();
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
