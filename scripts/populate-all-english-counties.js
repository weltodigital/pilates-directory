/**
 * Populate All English Counties
 * Creates a comprehensive database structure with all English counties and major towns/cities
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Complete list of English counties and their major towns/cities
const ENGLISH_COUNTIES = {
  'bedfordshire': {
    name: 'Bedfordshire',
    towns: ['Bedford', 'Luton', 'Dunstable', 'Leighton Buzzard', 'Biggleswade', 'Flitwick', 'Ampthill', 'Sandy', 'Potton', 'Shefford']
  },
  'berkshire': {
    name: 'Berkshire',
    towns: ['Reading', 'Slough', 'Windsor', 'Maidenhead', 'Bracknell', 'Newbury', 'Wokingham', 'Ascot', 'Sandhurst', 'Thatcham']
  },
  'buckinghamshire': {
    name: 'Buckinghamshire',
    towns: ['Milton Keynes', 'High Wycombe', 'Aylesbury', 'Amersham', 'Chesham', 'Marlow', 'Beaconsfield', 'Burnham', 'Chalfont St Giles', 'Gerrards Cross']
  },
  'cambridgeshire': {
    name: 'Cambridgeshire',
    towns: ['Cambridge', 'Peterborough', 'Huntingdon', 'Ely', 'Wisbech', 'St Neots', 'March', 'Chatteris', 'Ramsey', 'Soham']
  },
  'cheshire': {
    name: 'Cheshire',
    towns: ['Chester', 'Warrington', 'Crewe', 'Macclesfield', 'Ellesmere Port', 'Runcorn', 'Widnes', 'Northwich', 'Wilmslow', 'Nantwich']
  },
  'cornwall': {
    name: 'Cornwall',
    towns: ['Plymouth', 'Truro', 'Falmouth', 'Penzance', 'Newquay', 'St Austell', 'Bodmin', 'Liskeard', 'Camborne', 'Redruth']
  },
  'cumbria': {
    name: 'Cumbria',
    towns: ['Carlisle', 'Barrow-in-Furness', 'Kendal', 'Whitehaven', 'Workington', 'Penrith', 'Ulverston', 'Keswick', 'Windermere', 'Ambleside']
  },
  'derbyshire': {
    name: 'Derbyshire',
    towns: ['Derby', 'Chesterfield', 'Glossop', 'Ilkeston', 'Long Eaton', 'Swadlincote', 'Buxton', 'Matlock', 'Belper', 'Ripley']
  },
  'devon': {
    name: 'Devon',
    towns: ['Exeter', 'Plymouth', 'Torquay', 'Paignton', 'Barnstaple', 'Newton Abbot', 'Tiverton', 'Bideford', 'Exmouth', 'Honiton']
  },
  'dorset': {
    name: 'Dorset',
    towns: ['Bournemouth', 'Poole', 'Dorchester', 'Weymouth', 'Christchurch', 'Bridport', 'Sherborne', 'Wimborne Minster', 'Ferndown', 'Swanage']
  },
  'durham': {
    name: 'Durham',
    towns: ['Durham', 'Darlington', 'Hartlepool', 'Stockton-on-Tees', 'Bishop Auckland', 'Newton Aycliffe', 'Chester-le-Street', 'Consett', 'Peterlee', 'Stanley']
  },
  'east-sussex': {
    name: 'East Sussex',
    towns: ['Brighton', 'Hove', 'Eastbourne', 'Hastings', 'Lewes', 'Bexhill-on-Sea', 'Seaford', 'Newhaven', 'Uckfield', 'Crowborough']
  },
  'essex': {
    name: 'Essex',
    towns: ['Colchester', 'Southend-on-Sea', 'Chelmsford', 'Basildon', 'Harlow', 'Brentwood', 'West Thurrock', 'Canvey Island', 'Rayleigh', 'Billericay']
  },
  'gloucestershire': {
    name: 'Gloucestershire',
    towns: ['Gloucester', 'Cheltenham', 'Stroud', 'Tewkesbury', 'Cirencester', 'Dursley', 'Lydney', 'Newent', 'Thornbury', 'Fairford']
  },
  'greater-london': {
    name: 'Greater London',
    towns: ['London', 'Westminster', 'Camden', 'Greenwich', 'Hackney', 'Hammersmith and Fulham', 'Islington', 'Kensington and Chelsea', 'Lambeth', 'Lewisham']
  },
  'greater-manchester': {
    name: 'Greater Manchester',
    towns: ['Manchester', 'Bolton', 'Bury', 'Oldham', 'Rochdale', 'Salford', 'Stockport', 'Tameside', 'Trafford', 'Wigan']
  },
  'hampshire': {
    name: 'Hampshire',
    towns: ['Southampton', 'Portsmouth', 'Basingstoke', 'Winchester', 'Eastleigh', 'Fareham', 'Gosport', 'Havant', 'Andover', 'Alton']
  },
  'herefordshire': {
    name: 'Herefordshire',
    towns: ['Hereford', 'Leominster', 'Ross-on-Wye', 'Ledbury', 'Bromyard', 'Kington', 'Hay-on-Wye', 'Pembridge', 'Weobley', 'Eardisley']
  },
  'hertfordshire': {
    name: 'Hertfordshire',
    towns: ['Watford', 'Hemel Hempstead', 'Stevenage', 'St Albans', 'Hatfield', 'Welwyn Garden City', 'Cheshunt', 'Letchworth', 'Hitchin', 'Rickmansworth']
  },
  'isle-of-wight': {
    name: 'Isle of Wight',
    towns: ['Newport', 'Ryde', 'Cowes', 'Sandown', 'Shanklin', 'Ventnor', 'Freshwater', 'Yarmouth', 'Bembridge', 'Brading']
  },
  'kent': {
    name: 'Kent',
    towns: ['Maidstone', 'Canterbury', 'Dartford', 'Dover', 'Rochester', 'Margate', 'Folkestone', 'Ashford', 'Tunbridge Wells', 'Sevenoaks']
  },
  'lancashire': {
    name: 'Lancashire',
    towns: ['Preston', 'Blackpool', 'Blackburn', 'Burnley', 'Lancaster', 'Chorley', 'Ormskirk', 'Accrington', 'Fleetwood', 'Lytham St Annes']
  },
  'leicestershire': {
    name: 'Leicestershire',
    towns: ['Leicester', 'Loughborough', 'Hinckley', 'Coalville', 'Melton Mowbray', 'Market Harborough', 'Ashby-de-la-Zouch', 'Wigston', 'Oadby', 'Shepshed']
  },
  'lincolnshire': {
    name: 'Lincolnshire',
    towns: ['Lincoln', 'Grimsby', 'Scunthorpe', 'Boston', 'Grantham', 'Spalding', 'Skegness', 'Gainsborough', 'Sleaford', 'Stamford']
  },
  'merseyside': {
    name: 'Merseyside',
    towns: ['Liverpool', 'Birkenhead', 'St Helens', 'Southport', 'Bootle', 'Crosby', 'Formby', 'Kirkby', 'Prescot', 'Maghull']
  },
  'norfolk': {
    name: 'Norfolk',
    towns: ['Norwich', 'Great Yarmouth', 'Kings Lynn', 'Thetford', 'Dereham', 'Wymondham', 'Cromer', 'Fakenham', 'Attleborough', 'Downham Market']
  },
  'northamptonshire': {
    name: 'Northamptonshire',
    towns: ['Northampton', 'Kettering', 'Corby', 'Wellingborough', 'Rushden', 'Daventry', 'Brackley', 'Towcester', 'Raunds', 'Desborough']
  },
  'northumberland': {
    name: 'Northumberland',
    towns: ['Newcastle upon Tyne', 'Hexham', 'Berwick-upon-Tweed', 'Cramlington', 'Blyth', 'Wansbeck', 'Alnwick', 'Morpeth', 'Ashington', 'Ponteland']
  },
  'north-yorkshire': {
    name: 'North Yorkshire',
    towns: ['York', 'Harrogate', 'Scarborough', 'Middlesbrough', 'Redcar', 'Northallerton', 'Selby', 'Skipton', 'Ripon', 'Malton']
  },
  'nottinghamshire': {
    name: 'Nottinghamshire',
    towns: ['Nottingham', 'Mansfield', 'Worksop', 'Newark-on-Trent', 'Retford', 'Sutton-in-Ashfield', 'Kirkby-in-Ashfield', 'Hucknall', 'Beeston', 'Arnold']
  },
  'oxfordshire': {
    name: 'Oxfordshire',
    towns: ['Oxford', 'Banbury', 'Witney', 'Bicester', 'Abingdon', 'Carterton', 'Kidlington', 'Chipping Norton', 'Didcot', 'Faringdon']
  },
  'rutland': {
    name: 'Rutland',
    towns: ['Oakham', 'Uppingham', 'Cottesmore', 'Ryhall', 'Market Overton', 'Langham', 'Whissendine', 'Ketton', 'Greetham', 'Tinwell']
  },
  'shropshire': {
    name: 'Shropshire',
    towns: ['Shrewsbury', 'Telford', 'Oswestry', 'Bridgnorth', 'Whitchurch', 'Market Drayton', 'Ludlow', 'Newport', 'Wem', 'Much Wenlock']
  },
  'somerset': {
    name: 'Somerset',
    towns: ['Bath', 'Bristol', 'Taunton', 'Bridgwater', 'Yeovil', 'Weston-super-Mare', 'Glastonbury', 'Burnham-on-Sea', 'Chard', 'Clevedon']
  },
  'south-yorkshire': {
    name: 'South Yorkshire',
    towns: ['Sheffield', 'Doncaster', 'Rotherham', 'Barnsley', 'Worsbrough', 'Hoyland', 'Wombwell', 'Chapeltown', 'Stocksbridge', 'Penistone']
  },
  'staffordshire': {
    name: 'Staffordshire',
    towns: ['Stoke-on-Trent', 'Stafford', 'Burton upon Trent', 'Tamworth', 'Newcastle-under-Lyme', 'Cannock', 'Lichfield', 'Kidsgrove', 'Leek', 'Stone']
  },
  'suffolk': {
    name: 'Suffolk',
    towns: ['Ipswich', 'Lowestoft', 'Bury St Edmunds', 'Felixstowe', 'Sudbury', 'Haverhill', 'Beccles', 'Mildenhall', 'Newmarket', 'Woodbridge']
  },
  'surrey': {
    name: 'Surrey',
    towns: ['Guildford', 'Woking', 'Epsom', 'Kingston upon Thames', 'Sutton', 'Croydon', 'Camberley', 'Farnham', 'Esher', 'Leatherhead']
  },
  'tyne-and-wear': {
    name: 'Tyne and Wear',
    towns: ['Newcastle upon Tyne', 'Sunderland', 'South Shields', 'North Shields', 'Gateshead', 'Washington', 'Jarrow', 'Hebburn', 'Wallsend', 'Tynemouth']
  },
  'warwickshire': {
    name: 'Warwickshire',
    towns: ['Birmingham', 'Coventry', 'Warwick', 'Rugby', 'Leamington Spa', 'Nuneaton', 'Bedworth', 'Kenilworth', 'Stratford-upon-Avon', 'Atherstone']
  },
  'west-midlands': {
    name: 'West Midlands',
    towns: ['Birmingham', 'Wolverhampton', 'Coventry', 'Dudley', 'Walsall', 'West Bromwich', 'Solihull', 'Sutton Coldfield', 'Stourbridge', 'Halesowen']
  },
  'west-sussex': {
    name: 'West Sussex',
    towns: ['Brighton', 'Worthing', 'Crawley', 'Chichester', 'Horsham', 'Bognor Regis', 'Haywards Heath', 'East Grinstead', 'Littlehampton', 'Burgess Hill']
  },
  'west-yorkshire': {
    name: 'West Yorkshire',
    towns: ['Leeds', 'Bradford', 'Huddersfield', 'Halifax', 'Wakefield', 'Dewsbury', 'Batley', 'Keighley', 'Castleford', 'Pontefract']
  },
  'wiltshire': {
    name: 'Wiltshire',
    towns: ['Swindon', 'Salisbury', 'Chippenham', 'Trowbridge', 'Devizes', 'Melksham', 'Warminster', 'Calne', 'Corsham', 'Marlborough']
  },
  'worcestershire': {
    name: 'Worcestershire',
    towns: ['Worcester', 'Redditch', 'Kidderminster', 'Bromsgrove', 'Evesham', 'Malvern', 'Droitwich Spa', 'Stourport-on-Severn', 'Bewdley', 'Pershore']
  }
};

function createSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
}

async function populateAllEnglishCounties() {
  console.log('🏴󠁧󠁢󠁥󠁮󠁧󠁿 Populating all English counties and towns...\n');

  // Get current studios to calculate counts
  const { data: studios, error: studiosError } = await supabase
    .from('pilates_studios')
    .select('county, county_slug, city, city_slug')
    .eq('is_active', true);

  if (studiosError) {
    console.error('❌ Error fetching studios:', studiosError);
    return;
  }

  console.log(`📋 Found ${studios.length} active studios to analyze\n`);

  // Count studios by location
  const studioCountsByCounty = {};
  const studioCountsByCity = {};

  studios.forEach(studio => {
    if (studio.county_slug) {
      studioCountsByCounty[studio.county_slug] = (studioCountsByCounty[studio.county_slug] || 0) + 1;
    }
    if (studio.county_slug && studio.city_slug) {
      const cityKey = `${studio.county_slug}/${studio.city_slug}`;
      studioCountsByCity[cityKey] = (studioCountsByCity[cityKey] || 0) + 1;
    }
  });

  // Clear existing locations
  console.log('🧹 Clearing existing locations...');
  const { error: deleteError } = await supabase
    .from('public_locations')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (deleteError) {
    console.error('❌ Error clearing locations:', deleteError);
    return;
  }
  console.log('✅ Cleared existing locations\n');

  // Prepare all counties
  const counties = Object.keys(ENGLISH_COUNTIES).map(slug => ({
    name: ENGLISH_COUNTIES[slug].name,
    slug: slug,
    type: 'county',
    butcher_count: studioCountsByCounty[slug] || 0
  }));

  // Prepare all towns/cities
  const towns = [];
  Object.keys(ENGLISH_COUNTIES).forEach(countySlug => {
    const county = ENGLISH_COUNTIES[countySlug];
    county.towns.forEach(townName => {
      const townSlug = createSlug(townName);
      const cityKey = `${countySlug}/${townSlug}`;
      towns.push({
        name: townName,
        slug: townSlug,
        county_slug: countySlug,
        full_path: `${countySlug}/${townSlug}`,
        type: 'city',
        butcher_count: studioCountsByCity[cityKey] || 0
      });
    });
  });

  console.log(`📊 Prepared data:`);
  console.log(`   Counties: ${counties.length}`);
  console.log(`   Towns/Cities: ${towns.length}`);
  console.log(`   Counties with studios: ${Object.keys(studioCountsByCounty).length}`);
  console.log(`   Towns with studios: ${Object.keys(studioCountsByCity).length}\n`);

  // Insert counties in batches
  console.log('📥 Inserting counties...');
  const countyBatchSize = 25;
  for (let i = 0; i < counties.length; i += countyBatchSize) {
    const batch = counties.slice(i, i + countyBatchSize);
    const { error: countyError } = await supabase
      .from('public_locations')
      .insert(batch);

    if (countyError) {
      console.error(`❌ Error inserting county batch ${Math.floor(i / countyBatchSize) + 1}:`, countyError);
      return;
    }
    console.log(`✅ Inserted county batch ${Math.floor(i / countyBatchSize) + 1}/${Math.ceil(counties.length / countyBatchSize)}`);
  }

  // Insert towns in batches
  console.log('\n📥 Inserting towns and cities...');
  const townBatchSize = 50;
  for (let i = 0; i < towns.length; i += townBatchSize) {
    const batch = towns.slice(i, i + townBatchSize);
    const { error: townError } = await supabase
      .from('public_locations')
      .insert(batch);

    if (townError) {
      console.error(`❌ Error inserting town batch ${Math.floor(i / townBatchSize) + 1}:`, townError);
      return;
    }
    console.log(`✅ Inserted town batch ${Math.floor(i / townBatchSize) + 1}/${Math.ceil(towns.length / townBatchSize)}`);

    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n🎉 Successfully populated all English counties and towns!`);
  console.log(`📊 Final Summary:`);
  console.log(`   Total counties: ${counties.length}`);
  console.log(`   Total towns/cities: ${towns.length}`);
  console.log(`   Total locations: ${counties.length + towns.length}`);

  // Show counties with studios
  const countiesWithStudios = counties.filter(c => c.butcher_count > 0).sort((a, b) => b.butcher_count - a.butcher_count);
  console.log(`\n📍 Counties with pilates studios (${countiesWithStudios.length}):`);
  countiesWithStudios.forEach(county => {
    console.log(`   ${county.name}: ${county.butcher_count} studios`);
  });

  console.log(`\n🌟 Your pilates directory now covers all of England!`);
}

// Run the script
populateAllEnglishCounties().catch(console.error);