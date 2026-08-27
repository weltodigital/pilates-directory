'use client'

import { useState } from 'react'
import { Loader2, Mail } from 'lucide-react'
import { Field, Honeypot, inputClass } from '@/components/FormField'

export default function StudioForgotForm() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError(null); setFieldError(undefined);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') || '');
    try {
      const res = await fetch('/api/owner/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company: fd.get('company') }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFieldError(data.errors?.email);
        if (data.error) setError(data.error);
        return;
      }
      setSent(email);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="card-flat mx-auto max-w-md p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-tint">
          <Mail className="h-6 w-6 text-brand" aria-hidden="true" />
        </span>
        <h2 className="mt-6 font-fraunces text-2xl font-semibold">Check your inbox</h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          If <strong className="text-ink">{sent}</strong> belongs to a claimed listing,
          a link to choose a new password is on its way. It works once and expires
          in an hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-flat mx-auto max-w-md p-8">
      <Honeypot />

      <Field
        id="email"
        label="Your email address"
        required
        error={fieldError}
        hint="The address you used when you claimed the listing."
      >
        <input id="email" name="email" type="email" required autoComplete="email" autoFocus className={inputClass} />
      </Field>

      {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}

      <button type="submit" disabled={busy} className="pill-brand mt-6 w-full justify-center">
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {busy ? 'Sending' : 'Email me a reset link'}
      </button>
    </form>
  );
}
