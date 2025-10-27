'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlossaryForm } from '@/components/GlossaryForm';
import { AdminRoute } from '@/components/AdminRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreateGlossaryPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to dashboard after successful creation
    router.push('/admin-panel/dashboard');
  };

  const handleCancel = () => {
    // Redirect back to dashboard
    router.push('/admin-panel/dashboard');
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
              <h1 className="text-3xl font-bold text-gray-900">Dodaj Novi Termin</h1>
              <p className="text-gray-600 mt-1">Dodajte novi termin u rečnik</p>
            </div>
          </div>
        </div>

        {/* Glossary Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
              Forma za kreiranje rečničkog termina
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GlossaryForm 
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
