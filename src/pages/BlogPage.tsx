import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight, Tag } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Digitalizacija stomatoloških ordinacija: Vodič za 2024. godinu",
    excerpt: "Saznajte kako digitalni alati mogu transformisati vašu praksu i poboljšati iskustvo pacijenata kroz moderne tehnologije.",
    content: "Digitalizacija zdravstva postaje sve važnija, a stomatološke ordinacije nisu izuzetak...",
    image: "/images/doktori-dashboard.png",
    author: "Dr. Marija Petrović",
    date: "15. Decembar 2024",
    readTime: "8 min čitanja",
    category: "Tehnologija",
    tags: ["digitalizacija", "tehnologija", "ordinacija"]
  },
  {
    id: 2,
    title: "GDPR i zaštita podataka pacijenata u stomatologiji",
    excerpt: "Sve što trebate da znate o GDPR propisima i kako da zaštitite medicinske podatke vaših pacijenata u digitalnom dobu.",
    content: "Zaštita podataka pacijenata je od krucijalnog značaja za svaku stomatološku ordinaciju...",
    image: "/images/1dentist-smiling.jpg",
    author: "Dr. Stefan Nikolić",
    date: "10. Decembar 2024",
    readTime: "6 min čitanja",
    category: "Sigurnost",
    tags: ["GDPR", "privatnost", "sigurnost"]
  },
  {
    id: 3,
    title: "Kako povećati efikasnost ordinacije kroz bolje upravljanje terminima",
    excerpt: "Praktični saveti za optimizaciju rasporededa termina i smanjenje čekanja pacijenata kroz digitalna rešenja.",
    content: "Efikasno upravljanje terminima je ključ uspešne stomatološke prakse...",
    image: "/images/kalendar.png",
    author: "Dr. Ana Jovanović",
    date: "5. Decembar 2024",
    readTime: "7 min čitanja",
    category: "Upravljanje",
    tags: ["termini", "efikasnost", "organizacija"]
  }
];

const BlogPage = () => {
  const handleReadMore = (postId: number) => {
    // In a real app, this would navigate to individual blog post
    console.log(`Navigate to blog post ${postId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Navigation />
      
      {/* Hero Section - Redesigned to be more compact and elegant */}
      <section className="relative py-16 px-6 bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          {/* Small decorative element */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#4a9489]/10 border border-[#4a9489]/20 mb-6">
            <Tag className="w-4 h-4 text-[#4a9489] mr-2" />
            <span className="text-sm font-medium text-[#4a9489]">Blog</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Odontoa <span className="text-[#4a9489]">Blog</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Korisni saveti, novosti iz sveta digitalne stomatologije i praktični vodiči 
            za uspešno vođenje vaše ordinacije.
          </p>
        </div>
        
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4a9489]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-2xl"></div>
      </section>

      {/* Featured Post */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Izdvojeno</h2>
            <p className="text-gray-600">Najnoviji članak iz našeg bloga</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-[#4a9489]/30 transition-all duration-300 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#4a9489] text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    {blogPosts[0].category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{blogPosts[0].date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>{blogPosts[0].readTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <span>{blogPosts[0].author}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {blogPosts[0].title}
                </h3>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {blogPosts[0].excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {blogPosts[0].tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <Button 
                  onClick={() => handleReadMore(blogPosts[0].id)}
                  className="bg-[#1976D2] text-white hover:bg-[#1565C0] transition-colors duration-200 font-semibold w-fit shadow-lg hover:shadow-xl"
                  style={{borderRadius: '12px'}}
                >
                  Čitaj više
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Najnoviji članci</h2>
            <p className="text-gray-600">Ostali korisni sadržaji za vašu praksu</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.slice(1).map((post) => (
              <article key={post.id} className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#4a9489]/30 transition-all duration-300 group">
                <div className="relative h-48">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#1976D2] text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 bg-white">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#4a9489] transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs border">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <User size={14} />
                      <span>{post.author}</span>
                    </div>
                    
                    <Button 
                      onClick={() => handleReadMore(post.id)}
                      variant="ghost"
                      size="sm"
                      className="text-[#4a9489] hover:text-white hover:bg-[#4a9489] transition-colors"
                    >
                      Čitaj više
                      <ArrowRight className="ml-1" size={14} />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="bg-gradient-to-r from-[#1976D2] to-[#4a9489] rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Budite u toku sa najnovijim trendovima
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Prijavite se na naš newsletter i redovno dobijajte korisne savete 
              o digitalizaciji stomatoloških ordinacija.
            </p>
            
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Vaša email adresa"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/70 focus:outline-none focus:border-white/40 backdrop-blur-sm"
              />
              <Button className="bg-white text-[#1976D2] hover:bg-gray-100 transition-colors duration-200 font-semibold px-6 py-3 shadow-lg hover:shadow-xl" style={{borderRadius: '12px'}}>
                Prijavite se
              </Button>
            </div>
            
            <p className="text-sm text-white/70 mt-4">
              Bez spama. Možete se odjaviti u bilo kom trenutku.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage; 