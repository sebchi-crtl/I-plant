'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { AdminProfile } from './schemas';
import { getAdminProfile } from './admin-utils';

interface AuthContextType {
  admin: AdminProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminProfile = async (supabaseUser: User) => {
    try {
      const { data, error } = await getAdminProfile(supabaseUser.id);
      if (error) {
        console.error('Error fetching admin profile:', error);
        // Fallback to basic auth user data
        setAdmin({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          first_name: null,
          last_name: null,
          other_name: null,
          phone: null,
          created_at: null,
          updated_at: null,
        });
      } else {
        setAdmin(data);
      }
    } catch (error) {
      console.error('Error in fetchAdminProfile:', error);
      // Fallback to basic auth user data
      setAdmin({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        first_name: null,
        last_name: null,
        other_name: null,
        phone: null,
        created_at: null,
        updated_at: null,
      });
    }
  };

  const refreshProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await fetchAdminProfile(user);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchAdminProfile(session.user);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchAdminProfile(session.user);
        } else {
          setAdmin(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
