'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MediaManager } from '@/components/MediaManager';
import { AdminRoute } from '@/components/AdminRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { Image, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MediaPage() {
  const router = useRouter();

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
                <h1 className="text-3xl font-bold text-gray-900">Media</h1>
                <p className="text-gray-600 mt-1">Upravljajte slikama i fajlovima</p>
              </div>
            </div>
          </div>

          {/* Media Manager */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="h-5 w-5 mr-2 text-green-600" />
                Centralni Media Repozitorijum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MediaManager />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
