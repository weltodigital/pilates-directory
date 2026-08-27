'use client'

import { useState } from 'react'
import { Check, Loader2, Send } from 'lucide-react'
import { Field, Honeypot, inputClass } from '@/components/FormField'

export default function ContactForm({ contactEmail }: { contactEmail: string }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setErrors({}); setFormError(null);

    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          subject: fd.get('subject'),
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
      setDone(true);
    } catch {
      setFormError(`Something went wrong. Please email ${contactEmail} instead.`);
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
        <h2 className="mt-6 font-fraunces text-2xl font-semibold">Message sent</h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          Thanks — we read everything and usually reply within a day. Our answer
          will come to the address you gave.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6" noValidate>
      <Honeypot />

      {formError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-ink" role="alert">
          {formError}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Your name" required error={errors.name}>
          <input id="name" name="name" className={inputClass} autoComplete="name" />
        </Field>
        <Field id="email" label="Your email" required error={errors.email}>
          <input id="email" name="email" type="email" className={inputClass} autoComplete="email" />
        </Field>
      </div>

      <Field
        id="subject"
        label="Subject"
        error={errors.subject}
        hint="For example: a wrong listing, a claim, or removing a studio."
      >
        <input id="subject" name="subject" className={inputClass} />
      </Field>

      <Field id="message" label="Message" required error={errors.message}>
        <textarea id="message" name="message" rows={7} className={`${inputClass} resize-y`} />
      </Field>

      <div className="border-t border-line pt-6">
        <button type="submit" disabled={busy} className="pill-brand disabled:opacity-60">
          {busy
            ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            : <Send className="h-4 w-4" aria-hidden="true" />}
          {busy ? 'Sending' : 'Send message'}
        </button>
        <p className="mt-4 text-xs leading-relaxed text-ink-faint">
          We use what you send only to answer you. Nothing goes on a mailing
          list, and nothing is passed to the studios in the directory.
        </p>
      </div>
    </form>
  );
}
