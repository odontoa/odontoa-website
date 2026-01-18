import { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity.client';
import { allBlogPostsQuery, glossarySitemapQuery } from '@/lib/sanity.queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://odontoa.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/o-nama`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogovi`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/recnik`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/politika-privatnosti`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/uslovi-koriscenja`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/gdpr`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Blog posts from Sanity
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await sanityClient.fetch(allBlogPostsQuery);
    blogPages = posts
      .filter((post: any) => !post.noindex)
      .map((post: any) => ({
        url: `${baseUrl}/blogovi/${post.slug}`,
        lastModified: post.updatedAt 
          ? new Date(post.updatedAt) 
          : new Date(post.publishedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Glossary terms from Sanity (using optimized sitemap query with noindex filter)
  let glossaryPages: MetadataRoute.Sitemap = [];
  try {
    const terms = await sanityClient.fetch(glossarySitemapQuery);
    glossaryPages = terms.map((term: any) => ({
      url: `${baseUrl}/recnik/${term.slug}`,
      lastModified: term._updatedAt 
        ? new Date(term._updatedAt) 
        : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching glossary terms for sitemap:', error);
  }

  return [...staticPages, ...blogPages, ...glossaryPages];
}
