'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Preusmeri na početnu stranicu sa anchor linkom na CTA sekciju
    router.push('/#demo');
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Preusmeravam vas na demo sekciju...</p>
      </div>
    </div>
  );
}
