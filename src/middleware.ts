import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Redirect mixed-case paths to their lowercase form.
 *
 * Every URL on the site is lowercase, so /SW11 and /Kent used to 404. That
 * matters most for postcode districts: people write postcodes in capitals,
 * because that is how they appear on every letter and shopfront, so the
 * uppercase form is the one they type or paste.
 *
 * A 308 preserves the method and tells search engines the lowercase URL is
 * the permanent home, so any link written in capitals still passes its value
 * to the canonical page.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === pathname.toLowerCase()) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname.toLowerCase();
  return NextResponse.redirect(url, 308);
}

export const config = {
  /**
   * Skip anything whose casing is meaningful or which gains nothing from the
   * check: build output, the image optimiser, API routes, and files with an
   * extension. Uploaded assets can legitimately be mixed-case, and renaming
   * them in a redirect would break them.
   */
  matcher: ['/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)'],
}
