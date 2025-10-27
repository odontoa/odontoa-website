'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Blog } from "@/lib/supabase";
import Link from "next/link";

const FeaturedBlogsSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // TODO: Strapi CMS integration - replace Supabase with Strapi API
        // Future mapping: ${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?populate=*&filters[featured][$eq]=true
        // Fields mapping: title, slug, excerpt, cover_image, tags, read_time, main_content, faq, seo_schema, datePublished, author
        
        // Dohvati samo članke sa featured = true
        let { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('published', true)
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching featured blogs:', error);
          return;
        }

        // Ako nema featured članaka, ne prikazuj sekciju
        if (!data || data.length === 0) {
          console.log('No featured blogs found');
          setBlogs([]);
        } else {
          setBlogs(data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
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
              <Link href={`/blog/${blogs[0].slug}`}>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:scale-[1.02] hover:border hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg mr-3">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-primary font-medium">
                      {blogs[0].tags?.[0] || 'Blog'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-normal text-foreground mb-3 line-clamp-2">
                    {blogs[0].title}
                  </h3>
                  
                  <p className="text-muted-foreground text-base mb-4 line-clamp-2">
                    {blogs[0].excerpt || (blogs[0].content ? blogs[0].content.substring(0, 150) + '...' : '')}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(blogs[0].created_at)}
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
                  <Link key={blog.id} href={`/blog/${blog.slug}`}>
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
                          {blog.tags?.[0] || 'Blog'}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-normal text-foreground mb-2 line-clamp-2">
                        {blog.title}
                      </h4>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {blog.excerpt || (blog.content ? blog.content.substring(0, 100) + '...' : '')}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(blog.created_at)}
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