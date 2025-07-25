import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { AdminRoute } from '@/components/AdminRoute'
import ScrollToTop from '@/components/ScrollToTop'

import Index from "@/pages/Index";
import BlogPage from "@/pages/BlogPage";
import BlogSinglePage from "@/pages/BlogSinglePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import RecnikSinglePage from "@/pages/RecnikSinglePage";
import AdminPanel from "@/pages/AdminPanel";
import NotFound from "@/pages/NotFound";
import LLMSPage from "@/pages/LLMSPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blogovi" element={<BlogPage />} />
              <Route path="/blogovi/:slug" element={<BlogSinglePage />} />
              <Route path="/recnik/:slug" element={<RecnikSinglePage />} />
              <Route path="/o-nama" element={<AboutPage />} />
              <Route path="/kontakt" element={<ContactPage />} />
              <Route path="/llms.txt" element={<LLMSPage />} />
              <Route 
                path="/admin-panel" 
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <SonnerToaster />
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
