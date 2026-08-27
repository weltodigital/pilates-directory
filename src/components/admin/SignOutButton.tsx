'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function SignOutButton({ endpoint, to }: { endpoint: string; to: string }) {
  const router = useRouter();

  async function signOut() {
    await fetch(endpoint, { method: 'POST' });
    router.replace(to);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="link-quiet inline-flex items-center gap-1.5 text-sm"
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Sign out
    </button>
  );
}
