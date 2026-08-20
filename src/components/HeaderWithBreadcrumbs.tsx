import Header from '@/components/Header'

interface Breadcrumb {
  label: string;
  href?: string;
}

interface HeaderWithBreadcrumbsProps {
  breadcrumbs?: Breadcrumb[];
}

/**
 * Thin wrapper kept for the location templates that already import it.
 * Header renders the breadcrumb rail itself.
 */
export default function HeaderWithBreadcrumbs({ breadcrumbs }: HeaderWithBreadcrumbsProps) {
  return <Header breadcrumbs={breadcrumbs} />
}
