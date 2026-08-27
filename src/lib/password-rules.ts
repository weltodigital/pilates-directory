/**
 * The one password rule the browser also needs to know.
 *
 * Kept apart from password.ts because that module reaches for node's crypto,
 * which a client component cannot import.
 */
export const MIN_PASSWORD_LENGTH = 10
