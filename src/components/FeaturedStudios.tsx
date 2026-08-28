import Link from 'next/link'
import { CalendarCheck, MapPin, Phone, Sparkles, Star } from 'lucide-react'

interface FeaturedStudio {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  full_url_path: string;
  description: string | null;
  google_rating: number | null;
  google_review_count: number | null;
  class_types: string[] | null;
  price_drop_in: number | null;
  booking_url: string | null;
  phone: string | null;
}

/**
 * The featured slots at the top of a town page.
 *
 * Every card carries a Featured badge, and the panel is visibly separate from
 * the list below it. That separation is the point: the rest of the page is
 * ordered by rating and distance, and a promotion that reads as an editorial
 * pick would quietly make that claim untrue. "Featured" is the word people
 * already read as promoted, which is what the CAP Code asks for.
 */
export default function FeaturedStudios({
  studios, townName,
}: { studios: FeaturedStudio[]; townName: string }) {
  if (!studios.length) return null;

  return (
    <section aria-label={`Featured studios in ${townName}`}>
      <div className="overflow-hidden rounded-xl border-2 border-brand shadow-[0_16px_40px_-20px_hsl(var(--brand)/0.55)]">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-brand px-6 py-3">
          <h2 className="flex items-center gap-2 font-fraunces text-base font-semibold text-white">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Featured
          </h2>
          <p className="text-xs text-white/80">
            {studios.length === 1 ? 'A studio' : 'Studios'} we&apos;re highlighting this month
          </p>
        </div>

        <div className="grid gap-px bg-brand/20 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => {
            const blurb = studio.description
              ? studio.description.split(' ').slice(0, 22).join(' ') +
                (studio.description.split(' ').length > 22 ? '…' : '')
              : null;

            return (
              <article key={studio.id} className="flex flex-col bg-surface p-7">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-fraunces text-lg font-semibold leading-snug">
                    <Link
                      href={`/${studio.full_url_path}`}
                      className="transition-colors hover:text-brand"
                    >
                      {studio.name}
                    </Link>
                  </h3>
                  {studio.google_rating && (
                    <span className="chip shrink-0">
                      <Star className="h-3.5 w-3.5 fill-brand text-brand" aria-hidden="true" />
                      <span className="font-semibold text-ink">
                        {studio.google_rating.toFixed(1)}
                      </span>
                    </span>
                  )}
                </div>

                {studio.address && (
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-muted">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{studio.address}</span>
                  </p>
                )}

                {blurb && (
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">{blurb}</p>
                )}

                {studio.class_types && studio.class_types.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {studio.class_types.slice(0, 3).map((type) => (
                      <span key={type} className="chip chip-brand">{type}</span>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5">
                  {studio.booking_url ? (
                    <a
                      href={studio.booking_url}
                      target="_blank"
                      rel="nofollow noopener noreferrer sponsored"
                      className="pill-brand px-4 py-2 text-xs"
                    >
                      <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Book a class
                    </a>
                  ) : (
                    <Link href={`/${studio.full_url_path}`} className="pill-brand px-4 py-2 text-xs">
                      View studio
                    </Link>
                  )}
                  {studio.phone && (
                    <a
                      href={`tel:${studio.phone}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-brand"
                    >
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      {studio.phone}
                    </a>
                  )}
                  {studio.price_drop_in && (
                    <span className="text-xs text-ink-faint">
                      from £{Number(studio.price_drop_in).toFixed(2).replace(/\.00$/, '')}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
