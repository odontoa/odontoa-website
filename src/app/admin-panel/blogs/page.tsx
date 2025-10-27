'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentList } from '@/components/ContentList';
import { AdminRoute } from '@/components/AdminRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { FileText, ArrowLeft, Plus, Eye, Clock } from 'lucide-react';

export default function BlogsPage() {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setEditMode(true);
    // Redirect to create-blog page with edit data
    router.push(`/admin-panel/create-blog?edit=${item.id}`);
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin-panel/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Nazad
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Blogovi</h1>
                <p className="text-gray-600 mt-1">Upravljajte svim blog postovima</p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/admin-panel/create-blog')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novi Blog
            </Button>
          </div>

          {/* Blog Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-green-600" />
                  Objavljeni Blogovi
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <ContentList 
                  type="blogs" 
                  filterPublished={true}
                  onEditItem={handleEditItem}
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                  Skice Blogova
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <ContentList 
                  type="blogs" 
                  filterPublished={false}
                  onEditItem={handleEditItem}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
