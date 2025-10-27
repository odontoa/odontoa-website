'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Home, 
  FileText, 
  Eye,
  MessageCircle,
  Calendar,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

export default function AdminDemoPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy blog data na srpskom
  const blogPosts = [
    { id: 1, title: 'Kako pravilno čistiti zube - Kompletni vodič', views: 1247, comments: 23, status: 'published', date: '2024-01-15', author: 'Dr. Ognjen Drinić' },
    { id: 2, title: 'Najbolje tehnike za prevenciju karijesa', views: 892, comments: 15, status: 'published', date: '2024-01-14', author: 'Dr. Bojan Antović' },
    { id: 3, title: 'Ortodontski tretmani - Kada je potrebno', views: 1563, comments: 31, status: 'published', date: '2024-01-13', author: 'Dr. Petar Kovačević' },
    { id: 4, title: 'Implantologija - Sve što treba da znate', views: 2103, comments: 42, status: 'published', date: '2024-01-12', author: 'Dr. Uroš Simeunović' },
    { id: 5, title: 'Parodontologija i zdravlje desni', views: 743, comments: 12, status: 'published', date: '2024-01-11', author: 'Dr. Ognjen Drinić' },
    { id: 6, title: 'Endodontski tretmani - Lečenje kanala korena', views: 1189, comments: 28, status: 'published', date: '2024-01-10', author: 'Dr. Bojan Antović' },
    { id: 7, title: 'Estetska stomatologija - Beljenje zuba', views: 1876, comments: 35, status: 'published', date: '2024-01-09', author: 'Dr. Petar Kovačević' },
    { id: 8, title: 'Oralna hirurgija - Vađenje umnjaka', views: 945, comments: 18, status: 'published', date: '2024-01-08', author: 'Dr. Uroš Simeunović' },
    { id: 9, title: 'Dečja stomatologija - Prva poseta zubaru', views: 1324, comments: 26, status: 'published', date: '2024-01-07', author: 'Dr. Ognjen Drinić' },
    { id: 10, title: 'Proteze i mostovi - Rešenja za nedostajuće zube', views: 678, comments: 14, status: 'published', date: '2024-01-06', author: 'Dr. Bojan Antović' },
    { id: 11, title: 'Digitalna stomatologija - Tehnologija budućnosti', views: 1456, comments: 29, status: 'published', date: '2024-01-05', author: 'Dr. Petar Kovačević' },
    { id: 12, title: 'Oralna higijena tokom trudnoće', views: 1123, comments: 22, status: 'published', date: '2024-01-04', author: 'Dr. Uroš Simeunović' },
    { id: 13, title: 'Bruksizam - Škrgutanje zubima tokom sna', views: 987, comments: 19, status: 'published', date: '2024-01-03', author: 'Dr. Ognjen Drinić' },
    { id: 14, title: 'Halitoza - Kako rešiti problem lošeg zadaha', views: 1345, comments: 33, status: 'published', date: '2024-01-02', author: 'Dr. Bojan Antović' },
    { id: 15, title: 'Stomatološki materijali - Koji su najbolji', views: 756, comments: 16, status: 'published', date: '2024-01-01', author: 'Dr. Petar Kovačević' },
    { id: 16, title: 'Prevencija oralnih infekcija', views: 1089, comments: 24, status: 'published', date: '2023-12-31', author: 'Dr. Uroš Simeunović' },
    { id: 17, title: 'Stomatološki tretmani za starije osobe', views: 823, comments: 17, status: 'published', date: '2023-12-30', author: 'Dr. Ognjen Drinić' },
    { id: 18, title: 'Kada je potrebno vađenje zuba', views: 1456, comments: 31, status: 'published', date: '2023-12-29', author: 'Dr. Bojan Antović' },
    { id: 19, title: 'Oralna higijena kod dece', views: 1678, comments: 38, status: 'published', date: '2023-12-28', author: 'Dr. Petar Kovačević' },
    { id: 20, title: 'Stomatološki pregledi - Koliko često', views: 912, comments: 20, status: 'published', date: '2023-12-27', author: 'Dr. Uroš Simeunović' },
    { id: 21, title: 'Kako izabrati pravu četkicu za zube', views: 1234, comments: 27, status: 'published', date: '2023-12-26', author: 'Dr. Ognjen Drinić' },
    { id: 22, title: 'Fluor i njegova uloga u prevenciji karijesa', views: 789, comments: 15, status: 'published', date: '2023-12-25', author: 'Dr. Bojan Antović' },
    { id: 23, title: 'Stomatološke anksioznosti - Kako ih prevazići', views: 1567, comments: 41, status: 'published', date: '2023-12-24', author: 'Dr. Petar Kovačević' },
    { id: 24, title: 'Oralna higijena kod sportista', views: 634, comments: 13, status: 'published', date: '2023-12-23', author: 'Dr. Uroš Simeunović' },
    { id: 25, title: 'Stomatološki tretmani tokom praznika', views: 1456, comments: 29, status: 'published', date: '2023-12-22', author: 'Dr. Ognjen Drinić' },
    { id: 26, title: 'Kako održati belinu zuba', views: 1789, comments: 36, status: 'published', date: '2023-12-21', author: 'Dr. Bojan Antović' },
    { id: 27, title: 'Stomatološke proteze - Vrste i održavanje', views: 987, comments: 21, status: 'published', date: '2023-12-20', author: 'Dr. Petar Kovačević' },
    { id: 28, title: 'Oralna higijena kod dijabetičara', views: 1123, comments: 25, status: 'published', date: '2023-12-19', author: 'Dr. Uroš Simeunović' },
    { id: 29, title: 'Stomatološki tretmani za bebe', views: 1345, comments: 32, status: 'published', date: '2023-12-18', author: 'Dr. Ognjen Drinić' },
    { id: 30, title: 'Kako prepoznati probleme sa zubima', views: 1567, comments: 39, status: 'published', date: '2023-12-17', author: 'Dr. Bojan Antović' },
    { id: 31, title: 'Stomatološki tretmani za trudnice', views: 823, comments: 18, status: 'published', date: '2023-12-16', author: 'Dr. Petar Kovačević' },
    { id: 32, title: 'Oralna higijena kod pušača', views: 1456, comments: 30, status: 'published', date: '2023-12-15', author: 'Dr. Uroš Simeunović' },
    { id: 33, title: 'Stomatološki tretmani za alergičare', views: 678, comments: 14, status: 'published', date: '2023-12-14', author: 'Dr. Ognjen Drinić' },
    { id: 34, title: 'Kako održati zdravlje desni', views: 1234, comments: 26, status: 'published', date: '2023-12-13', author: 'Dr. Bojan Antović' },
    { id: 35, title: 'Stomatološki tretmani za vegetarijance', views: 567, comments: 12, status: 'published', date: '2023-12-12', author: 'Dr. Petar Kovačević' },
    { id: 36, title: 'Oralna higijena kod starijih osoba', views: 1456, comments: 31, status: 'published', date: '2023-12-11', author: 'Dr. Uroš Simeunović' },
    { id: 37, title: 'Stomatološki tretmani za studente', views: 789, comments: 16, status: 'published', date: '2023-12-10', author: 'Dr. Ognjen Drinić' },
    { id: 38, title: 'Kako izabrati pravu pastu za zube', views: 1678, comments: 37, status: 'published', date: '2023-12-09', author: 'Dr. Bojan Antović' },
    { id: 39, title: 'Stomatološki tretmani za radnike', views: 912, comments: 19, status: 'published', date: '2023-12-08', author: 'Dr. Petar Kovačević' },
    { id: 40, title: 'Oralna higijena kod putnika', views: 634, comments: 13, status: 'published', date: '2023-12-07', author: 'Dr. Uroš Simeunović' },
  ];

  const totalViews = blogPosts.reduce((sum, post) => sum + post.views, 0);
  const totalComments = blogPosts.reduce((sum, post) => sum + post.comments, 0);
  const publishedPosts = blogPosts.filter(post => post.status === 'published').length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">Odontoa</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className={`w-4 h-4 text-gray-600 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Search */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Pretraži blog postove..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="space-y-1">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
              <Home className="w-5 h-5" />
              {!sidebarCollapsed && <span className="font-medium">Dashboard</span>}
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <FileText className="w-5 h-5" />
              {!sidebarCollapsed && <span>Blog Postovi</span>}
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Edit className="w-5 h-5" />
              {!sidebarCollapsed && <span>Novi Post</span>}
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Users className="w-5 h-5" />
              {!sidebarCollapsed && <span>Korisnici</span>}
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <TrendingUp className="w-5 h-5" />
              {!sidebarCollapsed && <span>Analitika</span>}
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blog Dashboard</h1>
              <p className="text-gray-600 mt-1">Dobrodošli nazad, Admin 👋</p>
              <p className="text-sm text-gray-500">Upravljajte svojim blog sadržajem i pratiite performanse</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <Plus className="w-4 h-4" />
                <span>Novi Post</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ukupno Pregleda</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalViews.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Objavljeni Postovi</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{publishedPosts}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Komentari</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalComments}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Prosečno Pregleda</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{Math.round(totalViews / publishedPosts)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Blog Posts List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Svi Blog Postovi</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Ukupno: {blogPosts.length} postova</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naslov</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pregledi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Komentari</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogPosts.slice(0, 10).map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {post.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{post.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(post.date).toLocaleDateString('sr-RS')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Eye className="w-4 h-4 mr-1 text-gray-400" />
                          {post.views.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MessageCircle className="w-4 h-4 mr-1 text-gray-400" />
                          {post.comments}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Objavljen
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Prikazano 10 od {blogPosts.length} postova
                </p>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    Prethodna
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    Sledeća
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Posts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Najpopularniji Postovi</h3>
              <div className="space-y-4">
                {blogPosts
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((post, index) => (
                    <div key={post.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 max-w-xs truncate">{post.title}</p>
                          <p className="text-xs text-gray-500">{post.views.toLocaleString()} pregleda</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Najnoviji Postovi</h3>
              <div className="space-y-4">
                {blogPosts
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 max-w-xs truncate">{post.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.date).toLocaleDateString('sr-RS')} • {post.author}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString('sr-RS')}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
