import { NextResponse } from 'next/server'
import {
  serverClient, field, isEmail, submitterHash, isRateLimited, looksLikeBot,
} from '@/lib/forms'
import { sendEmail } from '@/lib/email'
import { CONTACT_EMAIL } from '@/lib/site'

export const dynamic = 'force-dynamic'

/**
 * POST /api/contact
 *
 * Records the message, then emails it on. In that order: the row is what
 * survives a bad minute at the email provider, and an enquiry lost to a
 * failed send is an enquiry lost.
 */
export async function POST(request: Request) {
  const supabase = serverClient();
  if (!supabase) {
    return NextResponse.json(
      { error: `The form is unavailable right now. Please email ${CONTACT_EMAIL}.` },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (looksLikeBot(body)) return NextResponse.json({ ok: true });

  const name = field(body.name, 120);
  const email = field(body.email, 254);
  const subject = field(body.subject, 160);
  const message = field(body.message, 4000);

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Enter your name.';
  if (!email) errors.email = 'Enter your email address.';
  else if (!isEmail(email)) errors.email = 'Enter a valid email address.';
  if (!message) errors.message = 'Tell us how we can help.';
  else if (message.length < 10) errors.message = 'Please add a little more detail.';

  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const hash = submitterHash(request);
  if (await isRateLimited(supabase, 'contact_messages', hash, 4)) {
    return NextResponse.json(
      { error: `You have sent several messages recently. Please email ${CONTACT_EMAIL} instead.` },
      { status: 429 }
    );
  }

  const { data: row, error } = await supabase
    .from('contact_messages')
    .insert({
      name,
      email: email!.toLowerCase(),
      subject,
      message,
      submitter_hash: hash,
      user_agent: request.headers.get('user-agent')?.slice(0, 300) || null,
      referer: field(request.headers.get('referer'), 300),
    })
    .select('id')
    .single();

  if (error) {
    console.error('Contact message failed to save:', error.message);
    return NextResponse.json(
      { error: `We could not send that. Please email ${CONTACT_EMAIL} directly.` },
      { status: 500 }
    );
  }

  // reply_to is the sender, so hitting reply in the inbox answers the person
  // rather than the site.
  const delivered = await sendEmail({
    to: CONTACT_EMAIL,
    replyTo: email!,
    subject: subject ? `Contact: ${subject}` : `Contact from ${name}`,
    text: [
      `${name} <${email}> wrote:`,
      '',
      message!,
      '',
      '—',
      'Sent from the contact form at pilatesclassesnear.com.',
      'Reply to this email to answer them directly.',
    ].join('\n'),
  });

  await supabase
    .from('contact_messages')
    .update({
      delivered,
      delivery_error: delivered ? null : 'Provider rejected the message',
    })
    .eq('id', row.id);

  // The message is saved either way, so the sender is told it arrived - which
  // is true. A failed notification is our problem, not theirs.
  return NextResponse.json({ ok: true });
}
