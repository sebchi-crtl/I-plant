'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  LayoutDashboard, 
  Coins, 
  AlertCircle, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  TrendingUp,
  Users,
  UserPlus,
  TrendingDown,
  FileText,
  Search,
  ChevronDown,
  MoreVertical,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const Dashboard = () => {
  const users = [
    { name: 'John Okafor', email: 'john.okafor@email.com', region: 'Enugu', tokens: 10, device: 'Infinix HOT 10' },
    { name: 'Grace Paul', email: 'grace.paul@email.com', region: 'Edo', tokens: 0, device: 'Samsung Galaxy S9' },
    { name: 'Chinedu Nwosu', email: 'chinedu.nwosu@email.com', region: 'Abia', tokens: 2, device: 'OPPO A57' },
    { name: 'Blessing Uche', email: 'blessing.uche@email.com', region: 'Delta', tokens: 7, device: 'Huawei Y7' },
    { name: 'Emmanuel Oladele', email: 'emma.oladele@email.com', region: 'Oyo', tokens: 12, device: 'Samsung A12' },
  ]

  return (
    <div className="flex h-screen w-full max-md:mb-40">

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="py-8 px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          {/* Summary Cards */}
          <div className="flex flex-col md:flex-row gap-12 mb-8 w-full">
            {/* Trending Diseases */}
            <Card className="bg-green-900 text-white w-full basis-[45vw]">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-medium">Trending Diseases</CardTitle>
                    <p className="text-xs text-green-300">Top 3 trending diseases reported!</p>
                  </div>
                  <TrendingUp className="h-4 w-4 text-red-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">34</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                    <span className='flex gap-3'><div className='h-4 w-4 bg-[#73E2A7] rounded' />Bacterial Diseases</span>
                      <span>48%</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className='flex gap-3'><div className='h-4 w-4 bg-[#1C7C54] rounded' /> Nematode Crop Diseases</span>
                      <span>26%</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className='flex gap-3'><div className='h-4 w-4 bg-[#DEF4C6] rounded' />Fungal Crop Diseases</span>
                      <span>22%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-6 lg:gap-12 w-full basis-[55vw]">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 w-full">
                {/* Total Users */}
                <Card className="bg-[#B1CF5F] text-neutral-900 shadow-none w-full border-0 rounded-3xl relative basis-1/2">
                  {/* <CardHeader className="">
                    <CardTitle className="text-xl font-bold text-neutral-900">Total Users</CardTitle>
                  </CardHeader> */}
                  <CardContent>
                    <CardTitle className="text-xl font-semibold text-neutral-900 pb-2">Total Users</CardTitle>
                    <div className="flex items-center justify-between">
                      <div className="text-7xl font-semibold text-gray-900">145</div>
                      <Users className="h-10 lg:h-16 w-10 lg:w-16 bg-[#131416] rounded-full p-3 border-3 border-[#B1CF5F] text-[#B1CF5F] outline-4 outline-white absolute -right-3 -top-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* New users per day */}
                <Card className="bg-[#7F7F7F] text-neutral-900 shadow-none w-full border-0 rounded-3xl relative basis-1/2">
                  {/* <CardHeader className="">
                    <CardTitle className="text-xl font-bold text-neutral-900">Total Users</CardTitle>
                  </CardHeader> */}
                  <CardContent>
                    <CardTitle className="text-xl font-semibold text-neutral-900 pb-2">New users per day</CardTitle>
                    <div className="flex items-center justify-between">
                      <div className="text-7xl font-semibold text-gray-900">8</div>
                      <UserPlus className="h-10 lg:h-16 w-10 lg:w-16 bg-[#131416] rounded-full p-3 border-3 border-[#7F7F7F] text-[#7F7F7F] outline-4 outline-white absolute -right-3 -top-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 w-full">
                {/* Rate of returning users */}
                <Card className="bg-[#DEF4C6] text-neutral-900 shadow-none w-full border-0 rounded-3xl relative basis-1/2">
                  {/* <CardHeader className="">
                    <CardTitle className="text-xl font-bold text-neutral-900">Total Users</CardTitle>
                  </CardHeader> */}
                  <CardContent>
                    <CardTitle className="text-xl font-semibold text-neutral-900 pb-2">Rate of returning 
                    users</CardTitle>
                    <div className="flex items-center justify-between">
                      <div className="text-7xl font-semibold text-gray-900">5%</div>
                      <TrendingDown className="h-10 lg:h-16 w-10 lg:w-16 bg-[#131416] rounded-full p-3 border-3 border-[#DEF4C6] text-[#DEF4C6] outline-4 outline-white absolute -right-3 -top-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Total Incidents */}
                <Card className="bg-[#73E2A7] text-neutral-900 shadow-none w-full border-0 rounded-3xl relative basis-1/2">
                  {/* <CardHeader className="">
                    <CardTitle className="text-xl font-bold text-neutral-900">Total Users</CardTitle>
                  </CardHeader> */}
                  <CardContent>
                    <CardTitle className="text-xl font-semibold text-neutral-900 pb-2">Total Incidents</CardTitle>
                    <div className="flex items-center justify-between">
                      <div className="text-7xl font-semibold text-gray-900">3,456</div>
                      <FileText className="h-10 lg:h-16 w-10 lg:w-16 bg-[#131416] rounded-full p-3 border-3 border-[#73E2A7] text-[#73E2A7] outline-4 outline-white absolute -right-3 -top-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default Dashboard
