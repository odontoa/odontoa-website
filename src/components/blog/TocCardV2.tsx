'use client';

import { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TocCardV2Props {
  items: TocItem[];
}

export default function TocCardV2({ items }: TocCardV2Props) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const headings = items.map(item => document.getElementById(item.id)).filter(Boolean);
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading) {
          const rect = heading.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveId(items[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-20 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sadržaj</h3>
      <nav className="space-y-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block text-sm transition-colors duration-200 ${
              item.level === 2
                ? 'pl-0 font-medium'
                : 'pl-4 text-gray-600'
            } ${
              activeId === item.id
                ? 'text-blue-600 border-l-2 border-blue-600 pl-3'
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </div>
  );
}

