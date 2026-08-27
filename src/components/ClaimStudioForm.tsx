'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Check } from 'lucide-react'
import { Field, Honeypot, inputClass } from '@/components/FormField'

interface ClaimStudioFormProps {
  studioPath: string;
  studioName: string;
  /** The studio's own domain; claims must come from an address here. */
  studioDomain: string;
}

export default function ClaimStudioForm({ studioPath, studioName, studioDomain }: ClaimStudioFormProps) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ already?: boolean } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setErrors({}); setFormError(null);

    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/claim-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studio_path: studioPath,
          claimant_name: fd.get('claimant_name'),
          claimant_email: fd.get('claimant_email'),
          claimant_phone: fd.get('claimant_phone'),
          claimant_role: fd.get('claimant_role'),
          message: fd.get('message'),
          company: fd.get('company'),   // honeypot
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        if (data.error) setFormError(data.error);
        return;
      }
      setDone({ already: data.already });
    } catch {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card-flat mx-auto max-w-xl p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-tint">
          <Check className="h-6 w-6 text-brand" aria-hidden="true" />
        </span>
        <h2 className="mt-6 font-fraunces text-2xl font-semibold">
          {done.already ? 'Already with us' : 'Claim received'}
        </h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          {done.already
            ? `We already have an open claim for ${studioName} from this email address, so there's nothing more you need to do.`
            : `Your address at ${studioDomain} matches ${studioName}'s website, so the claim is with us. We check every one by hand.`}
        </p>
        {!done.already && (
          <ol className="mx-auto mt-6 max-w-sm space-y-3 text-left text-sm leading-relaxed text-ink-muted">
            <li className="flex gap-3">
              <span className="font-semibold text-brand">1</span>
              We review the claim, usually the same day.
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-brand">2</span>
              You get an email at that address with a link to choose a password.
              Following it is what proves the address is really yours.
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-brand">3</span>
              Sign in any time to update your classes, prices, opening hours and
              booking link. Changes are checked by us before they go live.
            </li>
          </ol>
        )}
        <Link href={`/${studioPath}`} className="pill-outline mt-8">
          Back to the listing
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-8" noValidate>
      <Honeypot />

      {formError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-ink" role="alert">
          {formError}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="claimant_name" label="Your name" required error={errors.claimant_name}>
          <input id="claimant_name" name="claimant_name" className={inputClass} autoComplete="name" />
        </Field>
        <Field id="claimant_role" label="Your role" error={errors.claimant_role}>
          <input id="claimant_role" name="claimant_role" className={inputClass} placeholder="Owner, manager, instructor" />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="claimant_email" label={`Your email at ${studioDomain}`} required error={errors.claimant_email}
               hint={`Must be an address at ${studioDomain}. Holding one is how we confirm you're connected to the studio.`}>
          <input id="claimant_email" name="claimant_email" type="email" className={inputClass}
                 autoComplete="email" placeholder={`you@${studioDomain}`} />
        </Field>
        <Field id="claimant_phone" label="Phone" error={errors.claimant_phone}>
          <input id="claimant_phone" name="claimant_phone" className={inputClass} inputMode="tel" autoComplete="tel" />
        </Field>
      </div>

      <Field id="message" label="Anything to correct?" error={errors.message}
             hint="Tell us about anything on the listing that's out of date.">
        <textarea id="message" name="message" rows={4} className={inputClass} />
      </Field>

      <div className="border-t border-line pt-8">
        <button type="submit" disabled={busy} className="pill-brand disabled:opacity-60">
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Submit claim
        </button>
        <p className="mt-4 text-xs leading-relaxed text-ink-faint">
          Claiming is free. Once we&apos;ve approved it, we email this address a
          link to set a password, and you can sign in and keep the listing up to
          date. We never ask for access to your inbox or your booking system.
        </p>
      </div>
    </form>
  );
}
