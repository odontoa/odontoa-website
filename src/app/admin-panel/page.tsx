'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminRoute } from '@/components/AdminRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { FormDirtyProvider } from '@/contexts/FormDirtyContext';
import { UnsavedChangesModal } from '@/components/UnsavedChangesModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Calendar,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  BarChart3,
  Activity,
  Target,
  Award,
  Edit,
  X,
  Download,
  Maximize2,
  Minimize2,
  Archive,
  LogOut,
  Image
} from 'lucide-react';
// Supabase removed - admin panel needs Sanity migration
// import { supabase } from '@/lib/supabase';
import { BlogForm } from '@/components/BlogForm';
import { GlossaryForm } from '@/components/GlossaryForm';
import { ContentList } from '@/components/ContentList';
import { useAuth } from '@/contexts/AuthContext';
import { useProtectedAction } from '@/hooks/useProtectedAction';
import { downloadBackup, getBackupStats } from '@/lib/backup';
import { toast } from 'sonner';
import { MediaManager } from '@/components/MediaManager';

interface DashboardStats {
  totalBlogs: number
  publishedBlogs: number
  draftBlogs: number
  archivedBlogs: number
  totalGlossaryTerms: number
  publishedTerms: number
  draftTerms: number
  totalReservations: number
  recentActivity: Array<{
    id: string
    type: 'blog' | 'glossary' | 'reservation'
    title: string
    status: 'published' | 'draft' | 'pending'
    created_at: string
  }>
}

export default function AdminPanel() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard by default
    router.push('/admin-panel/dashboard');
  }, [router]);

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preusmjeravanje na dashboard...</p>
        </div>
      </div>
    </AdminRoute>
  );
}
