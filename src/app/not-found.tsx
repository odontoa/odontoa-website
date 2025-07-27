'use client';

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-6">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-[#4a9489] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Stranica nije pronađena
          </h2>
          <p className="text-[#a1a1aa] mb-8">
            Stranica koju tražite ne postoji ili je premeštena. 
            Proverite URL adresu ili se vratite na početnu stranicu.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-[#4a9489] text-white hover:bg-[#3d7a71] px-6 py-3">
              <Home className="h-4 w-4 mr-2" />
              Početna stranica
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-[#4a9489] text-[#4a9489] hover:bg-[#4a9489] hover:text-white px-6 py-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nazad
          </Button>
        </div>
      </div>
    </div>
  )
} 