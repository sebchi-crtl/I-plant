import { z } from 'zod'

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const createUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().optional(),
})

// Admin profile schema matching the database
export const adminProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  other_name: z.string().nullable(),
  phone: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
})

// Admin profile update schema
export const adminProfileUpdateSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  other_name: z.string().optional(),
  phone: z.string().optional(),
})

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type AdminProfile = z.infer<typeof adminProfileSchema>
export type AdminProfileUpdate = z.infer<typeof adminProfileUpdateSchema>
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>

// Auth types (for backward compatibility)
export interface AuthAdmin {
  id: string
  email: string
}
