'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  Filter,
  Eye
} from 'lucide-react'

const FeedbackPage = () => {
  const feedbackData = [
    {
      id: 1,
      photo: '/leaf1.jpg',
      aiDiagnosis: 'Cassava Mosaic Disease',
      crop: 'Tomato',
      userFeedback: 'correct',
      action: 'view'
    },
    {
      id: 2,
      photo: '/leaf2.jpg',
      aiDiagnosis: 'Pepper Leaf Curl Virus',
      crop: 'Tomato',
      userFeedback: 'Incorrect',
      action: 'view'
    },
    {
      id: 3,
      photo: '/leaf3.jpg',
      aiDiagnosis: 'Septoria Leaf Spot',
      crop: 'Pepper',
      userFeedback: 'Incorrect',
      action: 'view'
    }
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Feedback</h1>
      
      {/* Diagnostics Section */}
      <Card className="bg-gray-800 text-white mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Diagnostics</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by name" 
                className="pl-10 w-64 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2 bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>

          {/* Feedback Table */}
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-white">Photo</TableHead>
                <TableHead className="text-white">AI Diagnosis</TableHead>
                <TableHead className="text-white">Crop</TableHead>
                <TableHead className="text-white">User Feedback</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackData.map((item) => (
                <TableRow key={item.id} className="border-gray-700">
                  <TableCell>
                    <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-300">🌿</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">{item.aiDiagnosis}</TableCell>
                  <TableCell className="text-white">{item.crop}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.userFeedback === 'correct' ? 'default' : 'secondary'}
                      className={item.userFeedback === 'correct' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-white'
                      }
                    >
                      {item.userFeedback}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default FeedbackPage 