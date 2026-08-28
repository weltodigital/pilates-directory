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
 * Plain img rather than next/image: these come from Supabase storage already
 * sized and cached for a year, and routing them through the optimiser would
 * bill us per transformation for pictures that do not change.
 */
export default function StudioGallery({
  photos, studioName,
}: { photos: Photo[]; studioName: string }) {
  if (!photos.length) return null;

  const [lead, ...rest] = photos;

  return (
    <section aria-label={`Photos of ${studioName}`}>
      <div className="grid gap-3 sm:grid-cols-4 sm:grid-rows-2">
        <a
          href={lead.public_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-xl border border-line sm:col-span-2 sm:row-span-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lead.public_url}
            alt={lead.alt || `${studioName}`}
            width={lead.width ?? undefined}
            height={lead.height ?? undefined}
            className="block h-full w-full bg-surface-sunken object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </a>

        {rest.slice(0, 4).map((photo, i) => (
          <a
            key={photo.id}
            href={photo.public_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-xl border border-line"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.public_url}
              alt={photo.alt || `${studioName}, photo ${i + 2}`}
              width={photo.width ?? undefined}
              height={photo.height ?? undefined}
              loading="lazy"
              className="block aspect-[4/3] w-full bg-surface-sunken object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </a>
        ))}
      </div>

      <p className="mt-3 text-xs text-ink-faint">
        Photos supplied by {studioName}.
      </p>
    </section>
  );
}
