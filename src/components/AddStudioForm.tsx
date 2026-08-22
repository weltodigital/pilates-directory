'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Check, AlertTriangle } from 'lucide-react'
import { Field, Honeypot, inputClass } from '@/components/FormField'

const CLASS_TYPES = [
  'Reformer Pilates', 'Mat Pilates', 'Clinical Pilates', 'Prenatal Pilates',
  'Postnatal Pilates', 'Barre', 'Tower Pilates', 'Chair Pilates',
  'Private Pilates', 'Beginner Pilates',
];

export default function AddStudioForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ duplicate?: { name: string } | null } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [classTypes, setClassTypes] = useState<string[]>([]);

  function toggleType(t: string) {
    setClassTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setErrors({}); setFormError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name'),
      address: fd.get('address'),
      postcode: fd.get('postcode'),
      town: fd.get('town'),
      website: fd.get('website'),
      phone: fd.get('phone'),
      class_types: classTypes,
      contact_name: fd.get('contact_name'),
      contact_email: fd.get('contact_email'),
      contact_role: fd.get('contact_role'),
      message: fd.get('message'),
      company: fd.get('company'),      // honeypot
    };

    try {
      const res = await fetch('/api/submit-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        if (data.error) setFormError(data.error);
        return;
      }
      setDone({ duplicate: data.duplicate });
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
        <h2 className="mt-6 font-fraunces text-2xl font-semibold">Thank you</h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          We&apos;ve received your studio and will review it before it goes live.
          Listings are free, and we&apos;ll email you once it&apos;s published.
        </p>
        {done.duplicate && (
          <p className="mt-6 rounded-md border border-line bg-surface-sunken px-5 py-4 text-left text-sm text-ink-muted">
            <AlertTriangle className="mr-2 inline h-4 w-4 text-brand" aria-hidden="true" />
            We may already list a studio called <strong className="text-ink">{done.duplicate.name}</strong> at
            that postcode. If so, we&apos;ll merge your details rather than
            creating a second entry.
          </p>
        )}
        <Link href="/" className="pill-outline mt-8">Back to home</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-10" noValidate>
      <Honeypot />

      {formError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-ink" role="alert">
          {formError}
        </p>
      )}

      <fieldset className="space-y-6">
        <legend className="font-fraunces text-xl font-semibold">About the studio</legend>

        <Field id="name" label="Studio name" required error={errors.name}>
          <input id="name" name="name" className={inputClass} placeholder="e.g. Riverside Reformer Pilates" />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="postcode" label="Postcode" required error={errors.postcode}
                 hint="We use this to place the studio on the map.">
            <input id="postcode" name="postcode" className={inputClass} placeholder="SW11 4NJ" autoComplete="postal-code" />
          </Field>
          <Field id="town" label="Town or city" error={errors.town}>
            <input id="town" name="town" className={inputClass} placeholder="Battersea" />
          </Field>
        </div>

        <Field id="address" label="Street address" error={errors.address}>
          <input id="address" name="address" className={inputClass} placeholder="12 Example Street" />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="website" label="Website" error={errors.website}>
            <input id="website" name="website" className={inputClass} placeholder="riversidepilates.co.uk" inputMode="url" />
          </Field>
          <Field id="phone" label="Phone" error={errors.phone}>
            <input id="phone" name="phone" className={inputClass} placeholder="020 7946 0000" inputMode="tel" />
          </Field>
        </div>

        <div>
          <span className="block text-sm font-medium text-ink">
            Classes offered
            <span className="ml-2 text-xs font-normal text-ink-faint">optional</span>
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {CLASS_TYPES.map(t => {
              const on = classTypes.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleType(t)}
                  aria-pressed={on}
                  className={`chip transition-colors ${on ? 'chip-brand' : 'hover:border-brand hover:text-brand'}`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6 border-t border-line pt-10">
        <legend className="font-fraunces text-xl font-semibold">About you</legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="contact_name" label="Your name" required error={errors.contact_name}>
            <input id="contact_name" name="contact_name" className={inputClass} autoComplete="name" />
          </Field>
          <Field id="contact_role" label="Your role" error={errors.contact_role}>
            <input id="contact_role" name="contact_role" className={inputClass} placeholder="Owner, instructor, manager" />
          </Field>
        </div>

        <Field id="contact_email" label="Your email" required error={errors.contact_email}
               hint="Only used to confirm the listing. Never published.">
          <input id="contact_email" name="contact_email" type="email" className={inputClass} autoComplete="email" />
        </Field>

        <Field id="message" label="Anything else" error={errors.message}>
          <textarea id="message" name="message" rows={4} className={inputClass}
                    placeholder="Timetable, pricing, anything that helps us list you accurately." />
        </Field>
      </fieldset>

      <div className="border-t border-line pt-8">
        <button type="submit" disabled={busy} className="pill-brand disabled:opacity-60">
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Submit studio
        </button>
        <p className="mt-4 text-xs text-ink-faint">
          Listings are free. We review every submission before publishing, so
          it may take a few days to appear.
        </p>
      </div>
    </form>
  );
}
