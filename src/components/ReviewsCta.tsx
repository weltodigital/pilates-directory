import { Star } from 'lucide-react'

interface ReviewsCtaProps {
  /** Location name, e.g. "Kent" or "Camden". Omit for a generic call to action. */
  locationName?: string;
}

export default function ReviewsCta({ locationName }: ReviewsCtaProps) {
  return (
    <section className="rounded-xl border border-brand/20 bg-brand-tint p-8 sm:p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-fraunces text-2xl font-semibold text-brand-ink">
            {locationName
              ? `Own a pilates studio in ${locationName}?`
              : 'Own a pilates studio?'}
          </h2>
          <p className="mt-3 leading-relaxed text-brand-ink/80">
            More reviews mean more bookings. Grow Our Reviews helps studios like
            yours collect genuine 5-star Google reviews on autopilot — so new
            clients find you first.
          </p>
        </div>
        <a
          href="https://www.growourreviews.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="pill-brand shrink-0"
        >
          <Star className="h-4 w-4" aria-hidden="true" />
          Get more reviews
        </a>
      </div>
    </section>
  );
}
