import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pilatesclassesnear.com';
  const currentDate = new Date();

  const sitemapEntries = [
    // Homepage
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  // All English counties
  const counties = [
    'bedfordshire', 'berkshire', 'buckinghamshire', 'cambridgeshire', 'cheshire',
    'cornwall', 'cumbria', 'derbyshire', 'devon', 'dorset', 'durham',
    'east-sussex', 'essex', 'gloucestershire', 'london', 'greater-manchester',
    'hampshire', 'herefordshire', 'hertfordshire', 'isle-of-wight', 'kent',
    'lancashire', 'leicestershire', 'lincolnshire', 'merseyside', 'norfolk',
    'northamptonshire', 'northumberland', 'north-yorkshire', 'nottinghamshire',
    'oxfordshire', 'rutland', 'shropshire', 'somerset', 'south-yorkshire',
    'staffordshire', 'suffolk', 'surrey', 'tyne-and-wear', 'warwickshire',
    'west-midlands', 'west-sussex', 'west-yorkshire', 'wiltshire', 'worcestershire'
  ];

  // Add county pages
  counties.forEach(county => {
    sitemapEntries.push({
      url: `${baseUrl}/${county}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    });
  });

  // Major city pages for top counties
  const majorCities = [
    // London boroughs
    { county: 'london', cities: ['camden', 'westminster', 'islington', 'hackney', 'tower-hamlets', 'kensington-and-chelsea', 'lambeth', 'greenwich', 'hammersmith-and-fulham', 'lewisham'] },
    // Other major counties
    { county: 'greater-manchester', cities: ['manchester', 'bolton', 'bury', 'oldham', 'rochdale', 'salford', 'stockport', 'tameside', 'trafford', 'wigan'] },
    { county: 'west-midlands', cities: ['birmingham', 'wolverhampton', 'coventry', 'dudley', 'walsall', 'west-bromwich', 'solihull', 'sutton-coldfield'] },
    { county: 'west-yorkshire', cities: ['leeds', 'bradford', 'huddersfield', 'halifax', 'wakefield', 'dewsbury', 'batley', 'keighley'] },
    { county: 'merseyside', cities: ['liverpool', 'birkenhead', 'st-helens', 'southport', 'bootle', 'crosby'] },
    { county: 'south-yorkshire', cities: ['sheffield', 'doncaster', 'rotherham', 'barnsley'] },
    { county: 'tyne-and-wear', cities: ['newcastle-upon-tyne', 'sunderland', 'south-shields', 'north-shields', 'gateshead'] },
    { county: 'essex', cities: ['colchester', 'southend-on-sea', 'chelmsford', 'basildon', 'harlow', 'brentwood'] },
    { county: 'kent', cities: ['maidstone', 'canterbury', 'dartford', 'dover', 'rochester', 'margate', 'folkestone', 'ashford'] },
    { county: 'surrey', cities: ['guildford', 'woking', 'epsom', 'kingston-upon-thames', 'sutton', 'croydon', 'camberley', 'farnham'] },
    { county: 'hampshire', cities: ['southampton', 'portsmouth', 'basingstoke', 'winchester', 'eastleigh', 'fareham'] },
    { county: 'berkshire', cities: ['reading', 'slough', 'windsor', 'maidenhead', 'bracknell', 'newbury', 'wokingham'] },
    { county: 'bedfordshire', cities: ['bedford', 'luton', 'dunstable', 'leighton-buzzard', 'biggleswade'] }
  ];

  // Add major city pages
  majorCities.forEach(({ county, cities }) => {
    cities.forEach(city => {
      sitemapEntries.push({
        url: `${baseUrl}/${county}/${city}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    });
  });

  // Specialty/category pages
  const specialtyPages = [
    'reformer-pilates', 'mat-pilates', 'clinical-pilates', 'prenatal-pilates',
    'barre-pilates', 'beginner-pilates', 'advanced-pilates', 'pilates-classes',
    'private-pilates', 'group-pilates', 'online-pilates'
  ];

  specialtyPages.forEach(page => {
    sitemapEntries.push({
      url: `${baseUrl}/${page}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: page.includes('reformer') || page.includes('mat') || page.includes('beginner') ? 0.8 : 0.7,
    });
  });

  // Static pages
  const staticPages = [
    { path: 'privacy-policy', priority: 0.3 },
    { path: 'terms-of-service', priority: 0.3 }
  ];

  staticPages.forEach(({ path, priority }) => {
    sitemapEntries.push({
      url: `${baseUrl}/${path}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority,
    });
  });

  return sitemapEntries;
}