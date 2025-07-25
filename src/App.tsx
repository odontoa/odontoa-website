import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "@/pages/Index";
import BlogPage from "@/pages/BlogPage";
import BlogSinglePage from "@/pages/BlogSinglePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import RecnikPage from "@/pages/RecnikPage";
import RecnikSinglePage from "@/pages/RecnikSinglePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blogovi" element={<BlogPage />} />
            <Route path="/blogovi/:id" element={<BlogSinglePage />} />
            <Route path="/recnik" element={<RecnikPage />} />
            <Route path="/recnik/:slug" element={<RecnikSinglePage />} />
            <Route path="/o-nama" element={<AboutPage />} />
            <Route path="/kontakt" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
