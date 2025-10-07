-- Add images column to pilates_studios table to store Google Business Profile images
ALTER TABLE pilates_studios
ADD COLUMN images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add comment to explain the column
COMMENT ON COLUMN pilates_studios.images IS 'Array of image URLs from Google Business Profile photos';

-- Update existing records to have empty array (in case any have NULL)
UPDATE pilates_studios SET images = ARRAY[]::TEXT[] WHERE images IS NULL;