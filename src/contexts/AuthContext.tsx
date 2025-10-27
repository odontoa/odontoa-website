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
    
    // Add timeout to prevent infinite loading - increased to 10s for better reliability
    const timeoutId = setTimeout(() => {
      console.log('🔐 AuthContext: Timeout reached, setting loading to false')
      setLoading(false)
    }, 10000)
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('🔐 AuthContext: Initial session response:', { session: !!session, error })
      clearTimeout(timeoutId)
      
      if (error) {
        console.error('🔐 AuthContext: Session error:', error)
        setLoading(false)
        return
      }
      
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        console.log('🔐 AuthContext: User found, checking admin status...')
        checkAdminUser(session.user.id)
      } else {
        console.log('🔐 AuthContext: No user found')
        setLoading(false)
      }
    }).catch((error) => {
      console.error('🔐 AuthContext: Error getting session:', error)
      clearTimeout(timeoutId)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 AuthContext: Auth state change:', event, session)
      
      // Clear timeout when auth state changes
      clearTimeout(timeoutId)
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        console.log('🔐 AuthContext: User in auth change, checking admin status...')
        await checkAdminUser(session.user.id)
        // setLoading(false) is called in checkAdminUser after completion
      } else {
        console.log('🔐 AuthContext: No user in auth change')
        setAdminUser(null)
        setLoading(false)
      }
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

      console.log('🔐 AuthContext: Admin check result:', { data: !!data, error: error?.message })

      if (error) {
        if (error.code === 'PGRST116') {
          // No admin user found - this is normal for non-admin users
          console.log('🔐 AuthContext: No admin user found for this user ID')
          setAdminUser(null)
        } else {
          console.error('🔐 AuthContext: Error checking admin user:', error)
          setAdminUser(null)
        }
      } else {
        setAdminUser(data)
        console.log('🔐 AuthContext: Admin user found and set:', data.email)
      }
      
      // Always set loading to false after admin check completes
      setLoading(false)
      console.log('🔐 AuthContext: Loading set to false after admin check')
    } catch (error) {
      console.error('🔐 AuthContext: Exception in admin check:', error)
      setAdminUser(null)
      setLoading(false)
      console.log('🔐 AuthContext: Loading set to false after exception in admin check')
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