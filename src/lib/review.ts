import { lookupPostcode } from '@/lib/forms'
import { recordAction } from '@/lib/admin-auth'
import { requestPasswordLink } from '@/lib/owner-auth'
import { sendEmail, siteUrl } from '@/lib/email'
import { EDITABLE_KEYS, fieldSpec, parseValue } from '@/lib/editable'
import { BUCKET } from '@/lib/photos'

/**
 * The three approval paths.
 *
 * Everything that writes to pilates_studios lives here, so there is one place
 * to look for how public input becomes a live listing. Each path records what
 * it did in admin_actions, and each stamps field_sources, so a published
 * value can always be traced to the person or process that supplied it.
 */

export function slugify(value: string): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type Result = { ok: true; message: string; path?: string } | { ok: false; error: string }

/**
 * Nudge a location's studio count. The column name is a leftover from the
 * directory this was forked from; the number it holds is live, and the county
 * and town pages order themselves by it.
 *
 * Addressed by id rather than by path: county rows carry a null full_path,
 * so matching on the path silently updated nothing.
 */
async function bumpLocationCount(supabase: any, id: string, by: number) {
  const { data } = await supabase
    .from('public_locations')
    .select('butcher_count')
    .eq('id', id)
    .single();
  if (!data) return;
  await supabase
    .from('public_locations')
    .update({ butcher_count: Math.max(0, (data.butcher_count || 0) + by) })
    .eq('id', id);
}

// ------------------------------------------------------------- submissions

/**
 * Promote a reviewed submission into the directory.
 *
 * The county is chosen by the reviewer rather than derived: the postcode's
 * administrative county is often a unitary authority that this site files
 * under a wider county, and guessing that mapping wrongly buries the listing
 * at a URL nothing links to.
 */
export async function approveSubmission(
  supabase: any,
  submissionId: string,
  opts: { countySlug: string; cityName: string; note?: string | null }
): Promise<Result> {
  const { data: sub } = await supabase
    .from('studio_submissions')
    .select('*')
    .eq('id', submissionId)
    .single();

  if (!sub) return { ok: false, error: 'Submission not found.' };
  if (sub.status !== 'pending') return { ok: false, error: `Already ${sub.status}.` };

  const cityName = (opts.cityName || sub.town || '').trim();
  if (!cityName) return { ok: false, error: 'Enter the town this studio belongs under.' };

  const { data: county } = await supabase
    .from('public_locations')
    .select('id,name,slug')
    .eq('slug', opts.countySlug)
    .in('type', ['county', 'country'])
    .single();
  if (!county) return { ok: false, error: 'That county is not one of the site\'s locations.' };

  const place = await lookupPostcode(sub.postcode);
  if (!place) return { ok: false, error: 'The postcode no longer resolves, so there are no coordinates to place it on the map.' };

  const citySlug = slugify(cityName);
  const cityPath = `${county.slug}/${citySlug}`;

  // Create the town page if this is the first studio in it.
  const { data: existingCity } = await supabase
    .from('public_locations')
    .select('id')
    .eq('full_path', cityPath)
    .single();

  let cityId = existingCity?.id as string | undefined;
  if (!cityId) {
    const { data: newCity, error } = await supabase
      .from('public_locations')
      .insert({
        name: cityName,
        slug: citySlug,
        type: 'city',
        county_slug: county.slug,
        full_path: cityPath,
        butcher_count: 0,
      })
      .select('id')
      .single();
    if (error) return { ok: false, error: `Could not create the town page: ${error.message}` };
    cityId = newCity.id;
  }

  // A unique path, suffixed rather than overwritten if the slug is taken.
  const base = slugify(sub.name);
  let path = `${cityPath}/${base}`;
  for (let n = 2; n < 50; n++) {
    const { count } = await supabase
      .from('pilates_studios')
      .select('*', { count: 'exact', head: true })
      .eq('full_url_path', path);
    if (!count) break;
    path = `${cityPath}/${base}-${n}`;
  }

  const now = new Date().toISOString();
  const sources: Record<string, unknown> = {};
  for (const key of ['name', 'address', 'postcode', 'website', 'phone', 'class_types']) {
    if (sub[key]) sources[key] = { source: 'owner_submission', at: now, confidence: 1, submission_id: sub.id };
  }
  sources.latitude = { source: 'postcodes_io', at: now, confidence: 1 };
  sources.longitude = { source: 'postcodes_io', at: now, confidence: 1 };

  const { data: created, error: insertError } = await supabase
    .from('pilates_studios')
    .insert({
      name: sub.name,
      address: sub.address,
      postcode: sub.postcode,
      outward_code: sub.postcode.split(/\s+/)[0],
      city: cityName,
      county: county.name,
      city_slug: citySlug,
      county_slug: county.slug,
      full_url_path: path,
      latitude: place.latitude,
      longitude: place.longitude,
      website: sub.website,
      phone: sub.phone,
      class_types: sub.class_types,
      is_active: true,
      is_pilates_studio: true,
      is_verified: false,
      google_review_count: 0,
      field_sources: sources,
      created_at: now,
      updated_at: now,
    })
    .select('id')
    .single();

  if (insertError) return { ok: false, error: `Could not create the listing: ${insertError.message}` };

  await bumpLocationCount(supabase, cityId!, 1);
  await bumpLocationCount(supabase, county.id, 1);

  await supabase
    .from('studio_submissions')
    .update({
      status: 'approved',
      reviewed_at: now,
      review_note: opts.note || null,
      created_studio_id: created.id,
    })
    .eq('id', sub.id);

  await recordAction(supabase, 'submission.approved', 'studio_submissions', sub.id, {
    studio_id: created.id, path,
  }, opts.note);

  await sendEmail({
    to: sub.contact_email,
    subject: `${sub.name} is now listed on Pilates Classes Near`,
    text: [
      `Hi ${sub.contact_name},`,
      '',
      `Thanks for sending ${sub.name} over. It is now live:`,
      '',
      `${siteUrl()}/${path}`,
      '',
      'If you run the studio, you can claim the listing to keep its classes, prices and',
      'opening hours up to date:',
      '',
      `${siteUrl()}/claim/${path}`,
      '',
      'Pilates Classes Near',
    ].join('\n'),
  });

  return { ok: true, message: `${sub.name} is live at /${path}`, path };
}

export async function rejectSubmission(
  supabase: any,
  submissionId: string,
  status: 'rejected' | 'duplicate',
  note: string | null
): Promise<Result> {
  const { error } = await supabase
    .from('studio_submissions')
    .update({ status, reviewed_at: new Date().toISOString(), review_note: note })
    .eq('id', submissionId)
    .eq('status', 'pending');
  if (error) return { ok: false, error: error.message };

  await recordAction(supabase, `submission.${status}`, 'studio_submissions', submissionId, null, note);
  return { ok: true, message: `Marked ${status}.` };
}

// ------------------------------------------------------------------ claims

/**
 * Approve a claim: create or reuse the owner account, grant it this studio,
 * mark the listing verified, and send the first sign-in link.
 *
 * That link is what actually proves ownership. The claim form only checked
 * that the address was at the studio's domain; delivery proves the claimant
 * reads mail there.
 */
export async function approveClaim(
  supabase: any,
  claimId: string,
  note: string | null
): Promise<Result> {
  const { data: claim } = await supabase
    .from('studio_claims')
    .select('*, pilates_studios(id,name,full_url_path)')
    .eq('id', claimId)
    .single();

  if (!claim) return { ok: false, error: 'Claim not found.' };
  if (claim.status !== 'pending') return { ok: false, error: `Already ${claim.status}.` };

  const email = String(claim.claimant_email).toLowerCase();
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from('studio_owners')
    .select('id')
    .eq('email', email)
    .single();

  let ownerId = existing?.id as string | undefined;
  if (!ownerId) {
    const { data: created, error } = await supabase
      .from('studio_owners')
      .insert({ email, name: claim.claimant_name })
      .select('id')
      .single();
    if (error) return { ok: false, error: `Could not create the owner account: ${error.message}` };
    ownerId = created.id;
  }

  const { error: grantError } = await supabase
    .from('studio_owner_studios')
    .upsert(
      { owner_id: ownerId, studio_id: claim.studio_id, granted_from_claim: claim.id },
      { onConflict: 'owner_id,studio_id' }
    );
  if (grantError) return { ok: false, error: `Could not grant access: ${grantError.message}` };

  await supabase
    .from('pilates_studios')
    .update({
      is_verified: true,
      claimed_by: ownerId,
      claimed_at: now,
      verified_at: now,
      updated_at: now,
    })
    .eq('id', claim.studio_id);

  await supabase
    .from('studio_claims')
    .update({ status: 'approved', reviewed_at: now, review_note: note })
    .eq('id', claim.id);

  await recordAction(supabase, 'claim.approved', 'studio_claims', claim.id, {
    studio_id: claim.studio_id, owner_id: ownerId,
  }, note);

  await requestPasswordLink(email, 'set_password', 'admin-approval');

  return { ok: true, message: `${claim.pilates_studios?.name} verified. Password setup link sent to ${email}.` };
}

export async function rejectClaim(
  supabase: any,
  claimId: string,
  note: string | null
): Promise<Result> {
  const { error } = await supabase
    .from('studio_claims')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString(), review_note: note })
    .eq('id', claimId)
    .eq('status', 'pending');
  if (error) return { ok: false, error: error.message };

  await recordAction(supabase, 'claim.rejected', 'studio_claims', claimId, null, note);
  return { ok: true, message: 'Claim rejected.' };
}

// ------------------------------------------------------------------- edits

/**
 * Apply an approved edit to the live listing.
 *
 * Values are re-validated here rather than trusted from the queue: they were
 * checked when submitted, but the row has sat in a table since, and this is
 * the step that publishes them.
 */
export async function approveEdit(
  supabase: any,
  editId: string,
  note: string | null
): Promise<Result> {
  const { data: edit } = await supabase
    .from('studio_edits')
    .select('*, pilates_studios(id,name,full_url_path), studio_owners(email,name)')
    .eq('id', editId)
    .single();

  if (!edit) return { ok: false, error: 'Edit not found.' };
  if (edit.status !== 'pending') return { ok: false, error: `Already ${edit.status}.` };

  const now = new Date().toISOString();
  const update: Record<string, unknown> = { updated_at: now, last_verified_at: now };
  const applied: string[] = [];

  for (const [key, raw] of Object.entries(edit.changes || {})) {
    if (!EDITABLE_KEYS.includes(key)) continue;
    const spec = fieldSpec(key)!;
    const parsed = parseValue(spec, raw);
    if ('error' in parsed) continue;
    update[key] = parsed.value;
    applied.push(key);
  }

  if (!applied.length) return { ok: false, error: 'Nothing in this edit is applicable.' };

  const { data: studio } = await supabase
    .from('pilates_studios')
    .select('field_sources')
    .eq('id', edit.studio_id)
    .single();

  // Owner outranks every automated source, so these entries win any future
  // enrichment pass that respects the documented precedence.
  const sources = { ...(studio?.field_sources || {}) };
  for (const key of applied) {
    sources[key] = { source: 'owner', at: now, confidence: 1, edit_id: edit.id };
  }
  update.field_sources = sources;

  const { error } = await supabase
    .from('pilates_studios')
    .update(update)
    .eq('id', edit.studio_id);
  if (error) return { ok: false, error: `Could not update the listing: ${error.message}` };

  await supabase
    .from('studio_edits')
    .update({ status: 'approved', reviewed_at: now, applied_at: now, review_note: note })
    .eq('id', edit.id);

  await recordAction(supabase, 'edit.approved', 'studio_edits', edit.id, {
    studio_id: edit.studio_id, fields: applied,
  }, note);

  const owner = (edit as any).studio_owners;
  if (owner?.email) {
    await sendEmail({
      to: owner.email,
      subject: `Your changes to ${edit.pilates_studios?.name} are live`,
      text: [
        owner.name ? `Hi ${owner.name},` : 'Hi,',
        '',
        `The changes you made to ${edit.pilates_studios?.name} have been approved and are now showing:`,
        '',
        `${siteUrl()}/${edit.pilates_studios?.full_url_path}`,
        note ? `\nNote from us: ${note}` : '',
        '',
        'Pilates Classes Near',
      ].filter(Boolean).join('\n'),
    });
  }

  return { ok: true, message: `Applied ${applied.length} field${applied.length === 1 ? '' : 's'}.` };
}

export async function rejectEdit(
  supabase: any,
  editId: string,
  note: string | null
): Promise<Result> {
  const { data: edit } = await supabase
    .from('studio_edits')
    .select('id,status,pilates_studios(name),studio_owners(email,name)')
    .eq('id', editId)
    .single();
  if (!edit) return { ok: false, error: 'Edit not found.' };

  const { error } = await supabase
    .from('studio_edits')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString(), review_note: note })
    .eq('id', editId)
    .eq('status', 'pending');
  if (error) return { ok: false, error: error.message };

  await recordAction(supabase, 'edit.rejected', 'studio_edits', editId, null, note);

  const owner = (edit as any).studio_owners;
  if (owner?.email) {
    await sendEmail({
      to: owner.email,
      subject: `About your changes to ${(edit as any).pilates_studios?.name}`,
      text: [
        owner.name ? `Hi ${owner.name},` : 'Hi,',
        '',
        'We were not able to publish the changes you sent.',
        note ? `\n${note}` : '\nReply to this email and we will sort it out.',
        '',
        'Pilates Classes Near',
      ].join('\n'),
    });
  }

  return { ok: true, message: 'Edit rejected.' };
}

// ------------------------------------------------------------------ photos

export async function approvePhoto(
  supabase: any,
  photoId: string,
  note: string | null
): Promise<Result> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('studio_photos')
    .update({ status: 'approved', reviewed_at: now, review_note: note })
    .eq('id', photoId)
    .eq('status', 'pending')
    .select('id, pilates_studios(name)')
    .single();

  if (error || !data) return { ok: false, error: error?.message || 'Photo not found.' };

  await recordAction(supabase, 'photo.approved', 'studio_photos', photoId, null, note);
  return { ok: true, message: `Published on ${(data as any).pilates_studios?.name}.` };
}

/**
 * Reject a photo, and delete the file with it.
 *
 * A rejected photo is one we have decided not to publish. Keeping the bytes
 * on a public bucket, at a URL anyone holding it can still open, would leave
 * it published in every sense except the listing.
 */
export async function rejectPhoto(
  supabase: any,
  photoId: string,
  note: string | null
): Promise<Result> {
  const { data: photo } = await supabase
    .from('studio_photos')
    .select('id, storage_path, studio_owners(email, name), pilates_studios(name)')
    .eq('id', photoId)
    .single();

  if (!photo) return { ok: false, error: 'Photo not found.' };

  const { error } = await supabase
    .from('studio_photos')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString(), review_note: note })
    .eq('id', photoId)
    .eq('status', 'pending');
  if (error) return { ok: false, error: error.message };

  await supabase.storage.from(BUCKET).remove([photo.storage_path]);
  await recordAction(supabase, 'photo.rejected', 'studio_photos', photoId, null, note);

  const owner = (photo as any).studio_owners;
  if (owner?.email) {
    await sendEmail({
      to: owner.email,
      subject: `About the photo you added to ${(photo as any).pilates_studios?.name}`,
      text: [
        owner.name ? `Hi ${owner.name},` : 'Hi,',
        '',
        'We were not able to publish one of the photos you uploaded.',
        note ? `\n${note}` : '\nReply to this email and we will sort it out.',
        '',
        'Pilates Classes Near',
      ].join('\n'),
    });
  }

  return { ok: true, message: 'Photo rejected and removed.' };
}
