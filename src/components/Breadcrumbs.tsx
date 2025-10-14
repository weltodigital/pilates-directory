import Link from 'next/link'

interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

export default function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <div className="bg-gray-50 border-b">
      <div className="container mx-auto px-4 py-3">
        <nav className="text-sm text-gray-600">
          <ol className="flex space-x-2">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-gray-400">/</span>
                )}
                {breadcrumb.href ? (
                  <Link href={breadcrumb.href} className="hover:text-purple-600">
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900">
                    {breadcrumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}