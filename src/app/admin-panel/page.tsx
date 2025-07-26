'use client';

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlogForm } from '@/components/BlogForm'
import { GlossaryForm } from '@/components/GlossaryForm'
import { ContentList } from '@/components/ContentList'
import { LogOut, Plus, FileText, BookOpen, Download, Loader2, Eye, EyeOff, Edit } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminPanel() {
  const { signOut, adminUser } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [blogSubTab, setBlogSubTab] = useState('create')
  const [glossarySubTab, setGlossarySubTab] = useState('create')

  const handleSignOut = async () => {
    await signOut()
  }

  const handleBlogFormSuccess = () => {
    setBlogSubTab('published')
  }

  const handleGlossaryFormSuccess = () => {
    setGlossarySubTab('list')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/odontoa-logo1.png" 
                alt="Odontoa Logo" 
                className="h-8 w-auto mr-3"
              />
              <h1 className="text-xl font-bold text-blue-900">
                Odontoa Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-blue-700 font-medium">
                Dobrodošli, {adminUser?.email || 'ognjen.drinic31@gmail.com'}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Odjavi se
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-blue-200 rounded-lg shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Pregled</TabsTrigger>
            <TabsTrigger value="blogs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Blogovi</TabsTrigger>
            <TabsTrigger value="glossary" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Rečnik</TabsTrigger>
            <TabsTrigger value="backups" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">Rezerve</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dobrodošli u vaš CMS</h2>
              <p className="text-gray-600">Upravljajte vašim stomatološkim sadržajem lako i efikasno</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Upravljanje Blogovima
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Kreirajte i uređujte SEO-optimizovane blog postove
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Button 
                    onClick={() => setActiveTab('blogs')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj Novi Blog
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Upravljanje Rečnikom
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Dodajte stomatološke termine i definicije
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Button 
                    onClick={() => setActiveTab('glossary')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj Novi Termin
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="bg-white border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ukupno Blogova</p>
                      <p className="text-2xl font-bold text-blue-600">24</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ukupno Termina</p>
                      <p className="text-2xl font-bold text-green-600">156</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rezerve</p>
                      <p className="text-2xl font-bold text-orange-600">12</p>
                    </div>
                    <Download className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="blogs" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Upravljanje Blogovima</h2>
              <p className="text-gray-600">Kreirajte i uređujte blog postove za vašu stomatološku ordinaciju</p>
            </div>

            <Tabs value={blogSubTab} onValueChange={setBlogSubTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white border-2 border-blue-200 rounded-lg shadow-sm">
                <TabsTrigger value="create" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Kreiraj Novi</TabsTrigger>
                <TabsTrigger value="published" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Objavljeni</TabsTrigger>
                <TabsTrigger value="drafts" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Skice</TabsTrigger>
              </TabsList>

              <TabsContent value="create">
                <BlogForm onSuccess={handleBlogFormSuccess} />
              </TabsContent>

              <TabsContent value="published">
                <ContentList type="blogs" status="published" />
              </TabsContent>

              <TabsContent value="drafts">
                <ContentList type="blogs" status="drafts" />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="glossary" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Upravljanje Rečnikom</h2>
              <p className="text-gray-600">Dodajte i uređujte stomatološke termine i definicije</p>
            </div>

            <Tabs value={glossarySubTab} onValueChange={setGlossarySubTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-white border-2 border-green-200 rounded-lg shadow-sm">
                <TabsTrigger value="create" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Dodaj Termin</TabsTrigger>
                <TabsTrigger value="list" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Lista Termina</TabsTrigger>
              </TabsList>

              <TabsContent value="create">
                <GlossaryForm onSuccess={handleGlossaryFormSuccess} />
              </TabsContent>

              <TabsContent value="list">
                <ContentList type="glossary" />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="backups" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Upravljanje Rezervama</h2>
              <p className="text-gray-600">Kreirajte i preuzmite rezerve vašeg sadržaja</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Kreiraj Rezervu
                  </CardTitle>
                  <CardDescription>
                    Kreirajte rezervu svog sadržaja za sigurnost
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Kreiraj Rezervu
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Pregled Rezervi
                  </CardTitle>
                  <CardDescription>
                    Pregledajte postojeće rezerve
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-50">
                    <Eye className="h-4 w-4 mr-2" />
                    Pregledaj Rezerve
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
} 