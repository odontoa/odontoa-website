import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight, Tag, Search } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  author: {
    name: string;
    title: string;
    avatar?: string;
  };
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
  sections: {
    title: string;
    icon: string;
    content: string;
  }[];
  quote?: {
    text: string;
    author: string;
  };
  stats?: {
    label: string;
    value: string;
  }[];
  ctaLink: string;
  ctaText: string;
}

const categories = ['Sve', 'Tehnologija', 'Upravljanje', 'Sigurnost', 'Administracija', 'Softver'];

export const allPosts: BlogPost[] = [
  {
    id: 1,
    title: "Digitalizacija stomatoloških ordinacija: Vodič za 2025. godinu",
    description: "Saznajte kako digitalni alati mogu transformisati vašu praksu i poboljšati iskustvo pacijenata kroz modernu tehnologiju.",
    content: `
## Zašto je digitalizacija ključna za moderne stomatološke ordinacije?

U 2025. godini, sve više ordinacija u Srbiji prelazi sa papirne dokumentacije na digitalne alate. Ovaj trend nije stvar mode — on donosi konkretnu efikasnost i sigurnost u svakodnevnom radu.
    `,
    image: "/images/blog1.png",
    author: {
      name: "Dr. Marija Petrović",
      title: "Specijalista stomatološke protetike",
      avatar: "/images/avatars/marija.jpg"
    },
    date: "12. Januar 2025",
    readTime: "8 min čitanja",
    category: "Tehnologija",
    featured: true,
    quote: {
      text: "Digitalizacija nije luksuz. Ona je alat koji nam štedi vreme i smanjuje greške.",
      author: "Dr. Marija Petrović"
    },
    sections: [
      {
        title: "Zakazivanje termina bez stresa",
        icon: "📅",
        content: "- Automatski podsetnici putem SMS-a i mejla\n- Jasna raspodela po doktorima i smenama\n- Manje otkazanih termina"
      },
      {
        title: "Digitalna evidencija pacijenata",
        icon: "🗂",
        content: "- Kompletna istorija pregleda dostupna u par klikova\n- Bolja priprema pre svakog termina\n- Dokumentacija dostupna sa bilo kog uređaja"
      },
      {
        title: "Upravljanje timom",
        icon: "👥",
        content: "- Jasna uloga svakog člana tima\n- Dodeljivanje obaveza i interno beleženje\n- Lakša organizacija smena"
      },
      {
        title: "Zalihe i administracija",
        icon: "📦",
        content: "- Praćenje potrošnje po kabinetima\n- Automatski podsetnici za poručivanje\n- Nema više nestanka materijala u sred radnog dana"
      },
      {
        title: "Statistika i analitika",
        icon: "📊",
        content: "- Pregled prihoda i broja pacijenata po periodu\n- Prepoznavanje najposećenijih dana u nedelji\n- Merenje efikasnosti po doktorima"
      }
    ],
    stats: [
      {
        label: "Ušteda vremena na administraciji nedeljno",
        value: "6+ sati"
      },
      {
        label: "Smanjenje otkazanih termina",
        value: "40%"
      }
    ],
    ctaLink: "/demo",
    ctaText: "Zakažite demo"
  },
  {
    id: 2,
    title: "Kako efikasnije zakazivati termine u timovima",
    description: "Koji digitalni alati pomažu pri rasporedu rada i kako ih koristiti uz manji broj otkazivanja?",
    content: "Sadržaj će biti dodat...",
    image: "/images/kalendar.png",
    author: {
      name: "Dr. Ana Jovanović",
      title: "Specijalista stomatološke protetike",
      avatar: "/images/avatars/ana.jpg"
    },
    date: "2. Januar 2025",
    readTime: "5 min čitanja",
    category: "Upravljanje",
    sections: [
      {
        title: "Planiranje rasporeda",
        icon: "📅",
        content: "- Efikasno planiranje\n- Optimizacija vremena\n- Smanjenje preklapanja"
      }
    ],
    quote: {
      text: "Dobro organizovan raspored je ključ uspešne ordinacije",
      author: "Dr. Ana Jovanović"
    },
    stats: [
      {
        label: "Povećanje efikasnosti",
        value: "30%"
      }
    ],
    ctaLink: "/demo",
    ctaText: "Isprobajte Odontoa"
  },
  {
    id: 3,
    title: "5 najčešćih grešaka kod evidencije pacijenata",
    description: "Kroz iskustva ordinacija otkrivamo na šta posebno treba obratiti pažnju u vođenju digitalnih kartona.",
    content: "Sadržaj će biti dodat...",
    image: "/images/1dentist-smiling.jpg",
    author: {
      name: "Dr. Jelena Marković",
      title: "Specijalista stomatološke protetike",
      avatar: "/images/avatars/jelena.jpg"
    },
    date: "10. Januar 2025",
    readTime: "6 min čitanja",
    category: "Sigurnost",
    sections: [
      {
        title: "Digitalna evidencija",
        icon: "📋",
        content: "- Pravilno vođenje kartona\n- Sigurnost podataka\n- Redovno ažuriranje"
      }
    ],
    quote: {
      text: "Precizna evidencija je osnova kvalitetne stomatološke usluge",
      author: "Dr. Jelena Marković"
    },
    stats: [
      {
        label: "Smanjenje grešaka",
        value: "45%"
      }
    ],
    ctaLink: "/demo",
    ctaText: "Saznajte više"
  },
  {
    id: 4,
    title: "Da li je vreme da pređete sa Excela na softver?",
    description: "Prikaz prednosti i mane oba pristupa — uz konkretne savete za prelazak bez stresa.",
    content: "Sadržaj će biti dodat...",
    image: "/images/dashboard-dent.png",
    author: {
      name: "Dr. Nikola Pavlović",
      title: "Specijalista stomatološke protetike",
      avatar: "/images/avatars/nikola.jpg"
    },
    date: "18. Januar 2025",
    readTime: "4 min čitanja",
    category: "Tehnologija",
    sections: [
      {
        title: "Prelazak na softver",
        icon: "💻",
        content: "- Analiza potreba\n- Izbor rešenja\n- Implementacija"
      }
    ],
    quote: {
      text: "Moderno poslovanje zahteva moderna rešenja",
      author: "Dr. Nikola Pavlović"
    },
    stats: [
      {
        label: "Ušteda vremena",
        value: "50%"
      }
    ],
    ctaLink: "/demo",
    ctaText: "Započnite prelazak"
  },
  {
    id: 5,
    title: "Kako pripremiti ordinaciju za akreditaciju?",
    description: "Administrativni checklist i softverski alati koji pomažu pri inspekciji i evaluaciji kvaliteta.",
    content: "Sadržaj će biti dodat...",
    image: "/images/akreditacija.png",
    author: {
      name: "Dr. Ivana Ristić",
      title: "Specijalista stomatološke protetike",
      avatar: "/images/avatars/ivana.jpg"
    },
    date: "22. Januar 2025",
    readTime: "7 min čitanja",
    category: "Administracija",
    sections: [
      {
        title: "Priprema za akreditaciju",
        icon: "✅",
        content: "- Dokumentacija\n- Procedure\n- Standardi"
      }
    ],
    quote: {
      text: "Akreditacija je potvrda kvaliteta vaše ordinacije",
      author: "Dr. Ivana Ristić"
    },
    stats: [
      {
        label: "Uspešnost akreditacije",
        value: "95%"
      }
    ],
    ctaLink: "/demo",
    ctaText: "Pripremite se"
  },
  {
    id: 6,
    title: "GDPR i zaštita podataka pacijenata u stomatologiji",
    description: "Sve što trebate da znate o GDPR propisima i kako da zaštitite medicinske podatke vaših pacijenata.",
    content: "Sadržaj će biti dodat...",
    image: "/images/1dentist-smiling.jpg",
    author: {
      name: "Dr. Stefan Nikolić",
      title: "Specijalista stomatološke protetike",
      avatar: "/images/avatars/stefan.jpg"
    },
    date: "28. Januar 2025",
    readTime: "6 min čitanja",
    category: "Sigurnost",
    sections: [
      {
        title: "GDPR usklađenost",
        icon: "🔒",
        content: "- Zaštita podataka\n- Pravna regulativa\n- Implementacija"
      }
    ],
    quote: {
      text: "Privatnost pacijenata mora biti prioritet",
      author: "Dr. Stefan Nikolić"
    },
    stats: [
      {
        label: "Sigurnost podataka",
        value: "100%"
      }
    ],
    ctaLink: "/demo",
    ctaText: "Osigurajte podatke"
  }
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Sve");
  const [visiblePosts, setVisiblePosts] = useState(6);

  const featuredPost = allPosts.find(post => post.featured);

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "Sve" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + 6);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Odontoa Blog | Vodiči i saveti za digitalnu stomatologiju</title>
        <meta name="description" content="Praktični saveti i vodiči za digitalno vođenje stomatološke ordinacije. Najnoviji trendovi u digitalnoj stomatologiji." />
        <link rel="canonical" href="https://odontoa.com/blog" />
      </Helmet>

      <Navigation />

      {/* Hero with Featured Post */}
      <section className="py-16 px-6 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#4a9489]/10 border border-[#4a9489]/20 mb-6">
              <Tag className="w-4 h-4 text-[#4a9489] mr-2" />
              <span className="text-sm font-medium text-[#4a9489]">Blog</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Odontoa <span className="text-[#4a9489]">Blog</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Korisni saveti i vodiči za digitalno vođenje stomatološke ordinacije.
            </p>
          </div>

          {featuredPost && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#4a9489] text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {featuredPost.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <button className="flex items-center gap-2 text-sm text-gray-600">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={featuredPost.author.avatar} />
                            <AvatarFallback>{featuredPost.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{featuredPost.author.name}</span>
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={featuredPost.author.avatar} />
                            <AvatarFallback>{featuredPost.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">{featuredPost.author.name}</h4>
                            <p className="text-sm text-gray-600">{featuredPost.author.title}</p>
                            <div className="flex items-center pt-2">
                              <Button variant="link" className="h-8 text-xs text-[#4a9489]">
                                Pogledaj sve članke
                              </Button>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <Button 
                      onClick={() => window.location.href = `/blogovi/${featuredPost.id}`}
                      className="bg-[#4a9489] text-white hover:bg-[#3b766d]"
                    >
                      Čitaj više
                      <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pretraži članke..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#4a9489] outline-none"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap ${
                      selectedCategory === category 
                        ? "bg-[#4a9489] text-white hover:bg-[#3b766d]" 
                        : "bg-white text-gray-600 hover:bg-[#4a9489] hover:text-white"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(0, visiblePosts).map(post => (
              <article 
                key={post.id} 
                className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer" 
                onClick={() => window.location.href = `/blogovi/${post.id}`}
              >
                <div className="relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2 gap-4">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#4a9489] transition-colors">{post.title}</h3>
                  <p className="text-gray-600 mb-6">{post.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <button 
                          className="flex items-center gap-2" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{post.author.name}</span>
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">{post.author.name}</h4>
                            <p className="text-sm text-gray-600">{post.author.title}</p>
                            <div className="flex items-center pt-2">
                              <Button 
                                variant="link" 
                                className="h-8 text-xs text-[#4a9489]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Pogledaj sve članke
                              </Button>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[#4a9489] hover:text-white hover:bg-[#4a9489] transition-colors pointer-events-none"
                    >
                      Čitaj više <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          {filteredPosts.length > visiblePosts && (
            <div className="text-center mt-12">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="text-[#4a9489] border-[#4a9489] hover:bg-[#4a9489] hover:text-white"
              >
                Učitaj još članaka
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage; 