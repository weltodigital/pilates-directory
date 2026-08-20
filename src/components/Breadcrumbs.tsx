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
    <div className="border-b border-line bg-canvas">
      <div className="shell py-3">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-ink-faint" aria-hidden="true">/</span>
                )}
                {breadcrumb.href ? (
                  <Link href={breadcrumb.href} className="link-quiet">
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-ink" aria-current="page">
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
