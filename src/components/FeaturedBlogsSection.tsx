'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchPublicArticles, ArticleSummary } from "@/lib/strapiClient";
import Link from "next/link";

const FeaturedBlogsSection = () => {
  const [blogs, setBlogs] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Uzmi sve članke iz Strapi-ja (za sada bez featured filtera)
        const articles = await fetchPublicArticles();
        
        // Uzmi prva 3 članka kao "featured"
        const featuredArticles = articles.slice(0, 3);
        
        if (featuredArticles.length === 0) {
          console.log('No featured blogs found - using fallback content');
          // Fallback sadržaj kada Strapi nije dostupan
          setBlogs([
            {
              title: "Digitalizacija stomatološke ordinacije",
              slug: "digitalizacija-stomatoloske-ordinacije",
              description: "Saznajte kako moderni alati mogu transformisati vašu stomatološku praksu i poboljšati efikasnost rada.",
              coverImageUrl: null,
              authorName: "Odontoa tim",
              publishedAtISO: new Date().toISOString()
            },
            {
              title: "Upravljanje pacijentima u digitalnom dobu",
              slug: "upravljanje-pacijentima-digitalno",
              description: "Najbolje prakse za organizaciju i praćenje pacijenata kroz digitalne alate.",
              coverImageUrl: null,
              authorName: "Odontoa tim",
              publishedAtISO: new Date().toISOString()
            },
            {
              title: "Automatizacija SMS i email podsetnika",
              slug: "automatizacija-podsetnika",
              description: "Kako automatizovati komunikaciju sa pacijentima i smanjiti administrativni teret.",
              coverImageUrl: null,
              authorName: "Odontoa tim",
              publishedAtISO: new Date().toISOString()
            }
          ]);
        } else {
          setBlogs(featuredArticles);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        // Fallback sadržaj u slučaju greške
        setBlogs([
          {
            title: "Digitalizacija stomatološke ordinacije",
            slug: "digitalizacija-stomatoloske-ordinacije",
            description: "Saznajte kako moderni alati mogu transformisati vašu stomatološku praksu i poboljšati efikasnost rada.",
            coverImageUrl: null,
            authorName: "Odontoa tim",
            publishedAtISO: new Date().toISOString()
          },
          {
            title: "Upravljanje pacijentima u digitalnom dobu",
            slug: "upravljanje-pacijentima-digitalno",
            description: "Najbolje prakse za organizaciju i praćenje pacijenata kroz digitalne alate.",
            coverImageUrl: null,
            authorName: "Odontoa tim",
            publishedAtISO: new Date().toISOString()
          },
          {
            title: "Automatizacija SMS i email podsetnika",
            slug: "automatizacija-podsetnika",
            description: "Kako automatizovati komunikaciju sa pacijentima i smanjiti administrativni teret.",
            coverImageUrl: null,
            authorName: "Odontoa tim",
            publishedAtISO: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
    
    // Listen for content updates
    const handleContentUpdate = () => {
      console.log('=== FEATURED BLOGS: Content update received ===')
      fetchBlogs()
    }
    
    window.addEventListener('content-updated', handleContentUpdate)
    
    return () => {
      window.removeEventListener('content-updated', handleContentUpdate)
    }
  }, []);

  // Sekcija se prikazuje samo ako postoje članci sa featured = true

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="section-spacing w-full px-6 bg-background">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-normal text-foreground mb-3 leading-tight">
            Preporučeni članci
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Naši najbolji članci i vodiči za digitalizaciju ordinacije
          </p>
        </motion.div>

        {/* Blog Cards Layout */}
        {blogs.length > 0 && (
          <div className="space-y-6 mb-8">
            {/* Hero Blog Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link href={`/blog2/${blogs[0].slug}`}>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:scale-[1.02] hover:border hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg mr-3">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-primary font-medium">
                      Blog
                    </span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-normal text-foreground mb-3 line-clamp-2">
                    {blogs[0].title}
                  </h3>
                  
                  <p className="text-muted-foreground text-base mb-4 line-clamp-2">
                    {blogs[0].description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(blogs[0].publishedAtISO)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-white hover:bg-primary p-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Two Smaller Blog Cards */}
            {blogs.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogs.slice(1).map((blog, index) => (
                  <Link key={blog.slug} href={`/blog2/${blog.slug}`}>
                    <motion.div
                      className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md hover:scale-105 hover:border hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 min-h-[160px]"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="p-1.5 bg-primary/10 rounded-lg mr-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-xs text-primary font-medium">
                          Blog
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-normal text-foreground mb-2 line-clamp-2">
                        {blog.title}
                      </h4>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {blog.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(blog.publishedAtISO)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-white hover:bg-primary p-1.5"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/blog">
            <Button 
              size="lg" 
              className="rounded-full bg-primary text-white px-8 py-3 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Pogledaj sve članke
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedBlogsSection; 