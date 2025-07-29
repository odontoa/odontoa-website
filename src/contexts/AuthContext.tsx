'use client';

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, AdminUser } from '@/lib/supabase'

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
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔐 AuthContext: Initializing...')
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 AuthContext: Initial session:', session)
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        console.log('🔐 AuthContext: User found, checking admin status...')
        checkAdminUser(session.user.id)
      } else {
        console.log('🔐 AuthContext: No user found')
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 AuthContext: Auth state change:', event, session)
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        console.log('🔐 AuthContext: User in auth change, checking admin status...')
        await checkAdminUser(session.user.id)
      } else {
        console.log('🔐 AuthContext: No user in auth change')
        setAdminUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminUser = async (userId: string) => {
    try {
      console.log('🔐 AuthContext: Checking admin user for ID:', userId)
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .eq('role', 'admin')
        .single()

      console.log('🔐 AuthContext: Admin check result:', { data, error })

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin user:', error)
        return
      }

      setAdminUser(data || null)
      console.log('🔐 AuthContext: Admin user set to:', data)
    } catch (error) {
      console.error('Error checking admin user:', error)
      setAdminUser(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setAdminUser(null)
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