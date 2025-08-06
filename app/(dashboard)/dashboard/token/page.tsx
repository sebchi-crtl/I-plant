'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  Check,
  Users,
  DollarSign,
  ChevronDown,
  Star,
  Diamond,
  Crown,
  Leaf
} from 'lucide-react'

const TokenPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Token</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Tokens Sold */}
        <Card className="bg-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Tokens Sold</p>
                <p className="text-3xl font-bold text-gray-900">2,300</p>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <Check className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Token Users */}
        <Card className="bg-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Token Users</p>
                <p className="text-3xl font-bold text-gray-900">105</p>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="bg-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₦ 54,010.23</p>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Timeline */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Revenue Timeline</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">24h</Button>
              <Button variant="outline" size="sm">Week</Button>
              <Button variant="default" size="sm">Month</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Revenue Chart</p>
              <p className="text-sm text-gray-400">Y-axis: ₦0 - ₦50,000</p>
              <p className="text-sm text-gray-400">X-axis: Jun 24 - Jul 25</p>
              <p className="text-sm text-green-600 font-medium mt-2">Jul 10: ₦ 38,200</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create New Token Package */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Create New Token Package</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
              <Input placeholder="Input Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Select Amount</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem>₦ 5,000</DropdownMenuItem>
                  <DropdownMenuItem>₦ 10,000</DropdownMenuItem>
                  <DropdownMenuItem>₦ 20,000</DropdownMenuItem>
                  <DropdownMenuItem>₦ 40,000</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Create
            </Button>
          </CardContent>
        </Card>

        {/* Token Package */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Token Package</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Star className="h-6 w-6 text-yellow-500" />
                <span className="font-medium">Pro</span>
              </div>
              <span className="font-semibold text-green-600">₦ 10,000 NGN</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Diamond className="h-6 w-6 text-blue-500" />
                <span className="font-medium">Premium</span>
              </div>
              <span className="font-semibold text-green-600">₦ 20,000 NGN</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Crown className="h-6 w-6 text-purple-500" />
                <span className="font-medium">Platinum</span>
              </div>
              <span className="font-semibold text-green-600">₦ 40,000 NGN</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TokenPage 