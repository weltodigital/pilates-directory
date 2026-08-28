import { randomBytes } from 'crypto'
import { NextResponse } from 'next/server'
import { field, serverClient } from '@/lib/forms'
import { getOwner, ownsStudio } from '@/lib/owner-auth'
import { notifyAdmin, siteUrl } from '@/lib/email'
import {
  BUCKET, MAX_BYTES, MAX_PHOTOS, PHOTO_CACHE_SECONDS, extensionFor,
  readDimensions, sniffImageType,
} from '@/lib/photos'

export const dynamic = 'force-dynamic'

/**
 * POST /api/owner/photos
 *
 * Takes one photo, stores it, and queues it for review. Reviewed like every
 * other owner change: a claimed listing that could publish an image straight
 * to a public page would be an image host with a directory attached.
 */
export async function POST(request: Request) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });

  const supabase = serverClient();
  if (!supabase) return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid upload.' }, { status: 400 });
  }

  const studioId = field(form.get('studio_id'), 40);
  const file = form.get('file');

  if (!studioId || !(file instanceof File)) {
    return NextResponse.json({ error: 'Choose a photo to upload.' }, { status: 400 });
  }
  if (!(await ownsStudio(owner.id, studioId))) {
    return NextResponse.json({ error: 'That is not one of your listings.' }, { status: 403 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `That photo is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is 5MB.` },
      { status: 413 }
    );
  }
  if (file.size === 0) {
    return NextResponse.json({ error: 'That file is empty.' }, { status: 400 });
  }

  // Room to add another, counting what is waiting as well as what is live: an
  // owner should not be able to queue thirty and have us find out at review.
  const { count } = await supabase
    .from('studio_photos')
    .select('*', { count: 'exact', head: true })
    .eq('studio_id', studioId)
    .in('status', ['pending', 'approved']);

  if ((count || 0) >= MAX_PHOTOS) {
    return NextResponse.json(
      { error: `You can have ${MAX_PHOTOS} photos. Remove one before adding another.` },
      { status: 409 }
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const contentType = sniffImageType(bytes);
  if (!contentType) {
    return NextResponse.json(
      { error: 'That is not a JPEG, PNG or WebP image.' },
      { status: 415 }
    );
  }

  const dimensions = readDimensions(bytes, contentType);
  // A random name, not the uploaded one. A filename from a stranger is a
  // string from a stranger, and it would otherwise end up in a public URL.
  const path = `${studioId}/${randomBytes(16).toString('hex')}.${extensionFor(contentType)}`;

  // A short cache, deliberately. Rejecting a photo deletes the file, but the
  // CDN in front of storage honours whatever we set here - a year-long
  // max-age left a rejected photo publicly retrievable at its URL for a year
  // after it was deleted, which is the opposite of what rejecting it means.
  // Five minutes costs a little egress and makes the deletion real.
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType, cacheControl: String(PHOTO_CACHE_SECONDS), upsert: false });

  if (uploadError) {
    console.error('Photo upload failed:', uploadError.message);
    return NextResponse.json({ error: 'We could not store that photo. Please try again.' }, { status: 502 });
  }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { data: row, error } = await supabase
    .from('studio_photos')
    .insert({
      studio_id: studioId,
      owner_id: owner.id,
      storage_path: path,
      public_url: publicUrl,
      alt: field(form.get('alt'), 160),
      position: count || 0,
      width: dimensions?.width ?? null,
      height: dimensions?.height ?? null,
      bytes: file.size,
      content_type: contentType,
    })
    .select('id, public_url, status, created_at')
    .single();

  if (error) {
    // Do not leave the file behind if the row describing it never existed.
    await supabase.storage.from(BUCKET).remove([path]);
    console.error('Photo record failed:', error.message);
    return NextResponse.json({ error: 'We could not save that photo. Please try again.' }, { status: 500 });
  }

  const { data: studio } = await supabase
    .from('pilates_studios').select('name').eq('id', studioId).single();

  await notifyAdmin(
    `Photo pending: ${studio?.name}`,
    `${owner.name || owner.email} uploaded a photo for ${studio?.name}.\n\nReview: ${siteUrl()}/admin/photos`
  );

  return NextResponse.json({ ok: true, photo: row });
}

/**
 * DELETE /api/owner/photos?id=…
 *
 * An owner may withdraw their own photo at any point, published or not. It is
 * their photograph.
 */
export async function DELETE(request: Request) {
  const owner = await getOwner();
  if (!owner) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });

  const supabase = serverClient();
  if (!supabase) return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 });

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing photo.' }, { status: 400 });

  const { data: photo } = await supabase
    .from('studio_photos')
    .select('id, studio_id, storage_path')
    .eq('id', id)
    .single();

  if (!photo) return NextResponse.json({ error: 'Photo not found.' }, { status: 404 });
  if (!(await ownsStudio(owner.id, photo.studio_id))) {
    return NextResponse.json({ error: 'That is not one of your photos.' }, { status: 403 });
  }

  await supabase.storage.from(BUCKET).remove([photo.storage_path]);
  await supabase.from('studio_photos').delete().eq('id', photo.id);

  return NextResponse.json({ ok: true });
}
