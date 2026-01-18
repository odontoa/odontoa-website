'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  FileText,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Clock,
  CheckCircle
} from 'lucide-react';
// Supabase removed - admin panel needs Sanity migration
// import { supabase } from '@/lib/supabase';
import { AdminRoute } from '@/components/AdminRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CalendarItem {
  id: string;
  type: 'blog' | 'glossary';
  title: string;
  status: 'published' | 'draft';
  created_at: string;
  published_at?: string;
}

interface CalendarData {
  [date: string]: CalendarItem[];
}

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      // Supabase removed - calendar disabled
      console.warn('Calendar: Supabase removed. This component needs Sanity migration.')
      toast.error('Kalendar je privremeno onemogućen. Migracija na Sanity je u toku.')
      setCalendarData({});
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      toast.error('Greška pri učitavanju kalendara');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getItemsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return calendarData[dateString] || [];
  };

  const getItemIcon = (type: string) => {
    return type === 'blog' ? FileText : BookOpen;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 text-xs">Objavljeno</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Skica</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">{status}</Badge>;
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

  const monthNames = [
    'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
    'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
  ];

  const dayNames = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'];

  const days = getDaysInMonth(currentDate);
  const selectedDateItems = selectedDate ? calendarData[selectedDate] || [] : [];

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kalendar</h1>
            <p className="text-gray-600 mt-1">Pregled sadržaja po datumu</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => router.push('/admin-panel/create-blog')}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novi Blog
            </Button>
            <Button
              onClick={() => router.push('/admin-panel/create-glossary')}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novi Termin
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Danas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(35)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {dayNames.map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {days.map((day, index) => {
                        if (!day) {
                          return <div key={index} className="h-20"></div>;
                        }
                        
                        const items = getItemsForDate(day);
                        const isToday = day.toDateString() === new Date().toDateString();
                        const isSelected = selectedDate === day.toISOString().split('T')[0];
                        
                        return (
                          <div
                            key={index}
                            className={`h-20 p-1 border rounded-lg cursor-pointer transition-colors ${
                              isToday 
                                ? 'bg-blue-50 border-blue-200' 
                                : isSelected 
                                  ? 'bg-gray-100 border-gray-300' 
                                  : 'border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedDate(day.toISOString().split('T')[0])}
                          >
                            <div className={`text-sm font-medium mb-1 ${
                              isToday ? 'text-blue-600' : 'text-gray-900'
                            }`}>
                              {day.getDate()}
                            </div>
                            <div className="space-y-1">
                              {items.slice(0, 2).map((item, itemIndex) => {
                                const Icon = getItemIcon(item.type);
                                return (
                                  <div key={itemIndex} className="flex items-center space-x-1">
                                    <Icon className="h-3 w-3 text-gray-500" />
                                    <div className="text-xs text-gray-600 truncate">
                                      {item.title.length > 8 ? `${item.title.substring(0, 8)}...` : item.title}
                                    </div>
                                  </div>
                                );
                              })}
                              {items.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{items.length - 2} više
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Selected Date Details */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-green-600" />
                  {selectedDate ? `Sadržaj za ${new Date(selectedDate).toLocaleDateString('sr-RS')}` : 'Izaberite datum'}
                </CardTitle>
                <CardDescription>
                  {selectedDate ? 'Pregled sadržaja za izabrani datum' : 'Kliknite na datum u kalendaru da vidite sadržaj'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  selectedDateItems.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateItems.map((item) => {
                        const Icon = getItemIcon(item.type);
                        return (
                          <div key={item.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Icon className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-900">
                                  {item.title}
                                </span>
                              </div>
                              {getStatusBadge(item.status)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(item.created_at)}
                            </div>
                            <div className="mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin-panel/${item.type === 'blog' ? 'create-blog' : 'create-glossary'}`)}
                                className="w-full"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Pregledaj
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Nema sadržaja za ovaj datum</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Izaberite datum da vidite sadržaj</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
