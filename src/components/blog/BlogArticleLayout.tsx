import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import HeroSplitV2 from './HeroSplitV2';
import TocCardV2 from './TocCardV2';
import KeyTakeawaysV2 from './KeyTakeawaysV2';
import ProseV2 from './ProseV2';

interface BlogArticleLayoutProps {
  title: string;
  description: string;
  coverImageUrl: string | null;
  authorName: string | null;
  authorAvatarUrl: string | null;
  publishedAt: string;
  contentHtml: string | null;
  keyTakeaways?: string[];
  tags?: string[];
}

export default function BlogArticleLayout({
  title,
  description,
  coverImageUrl,
  authorName,
  authorAvatarUrl,
  publishedAt,
  contentHtml,
  keyTakeaways = [],
  tags = [],
}: BlogArticleLayoutProps) {
  // Extract headings from contentHtml for TOC
  const extractHeadings = (html: string) => {
    if (!html) return [];
    
    const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/gi;
    const headings: { id: string; title: string; level: number }[] = [];
    let match;
    
    while ((match = headingRegex.exec(html)) !== null) {
      const level = parseInt(match[1]);
      const title = match[2].replace(/<[^>]*>/g, '').trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      
      headings.push({ id, title, level });
    }
    
    return headings;
  };

  const tocItems = contentHtml ? extractHeadings(contentHtml) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Back to Blog Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          href="/blog2" 
          className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Nazad na sve blogove
        </Link>
      </div>

      {/* Hero Section */}
      <HeroSplitV2
        title={title}
        description={description}
        coverImageUrl={coverImageUrl}
        authorName={authorName}
        authorAvatarUrl={authorAvatarUrl}
        publishedAt={publishedAt}
        tags={tags}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* TOC Sidebar */}
          <div className="lg:col-span-1">
            <TocCardV2 items={tocItems} />
          </div>

          {/* Article Content */}
          <div className="lg:col-span-3">
            {/* Key Takeaways */}
            <KeyTakeawaysV2 takeaways={keyTakeaways} />

            {/* Main Content */}
            <ProseV2>
              {contentHtml ? (
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Sadržaj nije dostupan.</p>
                </div>
              )}
            </ProseV2>
          </div>
        </div>
      </div>
    </div>
  );
}
