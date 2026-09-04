interface Photo {
  id: string;
  public_url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
}

/**
 * Photos the studio uploaded and we approved.
 *
 * Every tile is the same 4:3 box and every photo is cropped to fill it. The
 * uploads are whatever came off a phone - most are portrait, several times
 * taller than they are wide - so letting each picture set its own height gave
 * a grid of mismatched tiles with dead space under the short ones.
 *
 * Not linked to the full-size file: a picture of a studio is there to show
 * the room, and opening a 3000px original in a bare tab is not a viewer.
 *
 * Plain img rather than next/image: these come from Supabase storage already
 * sized, and routing them through the optimiser would bill us per
 * transformation for pictures that do not change.
 */
export default function StudioGallery({
  photos, studioName,
}: { photos: Photo[]; studioName: string }) {
  if (!photos.length) return null;

  return (
    <section aria-label={`Photos of ${studioName}`}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="overflow-hidden rounded-xl border border-line bg-surface-sunken"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.public_url}
              alt={photo.alt || (i === 0 ? studioName : `${studioName}, photo ${i + 1}`)}
              width={photo.width ?? undefined}
              height={photo.height ?? undefined}
              loading={i < 4 ? undefined : 'lazy'}
              className="block aspect-[4/3] w-full object-cover"
            />
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-ink-faint">
        Photos supplied by {studioName}.
      </p>
    </section>
  );
}
