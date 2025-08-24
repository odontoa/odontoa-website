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
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching blogs:', error);
          return;
        }

        setBlogs(data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Placeholder blogs for fallback
  const placeholderBlogs: Partial<Blog>[] = [
    {
      id: '1',
      title: 'Kako digitalizovati ordinaciju u 5 koraka',
      excerpt: 'Praktičan vodič za stomatologe koji žele da pređu sa papirnih kartona na digitalno rešenje...',
      tags: ['Digitalizacija', 'Vodič'],
      created_at: new Date().toISOString(),
      slug: 'digitalizacija-ordinacije'
    },
    {
      id: '2',
      title: 'Najnoviji trendovi u stomatologiji 2024',
      excerpt: 'Pregled najvažnijih tehnoloških inovacija i praksi koje će oblikovati budućnost stomatologije...',
      tags: ['Trendovi', 'Tehnologija'],
      created_at: new Date().toISOString(),
      slug: 'trendovi-stomatologija-2024'
    },
    {
      id: '3',
      title: 'Optimizacija rasporeda za veću efikasnost',
      excerpt: 'Saveti kako da organizujete termine i smene za maksimalnu produktivnost tima...',
      tags: ['Optimizacija', 'Tim'],
      created_at: new Date().toISOString(),
      slug: 'optimizacija-rasporeda'
    }
  ];

  const displayBlogs = blogs.length > 0 ? blogs : placeholderBlogs;

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
            Najnoviji članci i saveti
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Najnoviji saveti i vodiči za digitalizaciju ordinacije
          </p>
        </motion.div>

        {/* Blog Cards Layout */}
        {displayBlogs.length > 0 && (
          <div className="space-y-6 mb-8">
            {/* Hero Blog Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link href={`/blog/${displayBlogs[0].slug}`}>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:scale-[1.02] hover:border hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg mr-3">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-primary font-medium">
                      {displayBlogs[0].tags?.[0] || 'Featured'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-normal text-foreground mb-3 line-clamp-2">
                    {displayBlogs[0].title}
                  </h3>
                  
                  <p className="text-muted-foreground text-base mb-4 line-clamp-2">
                    {displayBlogs[0].excerpt || (displayBlogs[0].content ? displayBlogs[0].content.substring(0, 150) + '...' : '')}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(displayBlogs[0].created_at)}
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
            {displayBlogs.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayBlogs.slice(1).map((blog, index) => (
                  <motion.div
                    key={blog.id}
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
                      <Link href={`/blog/${blog.slug}`}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-white hover:bg-primary p-1.5"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
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