import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site'

const BASE_URL = 'https://www.pilatesclassesnear.com'

/**
 * Homepage structured data.
 *
 * Rewritten from the version inherited with the fork, which described a
 * different site: it named the organisation "Pilates Directory", pointed
 * every url, logo and breadcrumb at pilatesuk.co.uk - a domain we do not own
 * - claimed three social accounts, offered a search endpoint at /search that
 * has never existed, and carried an FAQPage whose questions appear nowhere on
 * the page. Structured data is a set of assertions to a search engine about
 * who we are, and every one of those was false.
 *
 * What is left is what can be stood behind: who runs the site, at the address
 * it is actually served from, and a search action that goes to a search that
 * exists.
 */
export default function SEOSchemaMarkup() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organisation`,
        name: SITE_NAME,
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/pilates-classes-near.png`,
        },
        description:
          'A directory of pilates studios across the United Kingdom, listing classes, prices and opening hours.',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: CONTACT_EMAIL,
          areaServed: 'GB',
          availableLanguage: 'en-GB',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: SITE_NAME,
        url: BASE_URL,
        publisher: { '@id': `${BASE_URL}/#organisation` },
        inLanguage: 'en-GB',
        // /near takes a postcode and returns studios by distance. It is the
        // only search on the site, so it is the only one worth declaring.
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE_URL}/near?postcode={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
