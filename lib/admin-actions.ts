'use server'

import { supabase } from './supabase'
import { revalidatePath } from 'next/cache'

// Create a service client for server-side operations
const supabaseAdmin = supabase;

export async function getAdminProfileServer(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching admin profile:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

export async function updateAdminProfileServer(userId: string, updates: {
  first_name?: string
  last_name?: string
  other_name?: string
  phone?: string
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from('admins')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating admin profile:', error)
      return { data: null, error: error.message }
    }

    revalidatePath('/dashboard/settings')
    return { data, error: null }
  } catch (error) {
    console.error('Error updating admin profile:', error)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

export async function deleteAdminAccountServer(userId: string) {
  try {
    // Delete from admins table first
    const { error: profileError } = await supabaseAdmin
      .from('admins')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Error deleting admin profile:', profileError)
      return { data: null, error: profileError.message }
    }

    // Delete the auth user
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (error) {
      console.error('Error deleting admin user:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error deleting admin account:', error)
    return { data: null, error: 'An unexpected error occurred' }
  }
}
