'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  MapPin
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AnalysisPage = () => {
  // Bar chart data for diagnostics analysis
  const barData = [
    { day: '22', total: 35, incorrect: 25 },
    { day: '23', total: 48, incorrect: 33 },
    { day: '24', total: 42, incorrect: 28 },
    { day: '25', total: 38, incorrect: 22 },
    { day: '26', total: 45, incorrect: 30 },
    { day: '27', total: 55, incorrect: 38 },
    { day: '28', total: 50, incorrect: 35 },
    { day: '29', total: 40, incorrect: 25 },
    { day: '30', total: 45, incorrect: 32 },
  ];

  // Donut chart data for activities
  const pieData = [
    { name: 'Total Users', value: 14500, color: '#000000' },
    { name: 'Active Users', value: 11500, color: '#6B7280' },
    { name: 'Inactive Users', value: 3000, color: '#F3F4F6' },
  ];

  // Line chart data for token analysis
  const lineData = [
    { year: '2019', tokens: 25, revenue: 15000 },
    { year: '2020', tokens: 35, revenue: 22000 },
    { year: '2021', tokens: 45, revenue: 28000 },
    { year: '2022', tokens: 60, revenue: 32000 },
    { year: '2023', tokens: 70, revenue: 34800 },
    { year: '2024', tokens: 85, revenue: 42000 },
    { year: '2025', tokens: 95, revenue: 48000 },
  ];

  // Custom tooltip for line chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-green-500 text-white p-3 rounded-lg text-sm">
          <p className="font-bold">{label}</p>
          <p>Total token sold: {payload[0]?.value}k</p>
          <p>Token Revenue: ₦{payload[1]?.value?.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className=" min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-8">Analysis Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Users */}
        <Card className="bg-green-800 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-white mb-2">145</p>
                <p className="text-white text-lg mb-2">Total Users</p>
                <div className="flex items-center text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+15.23%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-800" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Diagnostics Rate */}
        <Card className="bg-green-800 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-white mb-2">15%</p>
                <p className="text-white text-lg mb-2">Total Diagnostics Rate</p>
                <div className="flex items-center text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+2.68%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-800" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Regions */}
        <Card className="bg-green-800 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-white mb-2">28</p>
                <p className="text-white text-lg mb-2">Active Regions</p>
                <div className="flex items-center text-red-400">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm">-52.68%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-800" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section - Bar Chart and Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Diagnostics Analysis Bar Chart */}
        <Card className="bg-green-100 border-0">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-black text-xl font-bold">Diagnostics Analysis</CardTitle>
                <p className="text-black text-sm">Total number of diagnostic feedback 2.5k</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-black text-sm">Total Feedback</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-black text-sm">Incorrect Feedback</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-green-500 text-white hover:bg-green-600">
                      Daily
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Daily</DropdownMenuItem>
                    <DropdownMenuItem>Weekly</DropdownMenuItem>
                    <DropdownMenuItem>Monthly</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#000000" />
                <YAxis stroke="#000000" />
                <Tooltip />
                <Bar dataKey="total" fill="#000000" radius={[4, 4, 0, 0]} />
                <Bar dataKey="incorrect" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activities Venn Diagram */}
        <Card className="bg-[#9BCF0C] border-0">
          <CardHeader>
            <CardTitle className="text-black text-xl font-bold">Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex items-center justify-center h-80">
              {/* Venn Diagram Circles */}
              <div className="relative">
                {/* Black Circle (Total Users) - Largest */}
                <div className="absolute w-48 h-48 bg-black rounded-full flex items-center justify-center -top-32 -left-24">
                  <span className="text-white text-2xl font-bold">14.5k</span>
                </div>
                
                {/* Gray Circle (Active Users) - Medium */}
                <div className="absolute w-40 h-40 bg-gray-500 rounded-full border-4 border-[#9BCF0C] flex items-center justify-center -top-4 right-1">
                  <span className="text-white text-xl font-bold">11.5k</span>
                </div>
                
                {/* Light Green Circle (Inactive Users) - Smallest */}
                <div className="absolute w-32 h-32 bg-gray-100 rounded-full border-4 border-[#9BCF0C] flex items-center justify-center top-8 -left-8">
                  <span className="text-black text-lg font-bold">3k</span>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="bg-[#1B512D] rounded-lg p-4 mt-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-black rounded-full"></div>
                  <span className="text-white text-sm">Total Users</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                  <span className="text-white text-sm">Active Users</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gray-100 rounded-full"></div>
                  <span className="text-white text-sm">Inactive Users</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Token Analysis Line Chart */}
      <Card className="bg-green-100 border-0">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-black text-xl font-bold">Token Analysis</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-green-500 text-white hover:bg-green-600">
                  Sort by: Years
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Years</DropdownMenuItem>
                <DropdownMenuItem>Months</DropdownMenuItem>
                <DropdownMenuItem>Weeks</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="year" stroke="#000000" />
              <YAxis stroke="#000000" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="tokens" 
                stroke="#000000" 
                strokeWidth={2}
                fill="none"
                dot={{ fill: 'white', stroke: '#000000', strokeWidth: 2, r: 4 }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#22C55E" 
                strokeWidth={2}
                fill="url(#colorTokens)"
                dot={{ fill: 'white', stroke: '#22C55E', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: 'white', stroke: '#22C55E', strokeWidth: 2, r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalysisPage 