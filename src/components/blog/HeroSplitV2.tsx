import Image from 'next/image';

interface HeroSplitV2Props {
  title: string;
  description: string;
  coverImageUrl: string | null;
  authorName: string | null;
  authorAvatarUrl: string | null;
  publishedAt: string;
  tags?: string[];
}

export default function HeroSplitV2({
  title,
  description,
  coverImageUrl,
  authorName,
  authorAvatarUrl,
  publishedAt,
  tags = [],
}: HeroSplitV2Props) {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600/20 text-blue-300 border border-blue-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {title}
            </h1>

            {/* Description */}
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
              {description}
            </p>

            {/* Author Info */}
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex items-center space-x-3">
                {authorAvatarUrl ? (
                  <Image
                    src={authorAvatarUrl}
                    alt={authorName || 'Author'}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-300 font-medium text-lg">
                      {(authorName || 'O').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-gray-300 font-medium">
                    {authorName || 'Odontoa tim'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Poslednja izmena: {publishedAt}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            {coverImageUrl ? (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={coverImageUrl}
                  alt={title}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            ) : (
              <div className="w-full h-80 bg-gray-700 rounded-2xl flex items-center justify-center">
                <span className="text-gray-400 text-lg">Nema slike</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

