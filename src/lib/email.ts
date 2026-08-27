/**
 * Outbound email, over Resend's HTTP API.
 *
 * No SDK: one POST is not worth a dependency.
 *
 * Without RESEND_API_KEY the message is written to the server log instead of
 * being sent, and the caller still sees success. That keeps the login flow
 * testable before the account exists, and means a missing key degrades to
 * "the link is in the log" rather than a broken sign-in page.
 */

interface Message {
  to: string;
  subject: string;
  text: string;
}

const DEFAULT_FROM = 'Pilates Classes Near <info@pilatesclassesnear.com>'

export async function sendEmail({ to, subject, text }: Message): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    console.log(
      `\n[email not sent - RESEND_API_KEY is unset]\n  to: ${to}\n  subject: ${subject}\n\n${text}\n`
    );
    return true;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || DEFAULT_FROM,
        to: [to],
        subject,
        text,
      }),
    });
    if (!res.ok) {
      console.error(`Email to ${to} failed: ${res.status} ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Email failed:', err);
    return false;
  }
}

/**
 * Tell the operator something is waiting. Never allowed to fail a request:
 * a submission that saved but could not be announced is still saved, and the
 * admin queue will show it either way.
 */
export async function notifyAdmin(subject: string, text: string): Promise<void> {
  const to = process.env.ADMIN_EMAIL;
  if (!to) return;
  try {
    await sendEmail({ to, subject, text });
  } catch {
    /* the queue is the source of truth, not the notification */
  }
}

/** Absolute base for links inside emails, which have no request to infer one from. */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  return process.env.NODE_ENV === 'production'
    ? 'https://www.pilatesclassesnear.com'
    : 'http://localhost:3000';
}
