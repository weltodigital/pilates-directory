import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { MIN_PASSWORD_LENGTH } from '@/lib/password-rules'

/**
 * Password hashing with scrypt from node's own crypto module.
 *
 * No dependency: scrypt is memory-hard and in the standard library, which is
 * the whole of what this needs. The parameters are stored alongside the hash
 * so they can be raised later without invalidating existing passwords.
 */

const N = 16384      // CPU/memory cost
const R = 8          // block size
const P = 1          // parallelisation
const KEY_LENGTH = 64

export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const key = scryptSync(plain, salt, KEY_LENGTH, { N, r: R, p: P });
  return ['scrypt', N, R, P, salt.toString('base64url'), key.toString('base64url')].join('$');
}

/** Constant-time check. False for any stored value this cannot parse. */
export function verifyPassword(plain: string, stored: string | null | undefined): boolean {
  if (!stored) return false;

  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const [, n, r, p, salt, expected] = parts;
  try {
    const expectedKey = Buffer.from(expected, 'base64url');
    const actual = scryptSync(plain, Buffer.from(salt, 'base64url'), expectedKey.length, {
      N: Number(n), r: Number(r), p: Number(p),
    });
    return timingSafeEqual(actual, expectedKey);
  } catch {
    return false;
  }
}

export { MIN_PASSWORD_LENGTH }

/**
 * Length is the requirement that survives contact with real users. Character
 * classes push people towards Passw0rd! and no further, so the only other
 * checks here are for the handful of passwords that are obviously nothing.
 */
export function passwordProblem(plain: string): string | null {
  if (plain.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (plain.length > 200) return 'That is too long.';
  if (/^(.)\1+$/.test(plain)) return 'Use something less repetitive.';
  if (/^password/i.test(plain)) return 'Use something less guessable.';
  return null;
}
