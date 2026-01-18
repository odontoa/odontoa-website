'use client';

import React, { createContext, useContext, useState } from 'react'
// Supabase removed - AuthContext stub (no-auth mode)

interface User {
  id: string
  email?: string
}

interface Session {
  user: User | null
}

interface AdminUser {
  id: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  adminUser: AdminUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Stub: no auth (Supabase removed)
  const [user] = useState<User | null>(null)
  const [adminUser] = useState<AdminUser | null>(null)
  const [session] = useState<Session | null>(null)
  const [loading] = useState(false)

  // Stub functions (Supabase removed)
  const signIn = async (email: string, password: string) => {
    console.warn('Auth: Supabase removed. Sign in disabled.')
    return { error: { message: 'Authentication disabled. Supabase removed.' } }
  }

  const signOut = async () => {
    console.warn('Auth: Supabase removed. Sign out disabled.')
  }

  const isAdmin = !!(adminUser && adminUser.role === 'admin')

  const value: AuthContextType = {
    user,
    adminUser,
    session,
    loading,
    signIn,
    signOut,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 