/**
 * Owner photo uploads.
 *
 * The type is decided by reading the file, not by believing the browser.
 * Content-Type is whatever the client says it is, and an executable renamed
 * to .jpg arrives with image/jpeg on it just as readily as a photograph does.
 */

export const MAX_PHOTOS = 8
export const MAX_BYTES = 5 * 1024 * 1024
export const BUCKET = 'studio-photos'

export const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'] as const

/** The real type, from the file's own leading bytes. Null if it is not one we take. */
export function sniffImageType(bytes: Uint8Array): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  if (bytes.length < 12) return null;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (png.every((b, i) => bytes[i] === b)) return 'image/png';

  // WebP: "RIFF" .... "WEBP"
  const ascii = (from: number, to: number) =>
    String.fromCharCode(...Array.from(bytes.slice(from, to)));
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';

  return null;
}

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function extensionFor(contentType: string): string {
  return EXTENSIONS[contentType] || 'jpg';
}

/**
 * Pixel dimensions from the header, so a photo can be rendered without
 * shifting the page while it loads. Best effort: a photo whose size we cannot
 * read is still a photo.
 */
export function readDimensions(
  bytes: Uint8Array, type: string
): { width: number; height: number } | null {
  try {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    if (type === 'image/png') {
      return { width: view.getUint32(16), height: view.getUint32(20) };
    }

    if (type === 'image/webp' && String.fromCharCode(...Array.from(bytes.slice(12, 16))) === 'VP8X') {
      return {
        width: 1 + (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)),
        height: 1 + (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)),
      };
    }

    if (type === 'image/jpeg') {
      // Walk the segment markers to the frame header, which carries the size.
      let i = 2;
      while (i < bytes.length - 9) {
        if (bytes[i] !== 0xff) { i++; continue; }
        const marker = bytes[i + 1];
        // SOF0-SOF15, excluding the four that are not frame headers
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { height: view.getUint16(i + 5), width: view.getUint16(i + 7) };
        }
        i += 2 + view.getUint16(i + 2);
      }
    }
  } catch {
    /* unreadable header; the photo is still fine */
  }
  return null;
}

/** Approved photos for a studio, in the order the owner arranged them. */
export async function studioPhotos(supabase: any, studioId: string) {
  const { data } = await supabase
    .from('studio_photos')
    .select('id, public_url, alt, width, height')
    .eq('studio_id', studioId)
    .eq('status', 'approved')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true });
  return data || [];
}
