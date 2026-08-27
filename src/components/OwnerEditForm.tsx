'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'
import { Field, inputClass } from '@/components/FormField'
import { DAYS, EditableField, FIELD_GROUPS } from '@/lib/editable'

interface OwnerEditFormProps {
  studioId: string;
  /** Current stored values, keyed by field. */
  values: Record<string, any>;
  /** True when an earlier edit is still waiting, so saving replaces it. */
  hasPending: boolean;
}

function titleCaseDay(day: string) {
  return `${day[0].toUpperCase()}${day.slice(1)}`;
}

export default function OwnerEditForm({ studioId, values, hasPending }: OwnerEditFormProps) {
  const router = useRouter();
  const [state, setState] = useState<Record<string, any>>(values);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState<{ fields?: number; unchanged?: boolean } | null>(null);

  function set(key: string, value: any) {
    setState(prev => ({ ...prev, [key]: value }));
    setDone(null);
  }

  function toggleTag(key: string, option: string) {
    const current: string[] = Array.isArray(state[key]) ? state[key] : [];
    set(key, current.includes(option)
      ? current.filter(v => v !== option)
      : [...current, option]);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setErrors({}); setFormError(null); setDone(null);

    try {
      const res = await fetch('/api/owner/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studio_id: studioId, changes: state, note }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        if (data.error) setFormError(data.error);
        return;
      }
      setDone({ fields: data.fields, unchanged: data.unchanged });
      router.refresh();
    } catch {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function control(spec: EditableField) {
    const value = state[spec.key];
    const id = `f-${spec.key}`;

    switch (spec.type) {
      case 'textarea':
        return (
          <textarea
            id={id}
            rows={5}
            maxLength={spec.max}
            value={value ?? ''}
            onChange={e => set(spec.key, e.target.value)}
            className={`${inputClass} resize-y`}
          />
        );

      case 'bool':
        return (
          <select
            id={id}
            value={value === true ? 'true' : value === false ? 'false' : ''}
            onChange={e => set(spec.key, e.target.value === '' ? null : e.target.value === 'true')}
            className={inputClass}
          >
            <option value="">Not specified</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );

      case 'tags': {
        const selected: string[] = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-wrap gap-2">
            {(spec.options || []).map(option => {
              const on = selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleTag(spec.key, option)}
                  className={
                    'rounded-full border px-3.5 py-1.5 text-sm transition-colors ' +
                    (on
                      ? 'border-brand bg-brand-tint font-medium text-brand'
                      : 'border-line-strong text-ink-muted hover:border-brand')
                  }
                >
                  {option}
                </button>
              );
            })}
          </div>
        );
      }

      case 'hours': {
        const hours: Record<string, string> = value && typeof value === 'object' ? value : {};
        return (
          <div className="space-y-2">
            {DAYS.map(day => (
              <div key={day} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm text-ink-muted">{titleCaseDay(day)}</span>
                <input
                  type="text"
                  aria-label={`${titleCaseDay(day)} opening hours`}
                  placeholder="Closed"
                  value={hours[day] ?? ''}
                  onChange={e => set(spec.key, { ...hours, [day]: e.target.value })}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        );
      }

      case 'number':
      case 'money':
        return (
          <input
            id={id}
            type="text"
            inputMode="decimal"
            value={value ?? ''}
            onChange={e => set(spec.key, e.target.value)}
            className={inputClass}
          />
        );

      default:
        return (
          <input
            id={id}
            type={spec.type === 'email' ? 'email' : spec.type === 'tel' ? 'tel' : 'text'}
            maxLength={spec.max}
            value={value ?? ''}
            onChange={e => set(spec.key, e.target.value)}
            className={inputClass}
          />
        );
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {hasPending && !done && (
        <p className="rounded-md border border-line-strong bg-surface-sunken px-4 py-3 text-sm">
          You have changes waiting to be reviewed. Saving again replaces them.
        </p>
      )}

      {Object.entries(FIELD_GROUPS).map(([group, specs]) => (
        <section key={group} className="card-flat p-6 sm:p-8">
          <h2 className="font-fraunces text-lg font-semibold">{group}</h2>
          <div className="mt-6 space-y-6">
            {specs.map(spec => (
              <Field
                key={spec.key}
                id={`f-${spec.key}`}
                label={spec.label}
                hint={spec.hint}
                error={errors[spec.key]}
                hideOptional
              >
                {control(spec)}
              </Field>
            ))}
          </div>
        </section>
      ))}

      <section className="card-flat p-6 sm:p-8">
        <Field
          id="note"
          label="Anything we should know?"
          hint="Only we see this. Useful if a change needs explaining."
          hideOptional
        >
          <textarea
            id="note"
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>

        {formError && <p className="mt-4 text-sm text-destructive" role="alert">{formError}</p>}

        {done && (
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-brand" role="status">
            <Check className="h-4 w-4" aria-hidden="true" />
            {done.unchanged
              ? 'Nothing had changed, so there was nothing to send.'
              : `Sent ${done.fields} change${done.fields === 1 ? '' : 's'} for review. We will email you when they are live.`}
          </p>
        )}

        <button type="submit" disabled={busy} className="pill-brand mt-6">
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {busy ? 'Sending' : 'Send changes for review'}
        </button>
      </section>
    </form>
  );
}
