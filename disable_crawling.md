# API Usage Reduction - Crawling Disabled

**Date:** 2025-10-23
**Reason:** Reduce Google Maps API costs

## Disabled Scripts:
All crawling scripts in the root directory and `/scripts/` folder have been identified for disabling:

### Root Directory Scripts:
- crawl_*_pilates.js (25+ files)
- fetch_live_google_data.js
- add_hampshire_studios.js

### Scripts Directory:
- collect-*-pilates.js (20+ files)
- update-existing-studios-with-images.js
- test-pilates-collection.js

## To Re-enable:
1. Set up usage monitoring in Google Cloud Console
2. Implement request caching
3. Add rate limiting to scripts
4. Use batch processing instead of real-time calls

## Current Data:
- Studio data is preserved in database
- No new data collection until API optimization is complete
- Website functionality maintained with cached data