/**
 * How many rows are held back waiting on their own sender.
 *
 * Shown rather than hidden: silently withholding rows would make the queue
 * look emptier than the world is, and the first question on a quiet day is
 * whether the form is broken.
 */
export default function AwaitingConfirmation({ count, noun }: { count: number; noun: string }) {
  if (count === 0) return null;

  return (
    <p className="mt-6 rounded-md border border-line-strong bg-surface-sunken px-5 py-3.5 text-sm leading-relaxed text-ink-muted">
      <strong className="font-medium text-ink">{count}</strong>{' '}
      {count === 1 ? `${noun} is` : `${noun}s are`} waiting on the sender to
      confirm their email address. {count === 1 ? 'It' : 'They'} will appear
      here once confirmed, and {count === 1 ? 'is' : 'are'} not yours to chase.
    </p>
  );
}
