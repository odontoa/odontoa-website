import { fetchPublicArticles } from '@/lib/strapiClient'
import BlogListLanding from '@/components/blog/BlogListLanding'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog – Odontoa",
    description:
      "Digitalizacija stomatološke ordinacije: saveti o organizaciji pacijenata, zalihama i zakazivanju termina.",
    openGraph: {
      title: "Blog – Odontoa",
      description:
        "Saveti i praksa iz ordinacije: pacijenti, zalihe, zakazivanje, analitika.",
    },
  };
}

function formatToSerbianDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("sr-RS", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export default async function Blog2Page() {
  let articles = [];
  
  try {
    articles = await fetchPublicArticles();
  } catch (error) {
    console.error('Error fetching articles:', error);
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-center text-gray-600 py-20">
              Trenutno nije moguće učitati blog postove. Pokušajte kasnije.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Transform articles to the format expected by BlogListLanding
  const posts = articles.map((article) => ({
    id: article.slug,
    title: article.title,
    summary: article.description,
    label: "Aktuelno", // Default label, can be enhanced later with categories
    author: article.authorName || "Odontoa tim",
    published: formatToSerbianDate(article.publishedAtISO),
    url: `/blog2/${article.slug}`,
    image: article.coverImageUrl || "",
  }));

  return (
    <BlogListLanding
      tagline="Digitalizacija stomatološke ordinacije"
      heading="Vodič za modernu dentalnu praksu"
      description="Praktični saveti i aktuelne teme koje pomažu da vaša ordinacija radi bolje."
      buttonText="Zakaži demo"
      buttonUrl="/kontakt?source=blog2"
      posts={posts}
    />
  );
}
