'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  TrendingUp,
  Users,
  UserPlus,
  TrendingDown,
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  CreditCard,
  History,
  Smartphone,
  Eye
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useUsers, useTopUpTokens, useUpdateUser, useDeleteUser, useGetDeviceToken, useUserTransactions } from '@/lib/api'
import { toast } from 'sonner'

// Skeleton component for loading state
const UserTableSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    ))}
  </div>
);

// Top Up Tokens Dialog
const TopUpTokensDialog = ({ userId, userName, onSuccess }: { userId: string; userName: string; onSuccess: () => void }) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [open, setOpen] = useState(false);
  
  const topUpMutation = useTopUpTokens();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !reason) {
      toast.error('Please fill in all fields');
      return;
    }
    
    await topUpMutation.mutateAsync({
      userId,
      amount: parseInt(amount),
      reason
    });
    
    setOpen(false);
    setAmount('');
    setReason('');
    onSuccess();
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-green-300 hover:text-green-100">
          <CreditCard className="mr-2 h-4 w-4" />
          Top Up Tokens
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] border-[#333] text-green-100">
        <DialogHeader>
          <DialogTitle>Top Up Tokens for {userName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-green-100">Amount (tokens)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter token amount"
              min="1"
              className="bg-[#2a2a2a] border-[#444] text-green-100"
            />
          </div>
          <div>
            <Label htmlFor="reason" className="text-green-100">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for top up"
              className="bg-[#2a2a2a] border-[#444] text-green-100"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-green-600 text-green-300 hover:bg-green-900">
              Cancel
            </Button>
            <Button type="submit" disabled={topUpMutation.isPending} className="bg-green-600 hover:bg-green-700">
              {topUpMutation.isPending ? 'Adding...' : 'Add Tokens'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit User Dialog
const EditUserDialog = ({ user, onSuccess }: { user: any; onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || ''
  });
  const [open, setOpen] = useState(false);
  
  const updateMutation = useUpdateUser();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateMutation.mutateAsync({
      userId: user.id,
      userData: formData
    });
    
    setOpen(false);
    onSuccess();
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-green-300 hover:text-green-100">
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] border-[#333] text-green-100">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name" className="text-green-100">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="bg-[#2a2a2a] border-[#444] text-green-100"
              />
            </div>
            <div>
              <Label htmlFor="last_name" className="text-green-100">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="bg-[#2a2a2a] border-[#444] text-green-100"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="text-green-100">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-[#2a2a2a] border-[#444] text-green-100"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-green-100">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-[#2a2a2a] border-[#444] text-green-100"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-green-600 text-green-300 hover:bg-green-900">
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending} className="bg-green-600 hover:bg-green-700">
              {updateMutation.isPending ? 'Updating...' : 'Update User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Transaction History Dialog
const TransactionHistoryDialog = ({ userId, userName }: { userId: string; userName: string }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-green-300 hover:text-green-100">
          <History className="mr-2 h-4 w-4" />
          View Transaction History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-[#1a1a1a] border-[#333] text-green-100">
        <DialogHeader>
          <DialogTitle>Transaction History - {userName}</DialogTitle>
        </DialogHeader>
        <TransactionHistory userId={userId} />
      </DialogContent>
    </Dialog>
  );
};

// Transaction History Component
const TransactionHistory = ({ userId }: { userId: string }) => {
  const { data: transactions, isLoading, error } = useUserTransactions(userId);
  
  if (isLoading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;
  if (error) return <div className="text-red-500">Error loading transactions</div>;
  
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow className="border-[#333]">
            <TableHead className="text-green-100">Date</TableHead>
            <TableHead className="text-green-100">Type</TableHead>
            <TableHead className="text-green-100">Amount</TableHead>
            <TableHead className="text-green-100">Balance</TableHead>
            <TableHead className="text-green-100">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow key={transaction.id} className="border-[#333]">
              <TableCell className="text-green-100">{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={transaction.amount > 0 ? 'default' : 'destructive'} className="bg-green-600">
                  {transaction.transaction_type}
                </Badge>
              </TableCell>
              <TableCell className={transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount}
              </TableCell>
              <TableCell className="text-green-100">{transaction.balance_after}</TableCell>
              <TableCell className="text-green-100">{transaction.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Device Token Dialog
const DeviceTokenDialog = ({ userId, userName, onSuccess }: { userId: string; userName: string; onSuccess: () => void }) => {
  const [deviceInfo, setDeviceInfo] = useState({
    device_name: '',
    device_model: '',
    os_version: '',
    app_version: ''
  });
  const [open, setOpen] = useState(false);
  
  const deviceTokenMutation = useGetDeviceToken();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceInfo.device_name || !deviceInfo.device_model) {
      toast.error('Please fill in device name and model');
      return;
    }
    
    await deviceTokenMutation.mutateAsync({
      userId,
      deviceInfo
    });
    
    setOpen(false);
    setDeviceInfo({ device_name: '', device_model: '', os_version: '', app_version: '' });
    onSuccess();
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-green-300 hover:text-green-100">
          <Smartphone className="mr-2 h-4 w-4" />
          Get Device Token
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] border-[#333] text-green-100">
        <DialogHeader>
          <DialogTitle>Generate Device Token for {userName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="device_name" className="text-green-100">Device Name</Label>
            <Input
              id="device_name"
              value={deviceInfo.device_name}
              onChange={(e) => setDeviceInfo({ ...deviceInfo, device_name: e.target.value })}
              placeholder="e.g., iPhone 15"
              className="bg-[#2a2a2a] border-[#444] text-green-100"
            />
          </div>
          <div>
            <Label htmlFor="device_model" className="text-green-100">Device Model</Label>
            <Input
              id="device_model"
              value={deviceInfo.device_model}
              onChange={(e) => setDeviceInfo({ ...deviceInfo, device_model: e.target.value })}
              placeholder="e.g., iPhone15,2"
              className="bg-[#2a2a2a] border-[#444] text-green-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="os_version" className="text-green-100">OS Version</Label>
              <Input
                id="os_version"
                value={deviceInfo.os_version}
                onChange={(e) => setDeviceInfo({ ...deviceInfo, os_version: e.target.value })}
                placeholder="e.g., iOS 17.0"
                className="bg-[#2a2a2a] border-[#444] text-green-100"
              />
            </div>
            <div>
              <Label htmlFor="app_version" className="text-green-100">App Version</Label>
              <Input
                id="app_version"
                value={deviceInfo.app_version}
                onChange={(e) => setDeviceInfo({ ...deviceInfo, app_version: e.target.value })}
                placeholder="e.g., 1.0.0"
                className="bg-[#2a2a2a] border-[#444] text-green-100"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-green-600 text-green-300 hover:bg-green-900">
              Cancel
            </Button>
            <Button type="submit" disabled={deviceTokenMutation.isPending} className="bg-green-600 hover:bg-green-700">
              {deviceTokenMutation.isPending ? 'Generating...' : 'Generate Token'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Dashboard = () => {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isMobile, setIsMobile] = React.useState(false)
  const [searchTerm, setSearchTerm] = useState('');

  // React Query for users data
  const { data: users, isLoading, error, refetch } = useUsers();
  const deleteMutation = useDeleteUser();

  // Check if mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Filter users based on search term
  const filteredUsers = users?.filter(user => 
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Responsive items per page
  const itemsPerPage = isMobile ? 5 : 10

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      await deleteMutation.mutateAsync(userId);
    }
  };

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
                  <CardContent>
                    <CardTitle className="text-xl font-semibold text-neutral-900 pb-2">Total Users</CardTitle>
                    <div className="flex items-center justify-between">
                      <div className="text-7xl font-semibold text-gray-900">{users?.length || 0}</div>
                      <Users className="h-10 lg:h-16 w-10 lg:w-16 bg-[#131416] rounded-full p-3 border-3 border-[#B1CF5F] text-[#B1CF5F] outline-4 outline-white absolute -right-3 -top-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* New users per day */}
                <Card className="bg-[#7F7F7F] text-neutral-900 shadow-none w-full border-0 rounded-3xl relative basis-1/2">
                  <CardContent>
                    <CardTitle className="text-xl font-semibold text-neutral-900 pb-2">Active Users</CardTitle>
                    <div className="flex items-center justify-between">
                      <div className="text-7xl font-semibold text-gray-900">{users?.filter(u => u.is_active).length || 0}</div>
                      <UserPlus className="h-10 lg:h-16 w-10 lg:w-16 bg-[#131416] rounded-full p-3 border-3 border-[#7F7F7F] text-[#7F7F7F] outline-4 outline-white absolute -right-3 -top-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 w-full">
                {/* Rate of returning users */}
                <Card className="bg-[#DEF4C6] text-neutral-900 shadow-none w-full border-0 rounded-3xl relative basis-1/2">
                  <CardContent>
                    <CardTitle className="text-xl font-semibold text-neutral-900 pb-2">Total Diagnostics</CardTitle>
                    <div className="flex items-center justify-between">
                      <div className="text-7xl font-semibold text-gray-900">{users?.reduce((sum, user) => sum + (user.total_diagnostics || 0), 0) || 0}</div>
                      <TrendingDown className="h-10 lg:h-16 w-10 lg:w-16 bg-[#131416] rounded-full p-3 border-3 border-[#DEF4C6] text-[#DEF4C6] outline-4 outline-white absolute -right-3 -top-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Total Tokens */}
                <Card className="bg-[#73E2A7] text-neutral-900 shadow-none w-full border-0 rounded-3xl relative basis-1/2">
                  <CardContent>
                    <CardTitle className="text-xl font-semibold text-neutral-900 pb-2">Total Tokens</CardTitle>
                    <div className="flex items-center justify-between">
                      <div className="text-7xl font-semibold text-gray-900">{users?.reduce((sum, user) => sum + (user.token_balance || 0), 0) || 0}</div>
                      <FileText className="h-10 lg:h-16 w-10 lg:w-16 bg-[#131416] rounded-full p-3 border-3 border-[#73E2A7] text-[#73E2A7] outline-4 outline-white absolute -right-3 -top-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Card className='shadow-none border-0 bg-[#161616] text-green-100 my-18'>
            <CardHeader className='-mb-2'>
              <CardTitle className='text-2xl font-semibold text-green-300'>Users</CardTitle>
              <CardDescription>
                <p>
                  <span className='text-green-100'>{users?.length || 0}</span> users have been added to the system.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className='w-full'>
              {/* Search Bar */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-green-300" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 bg-[#1a1a1a] border-[#333] text-green-100 placeholder:text-green-300/50"
                  />
                </div>
                <Button onClick={() => refetch()} className="bg-green-600 hover:bg-green-700">
                  <Users className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="hidden md:block">
                  <UserTableSkeleton />
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-8 text-red-400">
                  Error loading users: {error.message}
                </div>
              )}

              {/* No Data State */}
              {!isLoading && !error && filteredUsers.length === 0 && (
                <div className="text-center py-8 text-green-300">
                  {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                </div>
              )}

              {/* Desktop Table View */}
              {!isLoading && !error && filteredUsers.length > 0 && (
                <div className="hidden md:block">
                  <Table className='w-full'>
                    <TableHeader className='text-green-100 w-full'>
                      <TableRow className='text-green-100 w-full border-[#333]'>
                        <TableHead className="w-[100px] text-green-100">Name</TableHead>
                        <TableHead className='text-center text-green-100 w-full'>Email</TableHead>
                        <TableHead className='text-center text-green-100'>Device</TableHead>
                        <TableHead className='text-center text-green-100'>Status</TableHead>
                        <TableHead className="text-center text-green-100">Tokens</TableHead>
                        <TableHead className="text-center text-green-100">Diagnostics</TableHead>
                        <TableHead className="text-center text-green-100">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className='w-full'>
                      {currentUsers.map((user) => (
                        <TableRow key={user.id} className="border-[#333]">
                          <TableCell className="font-medium text-green-100">
                            {user.first_name} {user.last_name}
                          </TableCell>
                          <TableCell className="text-center text-green-100">{user.email}</TableCell>
                          <TableCell className="text-center text-green-100">{user.device_name || 'N/A'}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={user.is_active ? 'default' : 'secondary'} className={user.is_active ? 'bg-green-600' : 'bg-gray-600'}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center text-green-100">{user.token_balance || 0}</TableCell>
                          <TableCell className="text-center text-green-100">{user.total_diagnostics || 0}</TableCell>
                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-green-300 hover:text-green-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-[#1a1a1a] border-[#333]">
                                <TopUpTokensDialog 
                                  userId={user.id} 
                                  userName={`${user.first_name} ${user.last_name}`}
                                  onSuccess={() => refetch()}
                                />
                                <EditUserDialog 
                                  user={user}
                                  onSuccess={() => refetch()}
                                />
                                <TransactionHistoryDialog 
                                  userId={user.id}
                                  userName={`${user.first_name} ${user.last_name}`}
                                />
                                <DeviceTokenDialog 
                                  userId={user.id}
                                  userName={`${user.first_name} ${user.last_name}`}
                                  onSuccess={() => refetch()}
                                />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(user.id, `${user.first_name} ${user.last_name}`)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="hidden md:flex items-center justify-between mt-6">
                      <div className="text-sm text-green-100">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} results
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                          className="border-green-600 text-green-300 hover:bg-green-900 disabled:opacity-50 p-2"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => goToPage(page)}
                              className={
                                currentPage === page
                                  ? "bg-green-600 text-white hover:bg-green-700"
                                  : "border-green-600 text-green-300 hover:bg-green-900"
                              }
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className="border-green-600 text-green-300 hover:bg-green-900 disabled:opacity-50 p-2"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Card View */}
              {!isLoading && !error && filteredUsers.length > 0 && (
                <div className="md:hidden space-y-4">
                  {currentUsers.map((user) => (
                   <Card key={user.id} className="bg-[#1a1a1a] border-[#333] text-green-100">
                     <CardContent className="p-4">
                       <div className="space-y-3">
                         <div className="flex justify-between items-start">
                           <div className="flex-1">
                             <h3 className="font-semibold text-green-300 text-lg">{user.first_name} {user.last_name}</h3>
                             <p className="text-sm text-green-100/80">{user.email}</p>
                           </div>
                           <Badge variant="secondary" className="bg-green-900 text-green-100">
                             {user.token_balance || 0} tokens
                           </Badge>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-3 text-sm">
                           <div>
                             <span className="text-green-100/60">Device:</span>
                             <p className="text-green-100">{user.device_name || 'N/A'}</p>
                           </div>
                           <div>
                             <span className="text-green-100/60">Status:</span>
                             <p className="text-green-100">
                               <Badge variant={user.is_active ? 'default' : 'secondary'} className={user.is_active ? 'bg-green-600' : 'bg-gray-600'}>
                                 {user.is_active ? 'Active' : 'Inactive'}
                               </Badge>
                             </p>
                           </div>
                         </div>
                         <div className="grid grid-cols-2 gap-3 text-sm">
                           <div>
                             <span className="text-green-100/60">Diagnostics:</span>
                             <p className="text-green-100">{user.total_diagnostics || 0}</p>
                           </div>
                           <div>
                             <span className="text-green-100/60">Tokens:</span>
                             <p className="text-green-100">{user.token_balance || 0}</p>
                           </div>
                         </div>
                         
                         <div className="flex justify-end pt-2">
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button size="sm" variant="outline" className="border-green-600 text-green-300 hover:bg-green-900">
                                 Actions
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="w-48 bg-[#1a1a1a] border-[#333]">
                               <TopUpTokensDialog 
                                 userId={user.id} 
                                 userName={`${user.first_name} ${user.last_name}`}
                                 onSuccess={() => refetch()}
                               />
                               <EditUserDialog 
                                 user={user}
                                 onSuccess={() => refetch()}
                               />
                               <TransactionHistoryDialog 
                                 userId={user.id}
                                 userName={`${user.first_name} ${user.last_name}`}
                               />
                               <DeviceTokenDialog 
                                 userId={user.id}
                                 userName={`${user.first_name} ${user.last_name}`}
                                 onSuccess={() => refetch()}
                               />
                               <DropdownMenuItem
                                 onClick={() => handleDeleteUser(user.id, `${user.first_name} ${user.last_name}`)}
                                 className="text-red-400 hover:text-red-300"
                               >
                                 <Trash2 className="mr-2 h-4 w-4" />
                                 Delete User
                               </DropdownMenuItem>
                             </DropdownMenuContent>
                           </DropdownMenu>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 ))}
                 
                 {/* Mobile Pagination Controls */}
                 {totalPages > 1 && (
                   <div className="flex flex-col items-center space-y-4">
                     <div className="text-sm text-green-100 text-center">
                       Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} results
                     </div>
                     
                     <div className="flex items-center space-x-2">
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={goToPreviousPage}
                         disabled={currentPage === 1}
                         className="border-green-600 text-green-300 hover:bg-green-900 disabled:opacity-50 p-2"
                       >
                         <ChevronLeft className="h-4 w-4" />
                       </Button>
                       
                       <span className="text-green-100 px-3">
                         Page {currentPage} of {totalPages}
                       </span>
                       
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={goToNextPage}
                         disabled={currentPage === totalPages}
                         className="border-green-600 text-green-300 hover:bg-green-900 disabled:opacity-50 p-2"
                       >
                         <ChevronRight className="h-4 w-4" />
                       </Button>
                     </div>
                     
                     {/* Mobile Page Numbers */}
                     <div className="flex items-center space-x-1 flex-wrap justify-center">
                       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                         <Button
                           key={page}
                           variant={currentPage === page ? "default" : "outline"}
                           size="sm"
                           onClick={() => goToPage(page)}
                           className={
                             currentPage === page
                               ? "bg-green-600 text-white hover:bg-green-700"
                               : "border-green-600 text-green-300 hover:bg-green-900"
                           }
                         >
                           {page}
                         </Button>
                       ))}
                     </div>
                   </div>
                 )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
