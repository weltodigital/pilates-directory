-- Fix postcode field length constraint
-- UK postcodes are typically 6-8 characters, but Google Maps might return longer addresses
-- Increasing to 50 characters to handle various address formats

ALTER TABLE pilates_studios
ALTER COLUMN postcode TYPE VARCHAR(50);

-- Add a comment to explain the change
COMMENT ON COLUMN pilates_studios.postcode IS 'Postcode or postal identifier - increased to 50 chars to handle various address formats from data sources';