'use client';

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Archive
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AdminRoute } from '@/components/AdminRoute'
import { BlogForm } from '@/components/BlogForm'
import { GlossaryForm } from '@/components/GlossaryForm'
import { ContentList } from '@/components/ContentList'
import { useAuth } from '@/contexts/AuthContext'
import { FormDirtyProvider } from '@/contexts/FormDirtyContext'
import { UnsavedChangesModal } from '@/components/UnsavedChangesModal'
import { useProtectedAction } from '@/hooks/useProtectedAction'
import { downloadBackup, getBackupStats } from '@/lib/backup'
import { toast } from 'sonner'

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
  const { user, session, isAdmin } = useAuth()
  const { executeProtectedAction } = useProtectedAction()
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
  })
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('blog')
  const [backupLoading, setBackupLoading] = useState(false)
  const [expandedView, setExpandedView] = useState<'form' | 'lists' | 'both'>('both')
  const [formExpanded, setFormExpanded] = useState(false)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    setLoading(true)
    try {
      // Fetch blog stats
      const { data: blogs } = await supabase
        .from('blogs')
        .select('id, published, created_at, title')

      // Fetch glossary stats
      const { data: glossary } = await supabase
        .from('glossary')
        .select('id, published, created_at, term')

      // Calculate stats
      const totalBlogs = blogs?.length || 0
      const publishedBlogs = blogs?.filter(b => b.published).length || 0
      const draftBlogs = totalBlogs - publishedBlogs

      const totalGlossaryTerms = glossary?.length || 0
      const publishedTerms = glossary?.filter(g => g.published).length || 0
      const draftTerms = totalGlossaryTerms - publishedTerms

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
      .slice(0, 5)

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
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setExpandedView('both') // Reset to both view when changing tabs
    setFormExpanded(false) // Reset form expansion when changing tabs
  }

  const handleNewBlog = () => {
    setEditMode(false)
    setEditingItem(null)
    setActiveTab('blog')
    setExpandedView('form')
    setFormExpanded(true) // Automatically expand form when creating new blog
  }

  const handleNewGlossary = () => {
    setActiveTab('glossary')
    setExpandedView('form')
  }

  const handleEditItem = (item: any) => {
    setEditingItem(item)
    setEditMode(true)
    setExpandedView('form')
    setFormExpanded(true) // Automatically expand form when editing
  }

  const handleEditSuccess = () => {
    setEditMode(false)
    setEditingItem(null)
    fetchDashboardStats()
    setExpandedView('both')
    setFormExpanded(false) // Reset form expansion after successful edit
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setEditingItem(null)
    setExpandedView('both')
    setFormExpanded(false) // Reset form expansion when canceling edit
  }

  const handleBackup = async () => {
    setBackupLoading(true)
    try {
      await downloadBackup()
      toast.success('Backup uspešno preuzet!')
    } catch (error) {
      console.error('Backup error:', error)
      toast.error('Greška pri kreiranju backup-a')
    } finally {
      setBackupLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText className="h-4 w-4" />
      case 'glossary':
        return <BookOpen className="h-4 w-4" />
      case 'reservation':
        return <Users className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Objavljeno</Badge>
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Skica</Badge>
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Na čekanju</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Upravljajte sadržajem i pratite statistike</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button 
                  onClick={handleNewBlog}
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">+ Blog</span>
                  <span className="sm:hidden">Blog</span>
                </Button>
                <Button 
                  onClick={handleNewGlossary}
                  variant="outline"
                  size="sm"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">+ Rečnik</span>
                  <span className="sm:hidden">Rečnik</span>
                </Button>
                <Button 
                  onClick={handleBackup}
                  disabled={backupLoading}
                  variant="outline"
                  size="sm"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  {backupLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-green-600 mr-1 sm:mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-1 sm:mr-2" />
                  )}
                  <span className="hidden sm:inline">Backup</span>
                </Button>
                <Button 
                  onClick={fetchDashboardStats}
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <Activity className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Osveži</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Ukupno Blogova</CardTitle>
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalBlogs}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {dashboardStats.publishedBlogs} objavljeno
                  </div>
                  <div className="flex items-center text-sm text-yellow-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {dashboardStats.draftBlogs} skica
                  </div>
                  {/* Archive functionality temporarily disabled */}
                  {/* {dashboardStats.archivedBlogs > 0 && (
                    <div className="flex items-center text-sm text-red-600">
                      <Archive className="h-4 w-4 mr-1" />
                      {dashboardStats.archivedBlogs} arhiviran
                    </div>
                  )} */}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Termini Rečnika</CardTitle>
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalGlossaryTerms}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {dashboardStats.publishedTerms} objavljeno
                  </div>
                  <div className="flex items-center text-sm text-yellow-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {dashboardStats.draftTerms} skica
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Ukupno Sadržaja</CardTitle>
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardStats.totalBlogs + dashboardStats.totalGlossaryTerms}
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <Target className="h-4 w-4 mr-1" />
                  Blogovi + Termini
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity - Collapsible */}
          <Card className="border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-600" />
                  Nedavna Aktivnost
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedView(expandedView === 'both' ? 'lists' : 'both')}
                >
                  {expandedView === 'both' ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
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
                  {dashboardStats.recentActivity.slice(0, 3).map((activity) => (
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

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white border-2 border-blue-200 rounded-xl shadow-sm">
              <TabsTrigger value="blog" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg">
                <FileText className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Blogovi</span>
                <span className="sm:hidden">Blog</span>
              </TabsTrigger>
              <TabsTrigger value="glossary" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Rečnik</span>
                <span className="sm:hidden">Rec</span>
              </TabsTrigger>
            </TabsList>

            {/* Blog Management */}
            <TabsContent value="blog" className="space-y-6">
              <div className={`grid gap-6 ${
                expandedView === 'form' ? 'grid-cols-1' : 
                expandedView === 'lists' ? 'grid-cols-1' : 
                formExpanded ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'
              }`}>
                {/* Blog Creation/Edit */}
                {(expandedView === 'form' || expandedView === 'both') && (
                  <div className={formExpanded ? 'col-span-1 lg:col-span-3' : expandedView === 'both' ? 'lg:col-span-2' : 'col-span-1'}>
                    <Card className="border-0 shadow-lg h-full">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            {editMode ? (
                              <Edit className="h-5 w-5 mr-2 text-blue-600" />
                            ) : (
                              <Plus className="h-5 w-5 mr-2 text-blue-600" />
                            )}
                            {editMode ? 'Uredi Blog' : 'Kreiraj Novi Blog'}
                            {formExpanded && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Prošireno
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {editMode && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                                className="text-gray-600"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Otkaži
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormExpanded(!formExpanded)}
                              title={formExpanded ? "Smanji prozor" : "Proširi prozor"}
                            >
                              {formExpanded ? (
                                <Minimize2 className="h-4 w-4" />
                              ) : (
                                <Maximize2 className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedView(expandedView === 'form' ? 'both' : 'form')}
                            >
                              {expandedView === 'form' ? (
                                <Minimize2 className="h-4 w-4" />
                              ) : (
                                <Maximize2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </CardTitle>
                        <CardDescription>
                          {editMode ? 'Uredite postojeći blog post' : 'Dodajte novi članak u blog sekciju'}
                          {formExpanded && (
                            <span className="block mt-1 text-xs text-blue-600">
                              💡 Prošireni prostor za pisanje - možete da smanjite kada završite
                            </span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-full">
                        {editMode && editingItem ? (
                          <BlogForm 
                            onSuccess={handleEditSuccess}
                            onCancel={handleCancelEdit}
                            initialData={editingItem}
                          />
                        ) : (
                          <BlogForm onSuccess={fetchDashboardStats} />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Blog Lists */}
                {(expandedView === 'lists' || expandedView === 'both') && (
                  <div className={expandedView === 'both' ? 'space-y-6' : 'col-span-1'}>
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Eye className="h-5 w-5 mr-2 text-green-600" />
                            Objavljeni Blogovi
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedView(expandedView === 'lists' ? 'both' : 'lists')}
                          >
                            {expandedView === 'lists' ? (
                              <Minimize2 className="h-4 w-4" />
                            ) : (
                              <Maximize2 className="h-4 w-4" />
                            )}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ContentList 
                          type="blogs" 
                          filterPublished={true}
                          onEditItem={handleEditItem}
                        />
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                            Skice Blogova
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedView(expandedView === 'lists' ? 'both' : 'lists')}
                          >
                            {expandedView === 'lists' ? (
                              <Minimize2 className="h-4 w-4" />
                            ) : (
                              <Maximize2 className="h-4 w-4" />
                            )}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ContentList 
                          type="blogs" 
                          filterPublished={false}
                          onEditItem={handleEditItem}
                        />
                      </CardContent>
                    </Card>

                    {/* Archive functionality temporarily disabled */}
                    {/* <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Archive className="h-5 w-5 mr-2 text-red-600" />
                            Arhiva Blogova
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedView(expandedView === 'lists' ? 'both' : 'lists')}
                          >
                            {expandedView === 'lists' ? (
                              <Minimize2 className="h-4 w-4" />
                            ) : (
                              <Maximize2 className="h-4 w-4" />
                            )}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="overflow-y-auto max-h-[calc(100vh-300px)]">
                        <ContentList 
                          type="blogs" 
                          showArchived={true}
                          onEditItem={handleEditItem}
                        />
                      </CardContent>
                    </Card> */}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Glossary Management */}
            <TabsContent value="glossary" className="space-y-6">
              <div className={`grid gap-6 ${
                expandedView === 'form' ? 'grid-cols-1' : 
                expandedView === 'lists' ? 'grid-cols-1' : 
                'grid-cols-1 lg:grid-cols-3'
              }`}>
                {/* Glossary Creation */}
                {(expandedView === 'form' || expandedView === 'both') && (
                  <div className={expandedView === 'both' ? 'lg:col-span-2' : 'col-span-1'}>
                    <Card className="border-0 shadow-lg h-full">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Plus className="h-5 w-5 mr-2 text-purple-600" />
                            Dodaj Novi Termin
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedView(expandedView === 'form' ? 'both' : 'form')}
                          >
                            {expandedView === 'form' ? (
                              <Minimize2 className="h-4 w-4" />
                            ) : (
                              <Maximize2 className="h-4 w-4" />
                            )}
                          </Button>
                        </CardTitle>
                        <CardDescription>
                          Dodajte novi termin u rečnik
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-full">
                        <GlossaryForm />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Glossary Lists */}
                {(expandedView === 'lists' || expandedView === 'both') && (
                  <div className={expandedView === 'both' ? 'space-y-6' : 'col-span-1'}>
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                            Objavljeni Termini
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedView(expandedView === 'lists' ? 'both' : 'lists')}
                          >
                            {expandedView === 'lists' ? (
                              <Minimize2 className="h-4 w-4" />
                            ) : (
                              <Maximize2 className="h-4 w-4" />
                            )}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ContentList type="glossary" filterPublished={true} />
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                            Skice Termina
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedView(expandedView === 'lists' ? 'both' : 'lists')}
                          >
                            {expandedView === 'lists' ? (
                              <Minimize2 className="h-4 w-4" />
                            ) : (
                              <Maximize2 className="h-4 w-4" />
                            )}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ContentList type="glossary" filterPublished={false} />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <UnsavedChangesModal />
      </div>
    </AdminRoute>
  )
} 