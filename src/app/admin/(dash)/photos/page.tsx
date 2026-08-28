import Link from 'next/link'
import { serverClient } from '@/lib/forms'
import ReviewActions from '@/components/admin/ReviewActions'
import DecidedAt from '@/components/admin/DecidedAt'

export const dynamic = 'force-dynamic'

async function load() {
  const supabase = serverClient();
  if (!supabase) return null;

  const [pending, decided] = await Promise.all([
    supabase.from('studio_photos')
      .select('*, pilates_studios(name, full_url_path), studio_owners(email, name)')
      .eq('status', 'pending').order('created_at', { ascending: true }),
    supabase.from('studio_photos')
      .select('id, public_url, status, reviewed_at, review_note, pilates_studios(name), studio_owners(email)')
      .neq('status', 'pending').order('reviewed_at', { ascending: false }).limit(24),
  ]);

  return { pending: pending.data || [], decided: decided.data || [] };
}

export default async function AdminPhotosPage() {
  const data = await load();
  if (!data) return <p className="text-ink-muted">The database is not reachable.</p>;

  return (
    <>
      <h1 className="font-fraunces text-2xl font-semibold">
        Photos
        <span className="ml-3 text-base font-normal text-ink-muted">
          {data.pending.length} waiting
        </span>
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Uploaded by owners of claimed listings. Nothing appears on a studio page
        until you approve it. Worth a look for anything that is not the studio:
        a logo, a stock photo, or a picture of somebody who did not agree to be
        on the internet.
      </p>

      {data.pending.length === 0 && <p className="mt-8 text-ink-muted">Nothing waiting.</p>}

      <div className="mt-8 space-y-6">
        {data.pending.map((photo: any) => (
          <article key={photo.id} className="card-flat overflow-hidden">
            <div className="grid gap-6 p-6 sm:grid-cols-[20rem_minmax(0,1fr)]">
              <a
                href={photo.public_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg border border-line"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.public_url}
                  alt=""
                  className="block aspect-[4/3] w-full bg-surface-sunken object-cover"
                />
              </a>

              <div className="min-w-0">
                <h2 className="font-fraunces text-xl font-semibold">
                  {photo.pilates_studios ? (
                    <Link href={`/${photo.pilates_studios.full_url_path}`} className="link-quiet">
                      {photo.pilates_studios.name}
                    </Link>
                  ) : 'Listing removed'}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  {photo.studio_owners?.name ? `${photo.studio_owners.name} · ` : ''}
                  {photo.studio_owners?.email || 'account removed'}
                </p>
                <dl className="mt-4 space-y-1 text-sm text-ink-faint">
                  <div>
                    {photo.width && photo.height
                      ? `${photo.width} × ${photo.height}`
                      : 'dimensions unknown'}
                    {photo.bytes ? ` · ${(photo.bytes / 1024 / 1024).toFixed(1)}MB` : ''}
                    {photo.content_type ? ` · ${photo.content_type.replace('image/', '')}` : ''}
                  </div>
                  <div>Uploaded <DecidedAt at={photo.created_at} /></div>
                </dl>

                <ReviewActions
                  kind="photo"
                  id={photo.id}
                  choices={[
                    { action: 'approve', label: 'Publish' },
                    { action: 'reject', label: 'Reject', tone: 'quiet' },
                  ]}
                />
              </div>
            </div>
          </article>
        ))}
      </div>

      {data.decided.length > 0 && (
        <>
          <h2 className="mt-14 font-fraunces text-lg font-semibold">Decision log</h2>
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {data.decided.map((photo: any) => (
              <li key={photo.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3 text-sm">
                <span className="flex min-w-0 items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.public_url}
                    alt=""
                    className="h-10 w-14 shrink-0 rounded border border-line object-cover"
                  />
                  <span className="min-w-0">
                    <span className="font-medium">{photo.pilates_studios?.name}</span>
                    <span className="text-ink-faint"> · {photo.studio_owners?.email}</span>
                    {photo.review_note && (
                      <span className="text-ink-faint"> · {photo.review_note}</span>
                    )}
                  </span>
                </span>
                <span className="flex shrink-0 items-baseline gap-3">
                  <span className={photo.status === 'approved' ? 'font-medium text-brand' : 'text-ink-faint'}>
                    {photo.status}
                  </span>
                  <DecidedAt at={photo.reviewed_at} />
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
