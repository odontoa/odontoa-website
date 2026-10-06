import { Fragment } from 'react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { BreadcrumbItem as Crumb } from '@/lib/structured-data/page-graph';

/* Vidljivi breadcrumb recnika. Isti niz stavki ide i u BreadcrumbList JSON-LD,
   pa se vidljiva i strukturirana putanja ne mogu raziti. Stil: .recnik-crumbs u recnik.css. */
export default function RecnikBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <Breadcrumb className="recnik-crumbs">
      <BreadcrumbList className="recnik-crumbs__list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={item.path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="recnik-crumbs__current">{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="recnik-crumbs__link">
                    <Link href={item.path}>{item.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="recnik-crumbs__sep" />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
