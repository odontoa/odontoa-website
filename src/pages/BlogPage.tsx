import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight, Tag, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { supabase, Blog } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Sve");
  const [visiblePosts, setVisiblePosts] = useState(6);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      console.log('=== FETCHING PUBLISHED BLOGS VIA RAW HTTP ===');
      
      const response = await fetch('https://bjbfmddrekjmactytaky.supabase.co/rest/v1/blogs?select=*&published=eq.true&order=created_at.desc', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
          'Content-Type': 'application/json'
        }
      });

      console.log('Blog fetch response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched published blogs:', data?.length || 0);
        setBlogs(data || []);
      } else {
        const errorData = await response.text();
        console.error('Blog fetch error:', errorData);
        setError('Failed to load blogs via Raw HTTP');
      }
    } catch (error) {
      setError('Failed to load blogs');
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories from blog tags
  const categories = ['Sve', ...Array.from(new Set(blogs.flatMap(blog => blog.tags || [])))];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "Sve" || (blog.tags && blog.tags.includes(selectedCategory));
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min čitanja`;
  };

  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + 6);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Učitavam blogove...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Greška pri učitavanju blogova
            </h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchBlogs}>Pokušajte ponovo</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const featuredBlog = blogs.find(blog => blog.featured_image) || blogs[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Odontoa Blog | Vodiči i saveti za digitalnu stomatologiju</title>
        <meta name="description" content="Praktični saveti i vodiči za digitalno vođenje stomatološke ordinacije. Najnoviji trendovi u digitalnoj stomatologiji." />
        <link rel="canonical" href="https://odontoa.com/blogovi" />
      </Helmet>

      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 px-6">
        <div className="max-w-screen-xl mx-auto text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Odontoa Blog
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Vodiči i saveti za digitalnu stomatologiju. Naučite kako da modernizujete vašu ordinaciju i poboljšate pacijentsko iskustvo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Započnite čitanje
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3">
                Pretražite članke
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredBlog && (
        <section className="py-16 px-6 bg-white border-b border-gray-100">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-blue-100 text-blue-800 mb-4">
                Istaknuto
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Preporučeno čitanje
              </h2>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-12 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    {featuredBlog.tags && featuredBlog.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} className="bg-white/20 text-white text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                    {featuredBlog.title}
                  </h3>
                  <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                    {featuredBlog.excerpt}
                  </p>
                  <div className="flex items-center gap-6 mb-8 text-blue-100">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{featuredBlog.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{formatDate(featuredBlog.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{getReadingTime(featuredBlog.content)}</span>
                    </div>
                  </div>
                  <Link to={`/blogovi/${featuredBlog.slug}`}>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                      Pročitajte članak
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                {featuredBlog.featured_image && (
                  <div className="relative h-80 lg:h-full">
                    <img 
                      src={featuredBlog.featured_image} 
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pretražite članke
            </h2>
            <p className="text-gray-600">
              Pronađite savete i vodiče koji vam trebaju
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Pretražite blogove..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                } rounded-full px-6 py-2`}
              >
                <Tag className="h-4 w-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
          
          <div className="text-center text-sm text-gray-500">
            Prikazano {filteredBlogs.length} od {blogs.length} članaka
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-screen-xl mx-auto">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nema rezultata
                </h3>
                <p className="text-gray-600">
                  Pokušajte sa drugim ključnim rečima ili promenite kategoriju
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.slice(0, visiblePosts).map(blog => (
                  <article 
                    key={blog.id} 
                    className="group cursor-pointer" 
                  >
                    <Link to={`/blogovi/${blog.slug}`} className="block">
                      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                        <div className="relative overflow-hidden">
                          <img 
                            src={blog.featured_image || '/images/blog-placeholder.jpg'} 
                            alt={blog.title} 
                            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-4 left-4">
                            <div className="flex flex-wrap gap-2">
                              {blog.tags && blog.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} className="bg-white/90 text-gray-800 text-xs font-medium">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(blog.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{getReadingTime(blog.content)}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                            {blog.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                            {blog.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <User className="h-4 w-4" />
                              <span>{blog.author}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all duration-300">
                              <span>Pročitajte</span>
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
              
              {visiblePosts < filteredBlogs.length && (
                <div className="text-center mt-16">
                  <Button 
                    onClick={handleLoadMore}
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 rounded-full border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Učitaj više članaka
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage; 