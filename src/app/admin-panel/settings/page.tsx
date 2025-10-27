'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminRoute } from '@/components/AdminRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import { Settings, ArrowLeft, User, Database, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();

  const settingsSections = [
    {
      title: 'Korisničke Postavke',
      description: 'Upravljajte svojim nalogom i profilom',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Baza Podataka',
      description: 'Rezervne kopije, migracije i održavanje baze podataka',
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Bezbednost',
      description: 'Postavke bezbednosti i pristupa',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Obaveštenja',
      description: 'Email obaveštenja i upozorenja',
      icon: Bell,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

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
              <h1 className="text-3xl font-bold text-gray-900">Postavke</h1>
              <p className="text-gray-600 mt-1">Upravljajte postavkama sistema</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className={`p-2 rounded-lg ${section.bgColor} mr-3`}>
                      <Icon className={`h-5 w-5 ${section.color}`} />
                    </div>
                    {section.title}
                  </CardTitle>
                  <CardDescription>
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <div className="text-gray-400 mb-4">
                      <Settings className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Ova sekcija je u razvoju
                    </p>
                    <Button variant="outline" disabled>
                      Uskoro dostupno
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Coming Soon Notice */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="text-center">
              <Settings className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Postavke u razvoju
              </h3>
              <p className="text-gray-600 mb-4">
                Radimo na implementaciji naprednih postavki za admin panel. 
                Ova funkcionalnost će biti dostupna u narednim verzijama.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>• Korisničke postavke</span>
                <span>• Rezervne kopije i migracije</span>
                <span>• Bezbednosne opcije</span>
                <span>• Email konfiguracija</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
