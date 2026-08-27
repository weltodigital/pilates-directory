import { AlertTriangle } from 'lucide-react'

/**
 * Notifications fail silently by design: a submission that saved but could
 * not be announced is still saved, and no queue should break because an email
 * provider had a bad minute. The cost is that a missing variable looks exactly
 * like a quiet week. This says so out loud, where the quiet is noticed.
 */
export default function ConfigWarning() {
  const problems: { setting: string; effect: string }[] = [];

  if (!process.env.ADMIN_EMAIL) {
    problems.push({
      setting: 'ADMIN_EMAIL',
      effect: 'Nothing emails you when a submission, claim or edit is ready. The queues above are your only signal.',
    });
  }
  if (!process.env.RESEND_API_KEY) {
    problems.push({
      setting: 'RESEND_API_KEY',
      effect: 'No email leaves the site at all: confirmation links, password links and your notifications are written to the server log instead.',
    });
  }

  if (!problems.length) return null;

  return (
    <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
      <h2 className="flex items-center gap-2 font-fraunces text-base font-semibold">
        <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
        {problems.length === 1 ? 'A setting is missing' : 'Settings are missing'}
      </h2>
      <dl className="mt-4 space-y-3 text-sm">
        {problems.map(({ setting, effect }) => (
          <div key={setting}>
            <dt className="font-mono text-xs font-semibold text-ink">{setting}</dt>
            <dd className="mt-1 leading-relaxed text-ink-muted">{effect}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-ink-faint">
        Set these in the hosting environment and redeploy.
      </p>
    </div>
  );
}
