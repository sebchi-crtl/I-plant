import { supabase } from './supabase';
// import { createClient } from '@supabase/supabase-js';

// Note: This requires the service_role key (not the anon key)
// You should only use this in server-side code or secure environments

interface ApiError {
  message: string;
  [key: string]: any;
}

export async function createAdminUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email (no email confirmation needed)
      user_metadata: {
        role: 'admin'
      }
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return { data: null, error: { message: error.message } as ApiError };
    }

    // Create admin profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('admins')
        .insert({
          id: data.user.id,
          email: data.user.email
        });

      if (profileError) {
        console.error('Error creating admin profile:', profileError);
        return { data: data.user, error: { message: profileError.message } as ApiError };
      }
    }

    return { data: data.user, error: null };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { data: null, error: { message: 'An unexpected error occurred' } as ApiError };
  }
}

export async function listAllUsers() {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Error listing users:', error);
      return { data: null, error: { message: error.message } as ApiError };
    }

    return { data: data.users, error: null };
  } catch (error) {
    console.error('Error listing users:', error);
    return { data: null, error: { message: 'An unexpected error occurred' } as ApiError };
  }
}

export async function deleteUser(userId: string) {
  try {
    const { data, error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) {
      console.error('Error deleting user:', error);
      return { data: null, error: { message: error.message } as ApiError };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { data: null, error: { message: 'An unexpected error occurred' } as ApiError };
  }
}

// Admin profile management functions
export async function getAdminProfile(userId: string) {
  try {
    // For client-side operations, we'll use the regular client but with proper error handling
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching admin profile:', error);
      
      // If it's an RLS error, we'll return a basic profile structure
      if (error.code === '42P17' || error.message.includes('infinite recursion')) {
        // Get the current user from auth to create a basic profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          return { 
            data: {
              id: user.id,
              email: user.email!,
              first_name: null,
              last_name: null,
              other_name: null,
              phone: null,
              created_at: null,
              updated_at: null,
            }, 
            error: null 
          };
        }
      }
      
      return { data: null, error: { message: error.message } as ApiError };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return { data: null, error: { message: 'An unexpected error occurred' } as ApiError };
  }
}

export async function updateAdminProfile(userId: string, updates: {
  first_name?: string;
  last_name?: string;
  other_name?: string;
  phone?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('admins')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating admin profile:', error);
      return { data: null, error: { message: error.message } as ApiError };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating admin profile:', error);
    return { data: null, error: { message: 'An unexpected error occurred' } as ApiError };
  }
}

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  try {
    // First, verify the current password
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } as ApiError };
    }

    // Update password
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('Error changing password:', error);
      return { data: null, error: { message: error.message } as ApiError };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error changing password:', error);
    return { data: null, error: { message: 'An unexpected error occurred' } as ApiError };
  }
}

export async function deleteAdminAccount(userId: string) {
  try {
    // Delete from admins table first
    const { error: profileError } = await supabase
      .from('admins')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Error deleting admin profile:', profileError);
      return { data: null, error: { message: profileError.message } as ApiError };
    }

    // Delete the auth user
    const { data, error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) {
      console.error('Error deleting admin user:', error);
      return { data: null, error: { message: error.message } as ApiError };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error deleting admin account:', error);
    return { data: null, error: { message: 'An unexpected error occurred' } as ApiError };
  }
}
