'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentList } from '@/components/ContentList';
import { AdminRoute } from '@/components/AdminRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { BookOpen, ArrowLeft, Plus, Eye, Clock } from 'lucide-react';

export default function GlossaryPage() {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setEditMode(true);
    // Redirect to create-glossary page with edit data
    router.push(`/admin-panel/create-glossary?edit=${item.id}`);
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
                <h1 className="text-3xl font-bold text-gray-900">Rečnici</h1>
                <p className="text-gray-600 mt-1">Upravljajte svim rečničkim terminima</p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/admin-panel/create-glossary')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novi Termin
            </Button>
          </div>

          {/* Glossary Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-green-600" />
                  Objavljeni Termini
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <ContentList 
                  type="glossary" 
                  filterPublished={true}
                  onEditItem={handleEditItem}
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                  Skice Termina
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <ContentList 
                  type="glossary" 
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
