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
import { IoCheckmarkDone } from "react-icons/io5";
import Image from 'next/image'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TokenPage = () => {
  // Chart data
  const chartData = [
    { date: 'Jun 24', revenue: 25000 },
    { date: 'Jun 29', revenue: 35000 },
    { date: 'Jul 5', revenue: 28000 },
    { date: 'Jul 10', revenue: 38200 },
    { date: 'Jul 15', revenue: 22000 },
    { date: 'Jul 20', revenue: 25000 },
    { date: 'Jul 25', revenue: 30000 },
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-green-600 text-white p-2 rounded text-xs">
          <p className="font-medium">{label}</p>
          <p className="font-medium">₦{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Token</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-[#B1CF5F] p-10 rounded-2xl">
        {/* Total Tokens Sold */}
        <Card className="bg-green-900 border-0 shadow-none relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className='flex flex-col gap-6'>
                <p className="text-[1.2rem] font-semibold text-white/80 mb-1 tracking-[.1em] ">Total Tokens Sold</p>
                <p className="text-4xl font-bold text-white">2,300</p>
              </div>
              <div className="flex items-center space-x-2  overflow-hidden ">
                <Image className='w-36 h-36 absolute top-9 right-5' src="/dashboard/leaf.svg" alt="Leaf" width={32} height={32} />
                
              </div>
              <div className="rounded-full p-2 bg-green-100 absolute -bottom-6 -right-3">
                <IoCheckmarkDone  className=" h-15 w-15 text-green-900" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Token Users */}
        <Card className="bg-green-900 border-0 shadow-none relative ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className='flex flex-col gap-6'>
                <p className="text-[1.2rem] font-semibold text-white/80 mb-1 tracking-[.1em] ">Active Token User</p>
                <p className="text-4xl font-bold text-white">105</p>
              </div>
              <div className="flex items-center space-x-2  overflow-hidden ">
                <Image className='w-36 h-36 absolute top-9 right-5' src="/dashboard/leaf.svg" alt="Leaf" width={32} height={32} />
              </div>
              <div className="rounded-full p-2 bg-green-100 absolute -bottom-6 -right-3">
                <Users  className=" h-15 w-15 text-green-900" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="bg-green-900 border-0 shadow-none relative ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className='flex flex-col gap-6'>
                <p className="text-[1.2rem] font-semibold text-white/80 mb-1 tracking-[.1em] ">Total Revenue</p>
                <p className="text-3xl font-bold text-white">₦ 54,010.23</p>
              </div>
              <div className="flex items-center space-x-2  overflow-hidden ">
                <Image className='w-36 h-36 absolute top-9 right-5' src="/dashboard/leaf.svg" alt="Leaf" width={32} height={32} />
              </div>
              <div className="rounded-full p-2 bg-green-100 absolute -bottom-6 -right-3">
                <DollarSign  className=" h-15 w-15 text-green-900" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Timeline */}
      <Card className="mb-8 bg-[#1B512D] ">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-white">Revenue Timeline</CardTitle>
            <div className="flex space-x-2 border border-green-200 rounded-xl py-1 px-3 ">
              <Button 
                // variant="outline" 
                size="sm"
                className=" text-gray-300 bg-transparent hover:bg-gray-800"
              >
                24h
              </Button>
              <Button 
                // variant="outline" 
                size="sm"
                className=" text-gray-300 bg-transparent hover:bg-gray-800"
              >
                Week
              </Button>
              <Button 
                variant="default" 
                size="sm"
                className="bg-green-200 hover:bg-green-300 text-green-900"
              >
                Month
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative bg-[#1B512D] rounded-lg p-4 w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" stroke="#ffffff" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#ffffff" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#ffffff" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₦${value.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  fill="url(#colorRevenue)" 
                  dot={{ fill: 'white', stroke: '#22c55e', strokeWidth: 2, r: 3 }}
                  activeDot={{ fill: 'white', stroke: '#22c55e', strokeWidth: 2, r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Token Ranking */}
        <Card className="bg-[#131416] lg:col-span-2 border-0">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-green-300">Token Ranking</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-lg border-2 bg-linear-to-t from-[#DEF4C6] via-[#131416] to-[#131416] text-[#B1CF5F] border-[#B1CF5F]">
                    Sort by: <span className='text-[#dbf594] font-bold'>Default</span>
                    <ChevronDown className="h-6 w-6 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-white hover:bg-gray-700">Default</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700">Name</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700">Email</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700">Badge</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                                 <thead>
                   <tr className="border-b border-gray-700 ">
                     <th className="text-left py-3 px-4 text-green-200 font-medium">No.</th>
                     <th className="text-left py-3 px-4 text-green-200 font-medium">Name</th>
                     <th className="text-left py-3 px-4 text-green-200 font-medium">Email</th>
                     <th className="text-left py-3 px-4 text-green-200 font-medium">Device</th>
                     <th className="text-left py-3 px-4 text-green-200 font-medium">Badge</th>
                     <th className="text-left py-3 px-4 text-green-200 font-medium">Discount</th>
                   </tr>
                 </thead>
                 <tbody className=' font-semibold'>
                   <tr className="border-b border-gray-700">
                     <td className="py-3 px-4 text-green-400 font-medium">1</td>
                     <td className="py-3 px-4 text-green-200">John Okafor</td>
                     <td className="py-3 px-4 text-green-200 underline">john.okafor@email.com</td>
                     <td className="py-3 px-4 text-green-200">Infinix HOT 10</td>
                     <td className="py-3 px-4 text-green-200">Gold</td>
                     <td className="py-3 px-4 text-green-200">20%</td>
                   </tr>
                   <tr className="border-b border-gray-700">
                     <td className="py-3 px-4 text-green-400 font-medium">2</td>
                     <td className="py-3 px-4 text-green-200">Grace Paul</td>
                     <td className="py-3 px-4 text-green-200 underline">grace.paul@email.com</td>
                     <td className="py-3 px-4 text-green-200">Samsung Galaxy S9</td>
                     <td className="py-3 px-4 text-green-200">Silver</td>
                     <td className="py-3 px-4 text-green-200">15%</td>
                   </tr>
                   <tr className="border-b border-gray-700">
                     <td className="py-3 px-4 text-green-400 font-medium">3</td>
                     <td className="py-3 px-4 text-green-200">Chinedu Nwosu</td>
                     <td className="py-3 px-4 text-green-200 underline">chinedu.nwosu@email.com</td>
                     <td className="py-3 px-4 text-green-200">OPPO A57</td>
                     <td className="py-3 px-4 text-green-200">Bronze</td>
                     <td className="py-3 px-4 text-green-200">10%</td>
                   </tr>
                 </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Ranking System */}
        <Card className="bg-gray-900 border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-200 text-center ">Ranking System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-green-300 rounded-xl px-4 py-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-900">Bronze</span>
                <span className="text-green-900 font-medium">0-99 points → 0% bonus</span>
              </div>
            </div>
            <div className="bg-green-300 rounded-xl px-4 py-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-900">Silver</span>
                <span className="text-green-900 font-medium">0-99 points → 0% bonus</span>
              </div>
            </div>
            <div className="bg-green-300 rounded-xl px-4 py-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-900">Gold</span>
                <span className="text-green-900 font-medium">0-99 points → 0% bonus</span>
              </div>
            </div>
            <div className="bg-green-300 rounded-xl px-4 py-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-900">Platinum</span>
                <span className="text-green-900 font-medium">0-99 points → 0% bonus</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TokenPage 