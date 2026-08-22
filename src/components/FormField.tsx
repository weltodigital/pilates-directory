'use client'

import { ReactNode } from 'react'

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export const inputClass =
  'w-full rounded-md border border-line-strong bg-surface px-4 py-3 text-sm text-ink outline-none ' +
  'transition-colors placeholder:text-ink-faint focus:border-brand disabled:opacity-60';

export function Field({ id, label, hint, error, required, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-brand" aria-hidden="true">*</span>}
        {!required && <span className="ml-2 text-xs font-normal text-ink-faint">optional</span>}
      </label>
      {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
      <div className="mt-2">{children}</div>
      {error && (
        <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>
      )}
    </div>
  );
}

/**
 * Hidden field that real visitors never see or fill. Automated submitters
 * complete every input they find, which makes a value here a reliable signal
 * without putting a captcha in front of a studio owner.
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="company">Company</label>
      <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
