'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MapPin, Star, Navigation, Search, Loader2, ArrowRight, ShieldCheck } from 'lucide-react'
import StudioLocationsMap from '@/components/StudioLocationsMap'
import { formatDistance } from '@/lib/geo'

interface Result {
  id: string;
  name: string;
  city: string | null;
  address: string | null;
  postcode: string | null;
  latitude: number;
  longitude: number;
  google_rating: number | null;
  google_review_count: number | null;
  full_url_path: string | null;
  distanceMetres: number;
  is_verified: boolean | null;
}

export default function NearSearch({ initialPostcode }: { initialPostcode?: string }) {
  const [postcode, setPostcode] = useState(initialPostcode ?? '');
  const [results, setResults] = useState<Result[] | null>(null);
  const [label, setLabel] = useState('');
  const [radiusKm, setRadiusKm] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(query: string) {
    setBusy(true); setError(null);
    try {
      const res = await fetch(`/api/near?${query}&limit=24`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Search failed.'); setResults(null); return; }
      setResults(data.studios);
      setLabel(data.label);
      setRadiusKm(data.radiusKm);
      if (!data.studios.length) setError('No studios found nearby.');
    } catch {
      setError('Something went wrong. Please try again.');
      setResults(null);
    } finally {
      setBusy(false);
    }
  }

  // A postcode arriving in the URL - from a studio's address, say - should
  // land on results rather than on a filled-in box waiting to be submitted.
  // The ref stops it running again on every render.
  const ranInitial = useRef(false);
  useEffect(() => {
    if (ranInitial.current || !initialPostcode?.trim()) return;
    ranInitial.current = true;
    run(`postcode=${encodeURIComponent(initialPostcode.trim())}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPostcode]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postcode.trim()) { setError('Enter a postcode to search.'); return; }
    run(`postcode=${encodeURIComponent(postcode.trim())}`);
  }

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      setError('Your browser does not support location sharing. Enter a postcode instead.');
      return;
    }
    setLocating(true); setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setPostcode('');
        run(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
      },
      (err) => {
        setLocating(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location access was declined. Enter a postcode instead.'
            : 'We could not get your location. Enter a postcode instead.'
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }

  return (
    <>
      {/* Search controls */}
      <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="postcode" className="sr-only">Postcode</label>
          <input
            id="postcode"
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Enter a postcode, e.g. SW11 4NJ"
            autoComplete="postal-code"
            className="flex-1 rounded-full border border-line-strong bg-surface px-5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-brand"
          />
          <button type="submit" disabled={busy} className="pill-brand disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  : <Search className="h-4 w-4" aria-hidden="true" />}
            Search
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating || busy}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand underline-offset-4 hover:underline disabled:opacity-60"
          >
            {locating
              ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              : <Navigation className="h-4 w-4" aria-hidden="true" />}
            Use my current location
          </button>
        </div>
      </form>

      {error && (
        <p className="mx-auto mt-6 max-w-xl rounded-md border border-line bg-surface-sunken px-5 py-4 text-center text-sm text-ink-muted">
          {error}
        </p>
      )}

      {/* Results */}
      {results && results.length > 0 && (
        <div className="mt-16 space-y-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-fraunces text-2xl font-semibold">
              {results.length} studios near {label}
            </h2>
            {radiusKm && (
              <span className="text-sm text-ink-faint">
                within {radiusKm} km
              </span>
            )}
          </div>

          <div className="card-flat overflow-hidden">
            <StudioLocationsMap studios={results as any} heightClass="h-[26rem]" />
          </div>

          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((s, i) => (
              <li key={s.id} className="card-flat flex flex-col p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                      {i + 1} · {formatDistance(s.distanceMetres)}
                    </span>
                    <h3 className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-fraunces text-xl font-semibold leading-snug">
                      {s.full_url_path
                        ? <Link href={`/${s.full_url_path}`} className="transition-colors hover:text-brand">{s.name}</Link>
                        : s.name}
                      {s.is_verified && (
                        <span className="chip chip-brand shrink-0 font-sans">
                          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                          Verified
                        </span>
                      )}
                    </h3>
                    <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-muted">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{s.address}</span>
                    </p>
                  </div>
                  {s.google_rating && (
                    <span className="chip shrink-0">
                      <Star className="h-3.5 w-3.5 fill-brand text-brand" aria-hidden="true" />
                      <span className="font-semibold text-ink">{s.google_rating.toFixed(1)}</span>
                    </span>
                  )}
                </div>

                {s.full_url_path && (
                  <Link
                    href={`/${s.full_url_path}`}
                    className="mt-auto inline-flex items-center gap-1.5 border-t border-line pt-5 text-sm font-semibold text-brand transition-colors hover:text-brand-hover"
                  >
                    View studio
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}
