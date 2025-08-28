"use client"

import React, { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  User, 
  Shield, 
  Bell, 
  Trash2, 
  Edit, 
  Mail, 
  Phone, 
  MapPin,
  Power,
  ChevronLeft,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useAuth } from '@/lib/auth-context'
import { changeAdminPassword } from '@/lib/admin-utils'
import { updateAdminProfileServer, deleteAdminAccountServer } from '@/lib/admin-actions'
import { AdminProfileUpdate, PasswordChangeInput } from '@/lib/schemas'
import { useRouter } from 'next/navigation'

const Settings = () => {
  const { admin, loading, refreshProfile, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Profile form state
  const [profileForm, setProfileForm] = useState<AdminProfileUpdate>({
    first_name: '',
    last_name: '',
    other_name: '',
    phone: ''
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState<PasswordChangeInput>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Initialize form with admin data
  useEffect(() => {
    if (admin) {
      setProfileForm({
        first_name: admin.first_name || '',
        last_name: admin.last_name || '',
        other_name: admin.other_name || '',
        phone: admin.phone || ''
      })
    }
  }, [admin])

  const handleProfileUpdate = async () => {
    if (!admin) return

    setIsLoading(true)
    setMessage(null)

    try {
      const { data, error } = await updateAdminProfileServer(admin.id, profileForm)
      
      if (error) {
        setMessage({ type: 'error', text: error })
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        await refreshProfile()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!admin) return

    setIsLoading(true)
    setMessage(null)

    try {
      const { data, error } = await changeAdminPassword(passwordForm.currentPassword, passwordForm.newPassword)
      
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to change password' })
      } else {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!admin) return

    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const { data, error } = await deleteAdminAccountServer(admin.id)
      
      if (error) {
        setMessage({ type: 'error', text: error })
      } else {
        setMessage({ type: 'success', text: 'Account deleted successfully!' })
        await signOut()
        router.push('/')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Not Authenticated</h2>
          <p className="text-gray-600">Please log in to access settings.</p>
        </div>
      </div>
    )
  }

  const fullName = [admin.first_name, admin.last_name, admin.other_name]
    .filter(Boolean)
    .join(' ') || 'Admin User'

  return (
    <div className='mx-4 px-4 lg:px-6 py-6'>
      {/* Message Display */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {message.text}
        </div>
      )}

      {/* Main Settings Card */}
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="p-0">
          <div className="flex">
            {/* Left Sidebar Navigation */}
            <div className="w-64 border-r border-gray-200 bg-green-50/50">
              <div className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 bg-transparent h-auto">
                    <TabsTrigger 
                      value="profile" 
                      className="justify-start gap-3 h-12 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:border-l-4 data-[state=active]:border-green-500"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="justify-start gap-3 h-12 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:border-l-4 data-[state=active]:border-green-500"
                    >
                      <Shield className="h-4 w-4" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="justify-start gap-3 h-12 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:border-l-4 data-[state=active]:border-green-500"
                    >
                      <Bell className="h-4 w-4" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="delete" 
                      className="justify-start gap-3 h-12 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:border-l-4 data-[state=active]:border-green-500"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                
                {/* My Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                  {/* Profile Summary Section */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center">
                        <User className="h-12 w-12 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{fullName}</h2>
                        <p className="text-gray-600 mb-1">Administrator</p>
                        <p className="text-gray-500 text-sm underline cursor-pointer">{admin.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit pix
                    </Button>
                  </div>

                  <Separator />

                  {/* Personal Information Section */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                      <Button 
                        onClick={handleProfileUpdate}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={profileForm.first_name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, first_name: e.target.value }))}
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={profileForm.last_name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, last_name: e.target.value }))}
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="otherName" className="text-sm font-medium text-gray-700">Other Name</Label>
                        <Input 
                          id="otherName" 
                          value={profileForm.other_name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, other_name: e.target.value }))}
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="phone" 
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="bg-gray-50 border-gray-200"
                          />
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="email" 
                            value={admin.email}
                            className="bg-gray-50 border-gray-200"
                            readOnly
                          />
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Change Password</CardTitle>
                          <CardDescription>Update your password to keep your account secure</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input 
                              id="currentPassword" 
                              type="password"
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input 
                              id="newPassword" 
                              type="password"
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input 
                              id="confirmPassword" 
                              type="password"
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                          </div>
                          <Button 
                            onClick={handlePasswordChange}
                            disabled={isLoading || passwordForm.newPassword !== passwordForm.confirmPassword}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : null}
                            Update Password
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Email Notifications</CardTitle>
                          <CardDescription>Manage your email notification preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Transaction Alerts</p>
                              <p className="text-sm text-gray-500">Get notified about new transactions</p>
                            </div>
                            <Button variant="outline" size="sm">Enabled</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">System Updates</p>
                              <p className="text-sm text-gray-500">Receive updates about system maintenance</p>
                            </div>
                            <Button variant="outline" size="sm">Enabled</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Delete Account Tab */}
                <TabsContent value="delete" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Account</h3>
                    <Card className="border-red-200">
                      <CardHeader>
                        <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
                        <CardDescription>Once you delete your account, there is no going back. Please be certain.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          variant="destructive" 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={handleDeleteAccount}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Delete Account
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings