import { redirect } from 'next/navigation'
import { adminConfigured, isAdmin } from '@/lib/admin-auth'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect('/admin');

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      {adminConfigured() ? (
        <AdminLoginForm />
      ) : (
        <div className="card-flat w-full max-w-sm p-8 text-center">
          <h1 className="font-fraunces text-xl font-semibold">Admin is not set up</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Set <code className="rounded bg-surface-sunken px-1.5 py-0.5">ADMIN_PASSWORD</code>{' '}
            and{' '}
            <code className="rounded bg-surface-sunken px-1.5 py-0.5">ADMIN_SESSION_SECRET</code>{' '}
            in the environment, then reload.
          </p>
        </div>
      )}
    </main>
  );
}
