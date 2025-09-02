'use client';

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AdminLogin } from '@/components/AdminLogin'
import { Loader2 } from 'lucide-react'

interface AdminRouteProps {
  children: React.ReactNode
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { loading, isAdmin } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    // If loading takes too long, show login form as fallback
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('🔄 AdminRoute: Loading timeout, showing login form')
        setShowLogin(true)
      }
    }, 3000)

    return () => clearTimeout(timeoutId)
  }, [loading])

  if (loading && !showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Učitavanje admin panela...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin || showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <AdminLogin />
      </div>
    )
  }

  return <>{children}</>
} 