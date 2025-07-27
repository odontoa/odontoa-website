'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {children}
          <Toaster />
          <SonnerToaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
} 