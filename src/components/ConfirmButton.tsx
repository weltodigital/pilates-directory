'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Loader2 } from 'lucide-react'

interface ConfirmButtonProps {
  token: string;
  kind: 'claim' | 'submission';
  studioName: string | null;
}

export default function ConfirmButton({ token, kind, studioName }: ConfirmButtonProps) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setBusy(true); setError(null);
    try {
      const res = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'That did not work.'); return; }
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-tint">
          <Check className="h-6 w-6 text-brand" aria-hidden="true" />
        </span>
        <h2 className="mt-6 font-fraunces text-2xl font-semibold">
          {kind === 'claim' ? 'Claim confirmed' : 'Submission confirmed'}
        </h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          {kind === 'claim'
            ? 'Your email address is confirmed and the claim is with us. We check every one by hand, usually the same day, and email you a link to set a password once it is approved.'
            : 'Thanks — that is with us now. We check every studio before it goes on the site, and we will email you when it is live.'}
        </p>
        <Link href="/" className="pill-outline mt-8">Back to the site</Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="font-fraunces text-2xl font-semibold">
        {kind === 'claim'
          ? `Confirm your claim${studioName ? ` for ${studioName}` : ''}`
          : `Confirm you sent us${studioName ? ` ${studioName}` : ' this studio'}`}
      </h2>
      <p className="mt-4 leading-relaxed text-ink-muted">
        {kind === 'claim'
          ? 'This tells us the address really is yours. Nothing happens to the listing until we have also checked the claim by hand.'
          : 'This tells us the address really is yours, so we can reach you if the listing needs a question answered.'}
      </p>

      {error && <p className="mt-5 text-sm text-destructive" role="alert">{error}</p>}

      <button type="button" onClick={confirm} disabled={busy} className="pill-brand mt-8">
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {busy ? 'Confirming' : 'Yes, that was me'}
      </button>

      <p className="mt-6 text-xs leading-relaxed text-ink-faint">
        If it was not you, close this page. Nothing happens unless you press the
        button.
      </p>
    </div>
  );
}
