import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { requireOwner, ownsStudio } from '@/lib/owner-auth'
import { serverClient } from '@/lib/forms'
import { EDITABLE_KEYS, displayValue, fieldSpec } from '@/lib/editable'
import OwnerEditForm from '@/components/OwnerEditForm'
import PhotoManager from '@/components/PhotoManager'
import { MAX_PHOTOS } from '@/lib/photos'
import { CONTACT_EMAIL } from '@/lib/site'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ studioId: string }>;
}

export default async function EditStudioPage({ params }: PageProps) {
  const owner = await requireOwner();
  const { studioId } = await params;

  if (!(await ownsStudio(owner.id, studioId))) notFound();

  const supabase = serverClient();
  if (!supabase) notFound();

  const [{ data: studio }, { data: pending }, { data: photos }] = await Promise.all([
    supabase
      .from('pilates_studios')
      .select(['id', 'name', 'address', 'postcode', 'city', 'county', 'full_url_path', ...EDITABLE_KEYS].join(','))
      .eq('id', studioId)
      .single(),
    supabase
      .from('studio_edits')
      .select('id,changes,created_at')
      .eq('studio_id', studioId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('studio_photos')
      .select('id, public_url, status, alt, review_note')
      .eq('studio_id', studioId)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true }),
  ]);

  if (!studio) notFound();
  const row = studio as any;
  const waiting = pending?.[0];

  // What is published, with anything still waiting laid over the top.
  //
  // Saving replaces the queued edit rather than stacking a second one on it,
  // so the form has to open holding those queued values: an owner who came
  // back to add a price found every tag they had just picked showing as
  // unselected, and saving sent the whole lot as a deliberate clear.
  const values = {
    ...Object.fromEntries(EDITABLE_KEYS.map(key => [key, row[key] ?? null])),
    ...Object.fromEntries(
      Object.entries((waiting?.changes || {}) as Record<string, unknown>)
        .filter(([key]) => EDITABLE_KEYS.includes(key))
    ),
  };

  return (
    <>
      <Link href="/dashboard" className="link-quiet inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All listings
      </Link>

      <h1 className="mt-4 font-fraunces text-2xl font-semibold">{row.name}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        {[row.address, row.postcode].filter(Boolean).join(', ')}. Changes go to us
        first and appear on the listing once approved &mdash; usually the same day.
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-faint">
        Name, address and postcode are not editable here because they decide the
        page&apos;s address on the site. Email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="link-quiet">
          {CONTACT_EMAIL}
        </a>{' '}
        if one of those is wrong.
      </p>

      {waiting && (
        <div className="mt-8 rounded-xl border border-line-strong bg-surface-sunken p-6">
          <h2 className="font-fraunces text-base font-semibold">Waiting to be reviewed</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Sent {new Date(waiting.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long',
            })}. These are not on your listing yet, but the form below already
            holds them, so you can carry on editing.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm">
            {Object.entries(waiting.changes || {}).map(([key, value]) => {
              const spec = fieldSpec(key);
              return (
                <li key={key}>
                  <span className="text-ink-faint">{spec?.label || key}:</span>{' '}
                  {displayValue(spec, value)}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <section className="mt-8 card-flat p-6 sm:p-8">
        <PhotoManager
          studioId={row.id}
          photos={(photos || []) as any}
          max={MAX_PHOTOS}
        />
      </section>

      <div className="mt-8">
        <OwnerEditForm
          studioId={row.id}
          values={values}
          hasPending={Boolean(waiting)}
        />
      </div>
    </>
  );
}
