import Image from 'next/image';
import Link from 'next/link';

interface BlogListLandingProps {
  tagline: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  posts: {
    id: string;
    title: string;
    summary: string;
    label: string;
    author: string;
    published: string;
    url: string;
    image: string;
  }[];
}

export default function BlogListLanding({
  tagline,
  heading,
  description,
  buttonText,
  buttonUrl,
  posts,
}: BlogListLandingProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <p className="text-lg text-blue-600 font-medium mb-4">{tagline}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-8 leading-tight">
              {heading}
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-4xl mx-auto">
              {description}
            </p>

            <div className="flex justify-center">
              <Link href={buttonUrl}>
                <button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                  {buttonText}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
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
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      {post.published}
                    </div>
                    {post.label && (
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {post.label}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-1">
                    {post.summary}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center text-sm text-gray-500">
                      {post.author}
                    </div>
                    
                    <div className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-4 py-2 text-sm font-medium">
                      Pročitaj više
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
