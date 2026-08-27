/**
 * When a decision was made, in full.
 *
 * A review log where the entries only say "approved" is close to useless for
 * the question it exists to answer: when did this listing change, and to what.
 */
export default function DecidedAt({ at }: { at: string | null }) {
  if (!at) return <span className="text-ink-faint">—</span>;

  const when = new Date(at);
  return (
    <time dateTime={at} className="whitespace-nowrap text-ink-faint">
      {when.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
      {', '}
      {when.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
    </time>
  );
}
