'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  TrendingUp,
  Users,
  UserPlus,
  TrendingDown,
  FileText,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Dashboard = () => {
  const users = [
    { id: 1, name: 'John Okafor', email: 'john.okafor@email.com', region: 'Enugu', tokens: 10, device: 'Infinix HOT 10' },
    { id: 10, name: 'Grace Paul', email: 'grace.paul@email.com', region: 'Edo', tokens: 0, device: 'Samsung Galaxy S9' },
    { id: 20, name: 'Chinedu Nwosu', email: 'chinedu.nwosu@email.com', region: 'Abia', tokens: 2, device: 'OPPO A57' },
    { id: 30, name: 'Blessing Uche', email: 'blessing.uche@email.com', region: 'Delta', tokens: 7, device: 'Huawei Y7' },
    { id: 40, name: 'Emmanuel Oladele', email: 'emma.oladele@email.com', region: 'Oyo', tokens: 12, device: 'Samsung A12' },
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
                    <CardTitle className="text-2xl font-semibold">Trending Diseases</CardTitle>
                    <p className="text-sm text-gray-400">Top 3 trending diseases reported!</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-red-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="mb-4">
                  </div>
                  <div className="flex justify-center items-center mt-5 mb-4 relative">
                    <svg viewBox="0 0 36 36" className="w-32 h-32">
                      <path
                        className="stroke-[#A4EDBA]"
                        strokeWidth="3.6"
                        fill="none"
                        strokeDasharray={`${48} ${100 - 48}`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="stroke-[#0F7C5B]"
                        strokeWidth="3.6"
                        fill="none"

                        strokeDasharray={`${30} ${100 - 30}`}
                        strokeDashoffset={-48}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="stroke-[#DDEFC6]"
                        strokeWidth="3.6"
                        fill="none"
                        strokeDasharray={`${22} ${100 - 22}`}
                        strokeDashoffset={-(48 + 30)}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-3xl font-bold">34</span>
                  </div>
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

          <Card className='shadow-none border-0 bg-[#161616] text-green-100 mt-12'>
            <CardHeader className='-mb-2'>
              <CardTitle className='text-2xl font-semibold text-green-300'>Users</CardTitle>
              <CardDescription>
                <p>
                  <span className='text-green-100'>145</span> users have been added to the system.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className=' text-green-100! '>
                  <TableRow className=' text-green-100! '>
                    <TableHead className="w-[100px] text-green-100! ">Name</TableHead>
                    <TableHead className='text-centerc text-green-100! '>Email</TableHead>
                    <TableHead className='text-center text-green-100! '>Region</TableHead>
                    <TableHead className="text-center text-green-100! ">Tokens</TableHead>
                    <TableHead className="text-center text-green-100! ">Linked Devices</TableHead>
                    <TableHead className="text-center text-green-100! ">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-center">{user.email}</TableCell>
                      <TableCell className="text-center">{user.region}</TableCell>
                      <TableCell className="text-center">{user.tokens}</TableCell>
                      <TableCell className="text-center">{user.device}</TableCell>
                      <TableCell className="text-center">{user.tokens}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className='bg-neutral-950'>
                  <TableRow>
                    <TableCell colSpan={5}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
