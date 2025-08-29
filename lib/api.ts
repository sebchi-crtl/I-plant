import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
import { 
  loginSchema, 
  createUserSchema, 
  adminProfileSchema,
  type LoginInput,
  type CreateUserInput,
} from './schemas'
import { toast } from 'sonner'

// Authentication API
export const authApi = {
  // Login mutation
  useLogin: () => {
    const queryClient = useQueryClient()
    
    return useMutation({
      mutationFn: async (data: LoginInput) => {
        const validatedData = loginSchema.parse(data)
        const { error } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        })
        if (error) throw error
        return { success: true }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin'] })
        toast.success('Login successful!')
      },
      onError: (error: any) => {
        console.error('Login error:', error);
        let errorMessage = 'Login failed';
        
        if (error.message) {
          // Handle specific Supabase auth errors
          if (error.message.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password. Please try again.';
          } else if (error.message.includes('Email not confirmed')) {
            errorMessage = 'Please confirm your email address before signing in.';
          } else if (error.message.includes('Too many requests')) {
            errorMessage = 'Too many login attempts. Please try again later.';
          } else {
            errorMessage = error.message;
          }
        }
        
        toast.error(errorMessage);
      },
    })
  },

  // Logout mutation
  useLogout: () => {
    const queryClient = useQueryClient()
    
    return useMutation({
      mutationFn: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return { success: true }
      },
      onSuccess: () => {
        queryClient.clear()
        toast.success('Logged out successfully')
      },
      onError: (error: any) => {
        toast.error('Error logging out')
      },
    })
  },

  // Get current admin profile
  useAdminProfile: () => {
    return useQuery({
      queryKey: ['admin', 'profile'],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No authenticated user')

        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        return adminProfileSchema.parse(data)
      },
      enabled: false, // Only fetch when explicitly called
    })
  },
}

// Admin management API (simplified - no creation/deletion)
export const adminApi = {
  // List all admins (read-only)
  useListAdmins: () => {
    return useQuery({
      queryKey: ['admins'],
      queryFn: async () => {
                 const { data, error } = await supabase
           .from('admins')
           .select('*')
           .order('created_at', { ascending: false })

        if (error) throw error
        return data.map(admin => adminProfileSchema.parse(admin))
      },
    })
  },
}

// =====================================================
// USER MANAGEMENT API FUNCTIONS
// =====================================================

// Fetch all users with their token balances, devices, diagnostics, and feedback
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users...');
      
      // Check if we're authenticated
      const { data: { user: authUser } } = await supabase.auth.getUser();
      console.log('Auth user:', authUser);
      
      if (!authUser) {
        console.error('No authenticated user');
        throw new Error('No authenticated user');
      }
      
      // Just fetch users table first
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*');

      console.log('Users query result:', { users, usersError });

      if (usersError) {
        console.error('Users query error:', usersError);
        throw usersError;
      }

      return users || [];
    },
  });
};

// Fetch user details with devices
export const useUserDetails = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          token_balances (*),
          devices (*)
        `)
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const { data: transactions, error: transError } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transError) throw transError;

      return {
        ...user,
        transactions
      };
    },
    enabled: !!userId,
  });
};

// Top up user tokens
export const useTopUpTokens = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, amount, reason }: { userId: string; amount: number; reason: string }) => {
      const { data, error } = await supabase.rpc('add_tokens', {
        p_user_id: userId,
        p_amount: amount,
        p_reason: reason
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Tokens added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add tokens');
    },
  });
};

// Update user profile
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, userData }: { userId: string; userData: any }) => {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user');
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
};

// Get device activation token
export const useGetDeviceToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, deviceInfo }: { userId: string; deviceInfo: any }) => {
      const { data, error } = await supabase
        .from('device_activation_requests')
        .insert({
          user_id: userId,
          new_device_info: deviceInfo,
          request_reason: 'Device change request',
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Device activation request created');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create device activation request');
    },
  });
};

// Fetch user transactions
export const useUserTransactions = (userId: string) => {
  return useQuery({
    queryKey: ['user-transactions', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};
