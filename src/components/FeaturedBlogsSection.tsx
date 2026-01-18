import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity.client";
import { allBlogPostsQuery, type SanityBlogPost } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";

function formatToSerbianDate(isoString: string): string {
  const date = new Date(isoString);
  const months = [
    "januar", "februar", "mart", "april", "maj", "jun",
    "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day}. ${month} ${year}`;
}

async function getFeaturedBlogs() {
  try {
    const sanityPosts = await sanityClient.fetch<SanityBlogPost[]>(allBlogPostsQuery);
    
    // Uzmi poslednja 3 članka
    const posts = (sanityPosts || []).slice(0, 3).map((post) => {
      const coverImageUrl = post.coverImage
        ? urlFor(post.coverImage).width(400).height(200).url()
        : "";

      return {
        id: post.slug,
        title: post.title,
        summary: post.excerpt || "",
        label: post.tags && post.tags.length > 0 ? post.tags[0].title : "Aktuelno",
        author: post.authorName || "Odontoa tim",
        published: formatToSerbianDate(post.publishedAt),
        url: `/blogovi/${post.slug}`,
        image: coverImageUrl,
      };
    });
    
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts from Sanity:", error);
    return [];
  }
}

const FeaturedBlogsSection = async () => {
  const blogs = await getFeaturedBlogs();

  return (
    <section className="section-spacing w-full px-6 bg-background">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-normal text-foreground mb-3 leading-tight">
            Preporučeni članci
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Naši najbolji članci i vodiči za digitalizaciju ordinacije
          </p>
        </div>

        {/* Blog Cards Grid - 3 članka */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {blogs.map((post) => (
              <Link key={post.id} href={post.url}>
                <div className="group cursor-pointer border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl h-full flex flex-col">
                  <div className="p-0 flex-shrink-0">
                    <div className="relative overflow-hidden">
                      {post.image ? (
                        <Image 
                          src={post.image} 
                          alt={post.title} 
                          width={400}
                          height={200}
                          className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105" 
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-36 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <div className="flex items-center">
                        {post.published}
                      </div>
                      {post.label && (
                        <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          {post.label}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3 leading-relaxed flex-1">
                      {post.summary}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                      <div className="flex items-center text-xs text-gray-500">
                        {post.author}
                      </div>
                      
                      <div className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-3 py-1.5 text-xs font-medium">
                        Pročitaj više
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Trenutno nema dostupnih blog postova.
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/blogovi">
            <Button 
              size="lg" 
              className="rounded-full bg-primary text-white px-8 py-3 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Pogledaj sve članke
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogsSection; 