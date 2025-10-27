'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  BookOpen, 
  Users, 
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  BarChart3,
  Target,
  Award,
  Calendar,
  Plus,
  RefreshCw,
  Image
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';
import { AdminRoute } from '@/components/AdminRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DashboardStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  archivedBlogs: number;
  totalGlossaryTerms: number;
  publishedTerms: number;
  draftTerms: number;
  totalReservations: number;
  recentActivity: Array<{
    id: string;
    type: 'blog' | 'glossary' | 'reservation';
    title: string;
    status: 'published' | 'draft' | 'pending';
    created_at: string;
  }>;
}

interface ChartData {
  date: string;
  blogs: number;
  glossary: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    archivedBlogs: 0,
    totalGlossaryTerms: 0,
    publishedTerms: 0,
    draftTerms: 0,
    totalReservations: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchChartData();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch blog stats
      const { data: blogs } = await supabase
        .from('blogs')
        .select('id, published, created_at, title');

      // Fetch glossary stats
      const { data: glossary } = await supabase
        .from('glossary')
        .select('id, published, created_at, term');

      // Calculate stats
      const totalBlogs = blogs?.length || 0;
      const publishedBlogs = blogs?.filter(b => b.published).length || 0;
      const draftBlogs = totalBlogs - publishedBlogs;

      const totalGlossaryTerms = glossary?.length || 0;
      const publishedTerms = glossary?.filter(g => g.published).length || 0;
      const draftTerms = totalGlossaryTerms - publishedTerms;

      // Recent activity
      const allActivity = [
        ...(blogs || []).map(b => ({
          id: b.id,
          type: 'blog' as const,
          title: b.title,
          status: b.published ? 'published' as const : 'draft' as const,
          created_at: b.created_at
        })),
        ...(glossary || []).map(g => ({
          id: g.id,
          type: 'glossary' as const,
          title: g.term,
          status: g.published ? 'published' as const : 'draft' as const,
          created_at: g.created_at
        }))
      ]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

      setDashboardStats({
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        archivedBlogs: 0, // Archive functionality temporarily disabled
        totalGlossaryTerms,
        publishedTerms,
        draftTerms,
        totalReservations: 0, // TODO: Add reservations
        recentActivity: allActivity
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Greška pri učitavanju statistika');
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      // Get data for last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // Fetch blogs data
      const { data: blogs } = await supabase
        .from('blogs')
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString())
        .order('created_at', { ascending: true });

      // Fetch glossary data
      const { data: glossary } = await supabase
        .from('glossary')
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString())
        .order('created_at', { ascending: true });

      // Group data by month
      const monthlyData: { [key: string]: { blogs: number; glossary: number } } = {};

      // Initialize all months with 0
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
        monthlyData[monthKey] = { blogs: 0, glossary: 0 };
      }

      // Count blogs by month
      blogs?.forEach(blog => {
        const monthKey = blog.created_at.slice(0, 7);
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].blogs++;
        }
      });

      // Count glossary terms by month
      glossary?.forEach(term => {
        const monthKey = term.created_at.slice(0, 7);
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].glossary++;
        }
      });

      // Convert to chart data format
      const chartDataArray = Object.entries(monthlyData).map(([date, counts]) => ({
        date: new Date(date + '-01').toLocaleDateString('sr-RS', { 
          month: 'short', 
          year: 'numeric' 
        }),
        blogs: counts.blogs,
        glossary: counts.glossary
      }));

      setChartData(chartDataArray);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText className="h-4 w-4" />;
      case 'glossary':
        return <BookOpen className="h-4 w-4" />;
      case 'reservation':
        return <Users className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Objavljeno</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Skica</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Na čekanju</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const statCards = [
    {
      title: 'Ukupno Blogova',
      value: dashboardStats.totalBlogs,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      details: [
        { label: 'Objavljeno', value: dashboardStats.publishedBlogs, color: 'text-green-600', icon: CheckCircle },
        { label: 'Skica', value: dashboardStats.draftBlogs, color: 'text-yellow-600', icon: Clock }
      ]
    },
    {
      title: 'Termini Recnika',
      value: dashboardStats.totalGlossaryTerms,
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      details: [
        { label: 'Objavljeno', value: dashboardStats.publishedTerms, color: 'text-green-600', icon: CheckCircle },
        { label: 'Skica', value: dashboardStats.draftTerms, color: 'text-yellow-600', icon: Clock }
      ]
    },
    {
      title: 'Ukupno Sadržaja',
      value: dashboardStats.totalBlogs + dashboardStats.totalGlossaryTerms,
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      details: [
        { label: 'Blogovi + Termini', value: '', color: 'text-gray-600', icon: Target }
      ]
    },
    {
      title: 'Nedavna Aktivnost',
      value: dashboardStats.recentActivity.length,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      details: [
        { label: 'Poslednjih 5 stavki', value: '', color: 'text-gray-600', icon: TrendingUp }
      ]
    }
  ];

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kontrolna tabla</h1>
            <p className="text-gray-600 mt-1">Pregled statistika i nedavne aktivnosti</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={fetchDashboardStats}
              variant="outline"
              size="sm"
              disabled={loading}
              className="text-gray-700 hover:text-gray-900"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Osvezi
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-3">{card.value}</div>
                  <div className="space-y-2">
                    {card.details.map((detail, detailIndex) => {
                      const DetailIcon = detail.icon;
                      return (
                        <div key={detailIndex} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <DetailIcon className={`h-4 w-4 ${detail.color}`} />
                            <span className="text-gray-600">{detail.label}</span>
                          </div>
                          {detail.value && (
                            <span className={`font-medium ${detail.color}`}>{detail.value}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Activity Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Aktivnost sadržaja
            </CardTitle>
            <CardDescription>
              Broj objavljenih blogova i recnickih termina po mesecima (poslednjih 6 meseci)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#666"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#666"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="blogs" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      name="Blogovi"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="glossary" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      name="Recnicki termini"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Nema dovoljno podataka</p>
                <p className="text-sm">Nema dovoljno podataka za prikaz statistike</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Nedavna Aktivnost
            </CardTitle>
            <CardDescription>
              Poslednje promene u sistemu
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : dashboardStats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {dashboardStats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nema nedavne aktivnosti</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              Brze Akcije
            </CardTitle>
            <CardDescription>
              Često korišćene funkcionalnosti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push('/admin-panel/create-blog')}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-200"
              >
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium">Kreiraj Blog</span>
              </Button>
              <Button
                onClick={() => router.push('/admin-panel/create-glossary')}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-200"
              >
                <BookOpen className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium">Kreiraj Recnik</span>
              </Button>
              <Button
                onClick={() => router.push('/admin-panel/media')}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-200"
              >
                <Image className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium">Media</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
