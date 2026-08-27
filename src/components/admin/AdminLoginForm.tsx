'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'
import { inputClass } from '@/components/FormField'

export default function AdminLoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError(null);

    const password = new FormData(e.currentTarget).get('password');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Sign-in failed.'); return; }
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-flat w-full max-w-sm p-8">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-tint">
        <Lock className="h-5 w-5 text-brand" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-center font-fraunces text-xl font-semibold">Admin</h1>

      <label htmlFor="password" className="mt-7 block text-sm font-medium text-ink">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        className={`${inputClass} mt-2`}
      />

      {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}

      <button type="submit" disabled={busy} className="pill-brand mt-6 w-full justify-center">
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {busy ? 'Checking' : 'Sign in'}
      </button>
    </form>
  );
}
