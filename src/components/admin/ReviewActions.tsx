'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'
import { inputClass } from '@/components/FormField'

export interface Choice {
  action: string;
  label: string;
  tone?: 'brand' | 'quiet';
}

interface PromoteOptions {
  counties: { slug: string; name: string }[];
  defaultCounty: string | null;
  defaultCity: string;
}

interface ReviewActionsProps {
  kind: 'submission' | 'claim' | 'edit' | 'photo';
  id: string;
  choices: Choice[];
  /** Present only for submissions, where approving also decides the URL. */
  promote?: PromoteOptions;
}

/**
 * The note is not decoration. Every decision writes to admin_actions, and a
 * rejection emails the person who sent it, so what is typed here is what they
 * are told.
 */
export default function ReviewActions({ kind, id, choices, promote }: ReviewActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [county, setCounty] = useState(promote?.defaultCounty || '');
  const [city, setCity] = useState(promote?.defaultCity || '');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function run(action: string) {
    setBusy(action); setError(null);
    try {
      const res = await fetch('/api/admin/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind, id, action, note,
          ...(promote && action === 'approve' ? { county_slug: county, city_name: city } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'That did not work.'); return; }
      setDone(data.message || 'Done.');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(null);
    }
  }

  if (done) {
    return (
      <p className="mt-5 flex items-center gap-2 text-sm font-medium text-brand">
        <Check className="h-4 w-4" aria-hidden="true" />
        {done}
      </p>
    );
  }

  return (
    <div className="mt-6 border-t border-line pt-5">
      {promote && (
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={`county-${id}`} className="block text-xs font-medium text-ink-muted">
              County (decides the URL)
            </label>
            <select
              id={`county-${id}`}
              value={county}
              onChange={e => setCounty(e.target.value)}
              className={`${inputClass} mt-1.5`}
            >
              <option value="">Choose a county</option>
              {promote.counties.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`city-${id}`} className="block text-xs font-medium text-ink-muted">
              Town
            </label>
            <input
              id={`city-${id}`}
              value={city}
              onChange={e => setCity(e.target.value)}
              className={`${inputClass} mt-1.5`}
            />
          </div>
        </div>
      )}

      <label htmlFor={`note-${id}`} className="block text-xs font-medium text-ink-muted">
        Note {choices.some(c => c.action !== 'approve') && '(sent to them if you reject)'}
      </label>
      <textarea
        id={`note-${id}`}
        rows={2}
        value={note}
        onChange={e => setNote(e.target.value)}
        className={`${inputClass} mt-1.5 resize-y`}
      />

      {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {choices.map(choice => (
          <button
            key={choice.action}
            type="button"
            disabled={Boolean(busy)}
            onClick={() => run(choice.action)}
            className={choice.tone === 'quiet' ? 'pill-outline' : 'pill-brand'}
          >
            {busy === choice.action && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
}
