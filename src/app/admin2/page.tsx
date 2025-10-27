'use client';

import React from 'react';
import { AdminRoute } from '@/components/AdminRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Zap } from 'lucide-react';

// TODO: integracija Strapi CMS za blog i glossary sadržaj

export default function Admin2Page() {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://cms.odontoa.com';

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="relative shadow-lg border-0 bg-white">
            {/* Beta Badge */}
            <div className="absolute -top-2 -right-2">
              <Badge 
                variant="secondary" 
                className="bg-orange-500 text-white px-3 py-1 text-xs font-semibold shadow-md"
              >
                BETA
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Beta Strapi CMS
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Klikni ovde za pristup
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center">
              <p className="text-sm text-gray-500 mb-6">
                Trenutno testiramo Strapi CMS kao moguću zamenu za postojeći admin panel. 
                Sadržaj bloga i rečnika će preći u Strapi kad potvrđeno da sve radi kako treba.
              </p>
              
              <Button 
                asChild
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <a 
                  href={strapiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Pristupi Strapi CMS-u
                </a>
              </Button>
              
              <div className="mt-4 text-xs text-gray-400">
                URL: {strapiUrl}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminRoute>
  );
}
