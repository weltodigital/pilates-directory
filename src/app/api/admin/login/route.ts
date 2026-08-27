import { NextResponse } from 'next/server'
import { field, serverClient, submitterHash } from '@/lib/forms'
import {
  ADMIN_COOKIE, adminConfigured, adminCookieOptions, issueSessionToken, passwordMatches,
} from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

/** Failed attempts are logged, and enough of them from one address stop it trying. */
const MAX_FAILURES_PER_HOUR = 8

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: 'No admin password is set on this deployment.' },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const password = typeof body.password === 'string' ? body.password : '';
  const supabase = serverClient();
  const hash = submitterHash(request);

  if (supabase) {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('admin_actions')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'admin.login_failed')
      .eq('note', hash)
      .gte('created_at', since);
    if ((count || 0) >= MAX_FAILURES_PER_HOUR) {
      return NextResponse.json(
        { error: 'Too many attempts. Try again later.' },
        { status: 429 }
      );
    }
  }

  if (!password || !passwordMatches(password)) {
    // The submitter hash goes in `note` so a burst of failures can be counted
    // per address without storing the address itself.
    await supabase?.from('admin_actions').insert({
      action: 'admin.login_failed',
      target_table: 'admin_actions',
      note: hash,
      detail: { user_agent: field(request.headers.get('user-agent'), 300) },
    });
    return NextResponse.json({ error: 'That password is not right.' }, { status: 401 });
  }

  await supabase?.from('admin_actions').insert({
    action: 'admin.login',
    target_table: 'admin_actions',
    note: hash,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, issueSessionToken(), adminCookieOptions);
  return res;
}
