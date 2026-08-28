'use client'

import { useState } from 'react'
import { ArrowUpRight, CalendarCheck, CreditCard, Loader2, Sparkles, XCircle } from 'lucide-react'

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
  /** Studios already listed in this town — what a featured place stands out from. */
  townStudios: number;
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
    studioId, feature, reservedUntil, townName, townStudios, slotsFree,
    slotsTotal, price, eligible, available,
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
                  ? `Cancelled. You stay featured until ${renews ?? 'the end of the month you have paid for'}, and will not be charged again.`
                  : renews
                    ? `${price} a month, renewing ${renews}. Cancel any time under Manage billing — you keep the place until the end of the month you have paid for.`
                    : `${price} a month. Cancel any time under Manage billing.`}
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

  if (!eligible) {
    return (
      <div className="rounded-xl border border-line-strong bg-surface-sunken p-6 sm:p-7">
        <h3 className="flex items-center gap-2 font-fraunces text-lg font-semibold">
          <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
          Feature this listing
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
          Once we have verified this listing, you can put it at the top of your
          town page.
        </p>
      </div>
    );
  }

  if (full) {
    return (
      <div className="rounded-xl border border-line-strong bg-surface-sunken p-6 sm:p-7">
        <h3 className="flex items-center gap-2 font-fraunces text-lg font-semibold">
          <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
          Featured places in {townName} are taken
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
          There are only {slotsTotal}, and all of them are in use at the moment.
          One opens up whenever a studio stops, and we are working on other ways
          to stand out. It is worth checking back.
        </p>
      </div>
    );
  }

  // Written as what the owner gets, not what the panel does. Every claim is
  // something this site demonstrably arranges - nothing about more bookings
  // or more customers, which no directory can promise and which is what stops
  // people renewing when it does not happen.
  const REASONS = [
    {
      icon: ArrowUpRight,
      title: 'Get chosen before the comparing starts',
      body: townStudios > 1
        ? `Someone looking for pilates in ${townName} arrives with no shortlist. You are the studio they read about first, rather than one of ${townStudios} they work through.`
        : `Someone looking for pilates in ${townName} arrives with no shortlist. You are the studio they read about first, in a panel of your own before the rest of the page.`,
    },
    {
      icon: Sparkles,
      title: 'Stop waiting on reviews to be seen',
      body: 'Studios below are ordered by rating and review count, so a newer one starts near the bottom however good it is. A featured place puts you above that from the day you take it, and keeps you there.',
    },
    {
      icon: CalendarCheck,
      title: 'Send them straight to your timetable',
      body: 'Your card carries a Book a class button that opens your own booking system. Someone ready to book gets there in one step, instead of finding your listing, then your website, then your timetable.',
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border-2 border-brand/25 bg-brand-tint">
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 max-w-2xl">
            <span className="chip border-transparent bg-brand text-white">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Featured listing
            </span>
            <h3 className="mt-4 font-fraunces text-xl font-semibold text-brand-ink">
              Be the first studio people see in {townName}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-ink/80">
              Only {slotsTotal} studios in {townName} can hold a featured place,
              so it stays worth having. {slotsFree} of {slotsTotal}{' '}
              {slotsFree === 1 ? 'is' : 'are'} available now.
            </p>
          </div>
        </div>

        <ul className="mt-7 grid gap-5 sm:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
              <h4 className="mt-3 text-sm font-semibold text-brand-ink">{title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-ink/75">{body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-brand/15 bg-surface px-6 py-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="min-w-0">
            <p className="font-fraunces text-2xl font-semibold">
              {price}
              <span className="ml-1.5 font-sans text-base font-normal text-ink-muted">
                a month
              </span>
            </p>
            <p className="mt-1.5 flex items-start gap-1.5 text-sm leading-relaxed text-ink-muted">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
              <span>
                Cancel any time from this page. No contract and no notice
                period — you keep the place until the end of the month you have
                paid for, and are not charged again.
              </span>
            </p>
          </div>

          {available && (
            <button
              type="button"
              onClick={() => go('/api/owner/featured/checkout')}
              disabled={busy}
              className="pill-brand shrink-0"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {busy ? 'Opening' : `Feature for ${price} a month`}
            </button>
          )}
        </div>

        {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}

        <p className="mt-4 text-xs leading-relaxed text-ink-faint">
          Payment is handled by Stripe; we never see your card details. Your
          place starts the moment payment goes through, and renews on the same
          date each month until you stop it.
        </p>
      </div>
    </div>
  );
}
