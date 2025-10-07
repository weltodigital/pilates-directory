'use client';

interface PilatesStudio {
  id: string;
  name: string;
  description: string;
  address: string;
  postcode: string;
  city: string;
  county: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  review_count?: number;
  opening_hours?: Record<string, string>;
  price_range?: string;
  specialties?: string[];
  class_types?: string[];
}

interface SEOSchemaMarkupProps {
  studios?: PilatesStudio[];
  location?: {
    name: string;
    county: string;
    type: string;
  };
  page?: 'home' | 'location' | 'studio';
}

export default function SEOSchemaMarkup({ studios = [], location, page = 'home' }: SEOSchemaMarkupProps) {
  const generateOrganizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PilatesUK',
    description: 'The UK\'s leading directory for finding pilates studios, classes, and instructors',
    url: 'https://pilatesuk.co.uk',
    logo: 'https://pilatesuk.co.uk/logo.png',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@pilatesuk.co.uk',
      areaServed: 'GB',
      availableLanguage: 'en'
    },
    sameAs: [
      'https://www.facebook.com/pilatesuk',
      'https://www.instagram.com/pilatesuk',
      'https://twitter.com/pilatesuk'
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
      addressRegion: 'England'
    }
  });

  const generateWebsiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PilatesUK',
    description: 'Find the best pilates studios across the UK',
    url: 'https://pilatesuk.co.uk',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://pilatesuk.co.uk/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'PilatesUK'
    }
  });

  const generateLocalBusinessSchema = (studio: PilatesStudio) => {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'ExerciseGym',
      name: studio.name,
      description: studio.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: studio.address,
        addressLocality: studio.city,
        addressRegion: studio.county,
        postalCode: studio.postcode,
        addressCountry: 'GB'
      },
      url: studio.website || `https://pilatesuk.co.uk/${studio.id}`,
      image: `https://pilatesuk.co.uk/images/studios/${studio.id}-1.jpg`,
      priceRange: studio.price_range || '£15-30',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Pilates Classes',
        itemListElement: studio.class_types?.map((classType, index) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `${classType} Classes`,
            description: `Professional ${classType.toLowerCase()} instruction suitable for all levels`,
            provider: {
              '@type': 'ExerciseGym',
              name: studio.name
            }
          }
        })) || []
      },
      amenityFeature: studio.specialties?.map(specialty => ({
        '@type': 'LocationFeatureSpecification',
        name: specialty,
        value: true
      })) || []
    };

    // Add coordinates if available
    if (studio.latitude && studio.longitude) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        latitude: studio.latitude,
        longitude: studio.longitude
      };
    }

    // Add contact information if available
    if (studio.phone || studio.email) {
      schema.contactPoint = {
        '@type': 'ContactPoint',
        contactType: 'customer service'
      };
      if (studio.phone) schema.contactPoint.telephone = studio.phone;
      if (studio.email) schema.contactPoint.email = studio.email;
    }

    // Add opening hours if available
    if (studio.opening_hours && Object.keys(studio.opening_hours).length > 0) {
      schema.openingHoursSpecification = Object.entries(studio.opening_hours).map(([day, hours]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
        opens: hours.split('-')[0]?.trim(),
        closes: hours.split('-')[1]?.trim()
      }));
    }

    // Add rating if available
    if (studio.rating && studio.review_count) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: studio.rating,
        reviewCount: studio.review_count,
        bestRating: 5,
        worstRating: 1
      };
    }

    return schema;
  };

  const generateLocationPageSchema = () => {
    if (!location) return null;

    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: `${location.name}, ${location.county}`,
      description: `Find the best pilates studios in ${location.name}, ${location.county}. Browse classes, read reviews, and book sessions.`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: location.name,
        addressRegion: location.county,
        addressCountry: 'GB'
      },
      containsPlace: studios.map(studio => ({
        '@type': 'ExerciseGym',
        name: studio.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: studio.address,
          addressLocality: studio.city,
          addressRegion: studio.county,
          postalCode: studio.postcode,
          addressCountry: 'GB'
        }
      }))
    };

    return schema;
  };

  const generateBreadcrumbSchema = () => {
    const items = [
      { name: 'Home', url: 'https://pilatesuk.co.uk' }
    ];

    if (location) {
      if (location.type === 'county') {
        items.push({
          name: location.name,
          url: `https://pilatesuk.co.uk/${location.name.toLowerCase().replace(/\s+/g, '-')}`
        });
      } else {
        items.push({
          name: location.county,
          url: `https://pilatesuk.co.uk/${location.county.toLowerCase().replace(/\s+/g, '-')}`
        });
        items.push({
          name: location.name,
          url: `https://pilatesuk.co.uk/${location.county.toLowerCase().replace(/\s+/g, '-')}/${location.name.toLowerCase().replace(/\s+/g, '-')}`
        });
      }
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };
  };

  const generateFAQSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What types of pilates classes are available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PilatesUK features studios offering mat pilates, reformer pilates, clinical pilates, prenatal pilates, barre pilates, and many other specialized classes. Each studio listing shows their specific class types and specialties.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much do pilates classes cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pilates class prices vary by location and studio type, typically ranging from £15-30 per class. Many studios offer package deals, memberships, and introductory offers for new clients.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do I need experience to start pilates?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No previous experience is required! Most studios offer beginner-friendly classes and will provide all necessary equipment. Many instructors are trained to modify exercises for different fitness levels.'
        }
      },
      {
        '@type': 'Question',
        name: 'What equipment do I need for pilates?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For mat pilates, you typically just need comfortable workout clothes and a mat (often provided by the studio). Reformer and equipment classes include all specialized equipment as part of the class fee.'
        }
      }
    ]
  });

  const schemas = [
    generateOrganizationSchema(),
    generateWebsiteSchema(),
    generateBreadcrumbSchema()
  ];

  if (page === 'home') {
    schemas.push(generateFAQSchema());
  }

  if (location) {
    const locationSchema = generateLocationPageSchema();
    if (locationSchema) schemas.push(locationSchema);
  }

  // Add business schemas for featured studios
  if (studios.length > 0) {
    studios.slice(0, 10).forEach(studio => {
      schemas.push(generateLocalBusinessSchema(studio));
    });
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2)
          }}
        />
      ))}
    </>
  );
}