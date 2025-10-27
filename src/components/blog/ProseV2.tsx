import { ReactNode } from 'react';

interface ProseV2Props {
  children: ReactNode;
  className?: string;
}

export default function ProseV2({ children, className = '' }: ProseV2Props) {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <style jsx global>{`
        .prose h2 {
          font-size: 1.75rem;
          line-height: 1.3;
          font-weight: 700;
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .prose h3 {
          font-size: 1.25rem;
          line-height: 1.4;
          font-weight: 600;
          color: #374151;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .prose p {
          font-size: 1.0625rem;
          line-height: 1.8;
          color: #4b5563;
          margin-bottom: 1.5rem;
        }
        
        .prose ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .prose ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .prose li {
          margin-bottom: 0.5rem;
          color: #4b5563;
        }
        
        .prose a {
          color: #0041C4;
          text-decoration: none;
          font-weight: 500;
        }
        
        .prose a:hover {
          text-decoration: underline;
        }
        
        .prose strong {
          font-weight: 600;
          color: #1f2937;
        }
        
        .prose blockquote {
          border-left: 4px solid #4a9489;
          padding-left: 1rem;
          margin: 2rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .prose code {
          background-color: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: #1f2937;
        }
        
        .prose pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .prose pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
        
        .prose img {
          border-radius: 0.5rem;
          margin: 2rem 0;
        }
        
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        .prose th,
        .prose td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
        }
        
        .prose th {
          background-color: #f9fafb;
          font-weight: 600;
        }
      `}</style>
      {children}
    </div>
  );
}
