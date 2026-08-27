'use client'

import { useState } from 'react'
import { CreditCard, Loader2, Sparkles } from 'lucide-react'

interface FeaturedControlsProps {
  studioId: string;
  /** Present only when the listing is actually paid for. */
  feature: {
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
  /**
   * Set when a checkout was started and never finished. The place is held,
   * but nothing has been paid, and saying "Featured" here would be a lie.
   */
  reservedUntil: string | null;
  townName: string;
  slotsFree: number;
  slotsTotal: number;
  price: string;
  /** False when the listing has not been verified, so cannot be featured. */
  eligible: boolean;
  /** False when no payment provider is configured. */
  available: boolean;
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function FeaturedControls(props: FeaturedControlsProps) {
  const {
    studioId, feature, reservedUntil, townName, slotsFree, slotsTotal, price,
    eligible, available,
  } = props;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go(endpoint: string) {
    setBusy(true); setError(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studio_id: studioId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || 'That did not work. Please try again.');
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Something went wrong. Please try again.');
      setBusy(false);
    }
  }

  // ------------------------------------------------------------- subscribed
  if (feature) {
    const renews = formatDate(feature.currentPeriodEnd);
    return (
      <div className="rounded-xl border-2 border-brand/30 bg-brand-tint p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <span className="chip border-transparent bg-brand text-white">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Featured
            </span>
            <h3 className="mt-3 font-fraunces text-lg font-semibold text-brand-ink">
              Top of the {townName} page
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-brand-ink/80">
              {feature.status === 'past_due'
                ? 'Your last payment did not go through. Your place is held while we retry — update your card to keep it.'
                : feature.cancelAtPeriodEnd
                  ? `Cancelled. You stay featured until ${renews ?? 'the end of the period'}, then the place is released.`
                  : renews
                    ? `${price} a month. Renews ${renews}.`
                    : `${price} a month.`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => go('/api/owner/featured/portal')}
            disabled={busy}
            className="pill-outline shrink-0 bg-surface"
          >
            {busy
              ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              : <CreditCard className="h-4 w-4" aria-hidden="true" />}
            Manage billing
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}
      </div>
    );
  }

  // --------------------------------------------- started, never finished
  if (reservedUntil) {
    const until = new Date(reservedUntil).toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit',
    });
    return (
      <div className="rounded-xl border border-line-strong bg-surface-sunken p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0 max-w-xl">
            <h3 className="flex items-center gap-2 font-fraunces text-lg font-semibold">
              <Sparkles className="h-4 w-4 text-ink-faint" aria-hidden="true" />
              Payment not finished
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              You started featuring this listing but did not complete the
              payment, so nothing has been charged and it is not featured yet.
              We are holding your place until {until}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => go('/api/owner/featured/checkout')}
            disabled={busy}
            className="pill-brand shrink-0"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {busy ? 'Opening' : 'Finish payment'}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}
      </div>
    );
  }

  // ------------------------------------------------------- not subscribed
  const full = slotsFree === 0;

  return (
    <div className="rounded-xl border border-line-strong bg-surface-sunken p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0 max-w-xl">
          <h3 className="flex items-center gap-2 font-fraunces text-lg font-semibold">
            <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
            Feature this listing
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {!eligible
              ? 'Once we have verified this listing, you can put it at the top of your town page.'
              : full
                ? `All ${slotsTotal} featured places in ${townName} are taken at the moment. One opens up whenever a studio stops, and we will add more ways to stand out soon.`
                : `Sit at the top of the ${townName} page, above every other studio, for ${price} a month. ${slotsFree} of ${slotsTotal} places ${slotsFree === 1 ? 'is' : 'are'} available. Cancel any time.`}
          </p>
        </div>

        {eligible && !full && available && (
          <button
            type="button"
            onClick={() => go('/api/owner/featured/checkout')}
            disabled={busy}
            className="pill-brand shrink-0"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {busy ? 'Opening' : `Feature for ${price}/month`}
          </button>
        )}
      </div>
      {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}
    </div>
  );
}
