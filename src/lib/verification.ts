import { createHash, randomBytes } from 'crypto'
import { notifyAdmin, sendEmail, siteUrl } from '@/lib/email'
import { CONTACT_EMAIL } from '@/lib/site'

/**
 * Confirming that someone reads mail at the address they gave.
 *
 * This runs before review, not after. A typed address proves nothing; a link
 * that comes back proves the mailbox. Putting that first means every row a
 * reviewer sees has already cleared the only question a form cannot answer,
 * and the reviewer is left with the one it can only be a human's to judge -
 * whether this person should hold this listing.
 */

const HOURS = 72

export type VerificationKind = 'claim' | 'submission'

function hash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Issue a link and send it. Returns false if the mail did not go, so the
 * caller can tell the sender rather than leaving them waiting for an email
 * that is never coming.
 */
export async function sendConfirmation(
  supabase: any,
  kind: VerificationKind,
  targetId: string,
  email: string,
  context: { studioName: string; personName: string }
): Promise<boolean> {
  // Any earlier link for this row is spent, so a resend cannot be raced
  // against the link from the first attempt.
  await supabase
    .from('email_verifications')
    .update({ used_at: new Date().toISOString() })
    .eq('kind', kind)
    .eq('target_id', targetId)
    .is('used_at', null);

  const token = randomBytes(32).toString('base64url');
  const { error } = await supabase.from('email_verifications').insert({
    kind,
    target_id: targetId,
    email: email.toLowerCase(),
    token_hash: hash(token),
    expires_at: new Date(Date.now() + HOURS * 60 * 60 * 1000).toISOString(),
  });
  if (error) {
    console.error('Verification token insert failed:', error.message);
    return false;
  }

  const link = `${siteUrl()}/confirm?token=${encodeURIComponent(token)}`;
  const claim = kind === 'claim';

  return sendEmail({
    to: email,
    subject: claim
      ? `Confirm your claim for ${context.studioName}`
      : `Confirm you sent us ${context.studioName}`,
    text: [
      `Hi ${context.personName},`,
      '',
      claim
        ? `Someone has asked to claim the listing for ${context.studioName} using this email address. If that was you, confirm it here:`
        : `Someone submitted ${context.studioName} to Pilates Classes Near using this email address. If that was you, confirm it here:`,
      '',
      link,
      '',
      `The link expires in ${HOURS} hours.`,
      '',
      claim
        ? 'Nothing happens to the listing until you confirm and we have checked the claim by hand.'
        : 'Nothing is published until you confirm and we have reviewed it.',
      '',
      `If this was not you, ignore this email and nothing will happen. You can also tell us at ${CONTACT_EMAIL}.`,
      '',
      'Pilates Classes Near',
    ].join('\n'),
  });
}

export interface PendingVerification {
  id: string;
  kind: VerificationKind;
  targetId: string;
  email: string;
}

/** Check a token without spending it, so the confirm page can describe it. */
export async function peekVerification(
  supabase: any,
  token: string
): Promise<PendingVerification | null> {
  const { data } = await supabase
    .from('email_verifications')
    .select('id,kind,target_id,email,expires_at,used_at')
    .eq('token_hash', hash(token))
    .single();

  if (!data || data.used_at || new Date(data.expires_at) < new Date()) return null;
  return { id: data.id, kind: data.kind, targetId: data.target_id, email: data.email };
}

/**
 * Spend the token and move the row into the review queue.
 *
 * Confirmation is a POST from a button rather than the link itself, because
 * corporate mail scanners follow links in email as a matter of course. A
 * scanner cannot press a button, so what reaches the queue is a person.
 */
export async function consumeVerification(
  supabase: any,
  token: string
): Promise<{ kind: VerificationKind; studioName: string | null } | null> {
  const pending = await peekVerification(supabase, token);
  if (!pending) return null;

  const now = new Date().toISOString();

  // Claim the token first, and only if unused, so a double submit cannot
  // confirm twice.
  const { data: claimed } = await supabase
    .from('email_verifications')
    .update({ used_at: now })
    .eq('id', pending.id)
    .is('used_at', null)
    .select('id')
    .single();
  if (!claimed) return null;

  const claim = pending.kind === 'claim';
  const table = claim ? 'studio_claims' : 'studio_submissions';
  const { data: row } = await supabase
    .from(table)
    .update({ status: 'pending', email_confirmed_at: now })
    .eq('id', pending.targetId)
    .eq('status', 'unconfirmed')
    .select(claim
      ? 'id,claimant_name,claimant_email,pilates_studios(name,full_url_path)'
      : 'id,name,postcode,contact_name,contact_email,possible_duplicate_id')
    .single();

  if (!row) return null;

  const r = row as any;
  const studioName = claim ? r.pilates_studios?.name ?? null : r.name ?? null;

  // The reviewer hears about it now rather than at submission, because now is
  // when there is something worth their attention.
  await notifyAdmin(
    claim ? `Claim ready to review: ${studioName}` : `Studio ready to review: ${studioName}`,
    [
      claim
        ? `${r.claimant_name} <${r.claimant_email}> has confirmed their email and claims ${studioName}.`
        : `${r.contact_name} <${r.contact_email}> has confirmed their email. ${studioName}, ${r.postcode}.`,
      !claim && r.possible_duplicate_id ? 'Flagged as a possible duplicate.' : '',
      '',
      `Review: ${siteUrl()}/admin/${claim ? 'claims' : 'submissions'}`,
    ].filter(Boolean).join('\n')
  );

  return { kind: pending.kind, studioName };
}
