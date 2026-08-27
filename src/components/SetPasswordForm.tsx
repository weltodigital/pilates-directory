'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Field, inputClass } from '@/components/FormField'
import { MIN_PASSWORD_LENGTH } from '@/lib/password-rules'

interface SetPasswordFormProps {
  token: string;
  email: string;
}

export default function SetPasswordForm({ token, email }: SetPasswordFormProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({}); setError(null);

    const fd = new FormData(e.currentTarget);
    const password = String(fd.get('password') || '');
    if (password !== String(fd.get('confirm') || '')) {
      setErrors({ confirm: 'Both passwords need to match.' });
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/owner/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        if (data.error) setError(data.error);
        return;
      }
      router.replace('/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-flat mx-auto max-w-md p-8">
      <p className="text-sm text-ink-muted">
        Setting the password for <strong className="text-ink">{email}</strong>
      </p>

      <div className="mt-6">
        <Field
          id="password"
          label="New password"
          required
          error={errors.password}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters. A few words strung together works well.`}
        >
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            autoFocus
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field id="confirm" label="Type it again" required error={errors.confirm}>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            autoComplete="new-password"
            className={inputClass}
          />
        </Field>
      </div>

      {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}

      <button type="submit" disabled={busy} className="pill-brand mt-6 w-full justify-center">
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {busy ? 'Saving' : 'Save and sign in'}
      </button>
    </form>
  );
}
