import { groq } from 'next-sanity';
import { sanityClient } from '@/lib/sanity.client';
import { isSectionHidden } from '@/lib/config/hidden-sections';

/* Veze pojam -> blog. Blog zivi u Sanity-ju, pa se postojanje posta proverava upitom:
   prikazuju se samo objavljeni postovi bez noindex, i samo dok je blog javna sekcija.
   Bez mreze ili kad upit padne, veze se izostavljaju (stranica pojma se i dalje generise). */

const postsBySlugsQuery = groq`*[_type == "blogPost" && slug.current in $slugs && coalesce(noindex, false) == false]{
  title,
  "slug": slug.current
}`;

export type RecnikBlogLink = { slug: string; title: string; path: string };

export async function resolveBlogLinks(slugs: string[]): Promise<RecnikBlogLink[]> {
  if (slugs.length === 0 || isSectionHidden('/blogovi')) return [];
  try {
    const posts = await sanityClient.fetch<{ slug: string; title: string }[]>(
      postsBySlugsQuery,
      { slugs },
      { next: { tags: ['sanity-blog'] } },
    );
    const bySlug = new Map(posts.map((p) => [p.slug, p]));
    return slugs
      .map((slug) => bySlug.get(slug))
      .filter((p): p is { slug: string; title: string } => Boolean(p))
      .map((p) => ({ ...p, path: `/blogovi/${p.slug}` }));
  } catch (error) {
    console.error('Recnik: blog veze nisu ucitane iz Sanity-ja:', error);
    return [];
  }
}
