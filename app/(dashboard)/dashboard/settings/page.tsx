"use client"

import React, { useState } from 'react'
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
  Save
} from "lucide-react"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile")

  const profileData = {
    firstName: "Ebuka",
    lastName: "Onyeka", 
    otherName: "Chibuzor",
    email: "example@gmail.com",
    phone: "+234 901 234 5566",
    bio: "Project Management",
    role: "Project Management",
    fullName: "Onyeka Ebuka Chibuzor"
  }

  return (
    <div className='mx-4 px-4 lg:px-6 py-6'>
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{profileData.fullName}</h2>
                        <p className="text-gray-600 mb-1">{profileData.role}</p>
                        <p className="text-gray-500 text-sm underline cursor-pointer">{profileData.email}</p>
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
                      <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={profileData.firstName}
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={profileData.lastName}
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="otherName" className="text-sm font-medium text-gray-700">Other Name</Label>
                        <Input 
                          id="otherName" 
                          value={profileData.otherName}
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="phone" 
                            value={profileData.phone}
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
                            value={profileData.email}
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
                            <Input id="currentPassword" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" />
                          </div>
                          <Button className="bg-green-600 hover:bg-green-700">Update Password</Button>
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
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                          <Trash2 className="h-4 w-4 mr-2" />
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