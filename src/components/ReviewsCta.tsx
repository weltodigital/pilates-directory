import { Star } from 'lucide-react'

interface ReviewsCtaProps {
  /** Location name, e.g. "Kent" or "Camden". Omit for a generic call to action. */
  locationName?: string;
  /**
   * "owner" addresses someone already signed in to a listing they hold, so it
   * drops the "do you own a studio?" opener - they have just proved they do.
   */
  variant?: 'directory' | 'owner';
}

export default function ReviewsCta({ locationName, variant = 'directory' }: ReviewsCtaProps) {
  const owner = variant === 'owner';

  return (
    <section className="rounded-xl border border-brand/20 bg-brand-tint p-8 sm:p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-fraunces text-2xl font-semibold text-brand-ink">
            {owner
              ? 'More reviews, more bookings'
              : locationName
                ? `Own a pilates studio in ${locationName}?`
                : 'Own a pilates studio?'}
          </h2>
          <p className="mt-3 leading-relaxed text-brand-ink/80">
            {owner
              ? 'Your listing is only half the story - the studios people book are the ones with recent reviews. Grow Our Reviews collects genuine 5-star Google reviews on autopilot.'
              : 'More reviews mean more bookings. Grow Our Reviews helps studios like yours collect genuine 5-star Google reviews on autopilot — so new clients find you first.'}
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
