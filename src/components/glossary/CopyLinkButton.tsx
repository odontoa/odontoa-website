'use client';

import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface CopyLinkButtonProps {
  url: string;
}

/* Stil (.recnik-copy) je u src/app/recnik/recnik.css, uz ostatak rečnika. */
export default function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link kopiran u clipboard!');
    } catch (error) {
      toast.error('Greška pri kopiranju linka');
    }
  };

  return (
    <button type="button" onClick={handleCopy} className="recnik-copy" aria-label="Kopiraj link">
      <Copy size={13} aria-hidden />
      Kopiraj link
    </button>
  );
}
