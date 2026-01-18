import Image from "next/image";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  summary: string;
  image: string;
  url: string;
  tags?: { title: string; slug: string }[];
}

interface TrendingSplitProps {
  posts: Post[];
}

export function TrendingSplit({ posts }: TrendingSplitProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Text */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-foreground mb-6 leading-tight">
              Popularni članci koje vredi pročitati
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Pronađite najkorisnije članke koje su naši čitaoci najviše cenili.
            </p>
            <Link
              href="/blogovi#popularno"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Pogledaj sve
              <span className="hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Right Column - Vertical mini-cards */}
          <div className="flex flex-col gap-6">
            {posts.map((post) => {
              const categoryLabel = post.tags && post.tags.length > 0 ? post.tags[0].title : null;
              
              return (
                <Link
                  key={post.id}
                  href={post.url}
                  className="group block"
                >
                  <article className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground text-xs">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {categoryLabel && (
                        <span className="inline-block mb-2 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {categoryLabel}
                        </span>
                      )}
                      <h3 className="text-lg font-normal text-foreground mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {post.summary}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-primary group-hover:gap-2 transition-all font-medium">
                        Pročitaj više
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
