'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus, Loader2, Trash2 } from 'lucide-react'

export interface OwnerPhoto {
  id: string;
  public_url: string;
  status: string;
  alt: string | null;
  review_note: string | null;
}

interface PhotoManagerProps {
  studioId: string;
  photos: OwnerPhoto[];
  max: number;
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Waiting for review',
  approved: 'On your listing',
  rejected: 'Not published',
}

export default function PhotoManager({ studioId, photos, max }: PhotoManagerProps) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const live = photos.filter(p => p.status !== 'rejected');
  const full = live.length >= max;

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true); setError(null);

    // One at a time, so a rejected file names itself rather than failing the
    // whole selection.
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append('studio_id', studioId);
      body.append('file', file);
      try {
        const res = await fetch('/api/owner/photos', { method: 'POST', body });
        const data = await res.json();
        if (!res.ok) { setError(`${file.name}: ${data.error || 'Upload failed.'}`); break; }
      } catch {
        setError(`${file.name}: something went wrong.`);
        break;
      }
    }

    setBusy(false);
    if (input.current) input.current.value = '';
    router.refresh();
  }

  async function remove(id: string) {
    setRemoving(id); setError(null);
    try {
      const res = await fetch(`/api/owner/photos?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Could not remove that photo.');
        return;
      }
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-fraunces text-lg font-semibold">Photos</h3>
        <p className="text-sm text-ink-muted">
          {live.length} of {max} · JPEG, PNG or WebP, up to 5MB each
        </p>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Your studio, your classes, your equipment. We check photos before they
        appear, the same as any other change. Please only upload pictures you
        took or have the right to use.
      </p>

      {photos.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map(photo => (
            <li key={photo.id} className="overflow-hidden rounded-lg border border-line bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.public_url}
                alt={photo.alt || ''}
                loading="lazy"
                className={
                  'block aspect-[4/3] w-full object-cover ' +
                  (photo.status === 'approved' ? '' : 'opacity-60')
                }
              />
              <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                <span
                  className={
                    'text-xs ' +
                    (photo.status === 'approved' ? 'font-medium text-brand' : 'text-ink-faint')
                  }
                >
                  {STATUS_LABEL[photo.status] || photo.status}
                </span>
                <button
                  type="button"
                  onClick={() => remove(photo.id)}
                  disabled={removing === photo.id}
                  aria-label="Remove this photo"
                  className="text-ink-faint transition-colors hover:text-destructive"
                >
                  {removing === photo.id
                    ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
              {photo.status === 'rejected' && photo.review_note && (
                <p className="border-t border-line px-3 py-2 text-xs leading-relaxed text-ink-muted">
                  {photo.review_note}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}

      <div className="mt-5">
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={e => upload(e.target.files)}
        />
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy || full}
          className="pill-outline disabled:opacity-60"
        >
          {busy
            ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            : <ImagePlus className="h-4 w-4" aria-hidden="true" />}
          {busy ? 'Uploading' : full ? `${max} photos is the limit` : 'Add photos'}
        </button>
      </div>
    </div>
  );
}
