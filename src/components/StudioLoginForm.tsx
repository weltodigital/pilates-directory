'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Field, Honeypot, inputClass } from '@/components/FormField'

export default function StudioLoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError(null);

    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/owner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: fd.get('email'),
          password: fd.get('password'),
          company: fd.get('company'),   // honeypot
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Sign-in failed.'); return; }
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
      <Honeypot />

      <Field id="email" label="Email address" required>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          className={inputClass}
        />
      </Field>

      <div className="mt-6">
        <Field id="password" label="Password" required>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </Field>
      </div>

      {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}

      <button type="submit" disabled={busy} className="pill-brand mt-6 w-full justify-center">
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {busy ? 'Signing in' : 'Sign in'}
      </button>

      <p className="mt-5 text-center text-sm">
        <Link href="/studio-login/forgot" className="link-quiet">
          Forgotten your password?
        </Link>
      </p>
    </form>
  );
}
