-- Update H1 titles for all location pages to "Discover Pilates Classes in [Location Name]"
-- This script standardizes the H1 format across all county, city, and town pages

UPDATE public_locations SET
  h1_title = 'Discover Pilates Classes in ' || name
WHERE type IN ('county', 'city', 'town');