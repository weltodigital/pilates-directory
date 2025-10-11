import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <nav className="bg-white dark:bg-slate-800 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/Pilates Classes Near.png"
                alt="Pilates Classes Near"
                width={200}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm" asChild>
              <Link href="/#browse-counties">Browse Locations</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}