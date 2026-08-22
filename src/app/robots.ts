import { MetadataRoute } from 'next'

/**
 * Generated rather than hand-maintained, so the sitemap URL cannot drift from
 * the site again. The previous static file was inherited from the butchers
 * directory this project was forked from: it pointed crawlers at
 * meatmap.co.uk/sitemap.xml, a domain we do not own, so the real sitemap was
 * never discoverable by convention.
 */

const BASE_URL = 'https://www.pilatesclassesnear.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Data endpoints. /api/near backs the distance search and is public,
          // but it returns JSON that is already on the pages themselves.
          '/api/',
          // Claim forms are per-studio and noindex; crawling them wastes budget
          // on 4,500 near-identical pages.
          '/claim/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
