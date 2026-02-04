'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Calendar, 
  Download, 
  FileSpreadsheet,
  TrendingUp,
  PieChart
} from 'lucide-react';

const reportTypes = [
  {
    title: 'Student Enrollment',
    description: 'View enrollment statistics by class, gender, and status',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    title: 'Attendance Summary',
    description: 'Analyze attendance patterns and trends',
    icon: Calendar,
    color: 'bg-green-500',
  },
  {
    title: 'Academic Performance',
    description: 'Track student performance across subjects and terms',
    icon: TrendingUp,
    color: 'bg-purple-500',
  },
  {
    title: 'Financial Reports',
    description: 'Fee collection, outstanding balances, and revenue',
    icon: DollarSign,
    color: 'bg-yellow-500',
  },
  {
    title: 'Class Distribution',
    description: 'Student distribution across classes and streams',
    icon: PieChart,
    color: 'bg-pink-500',
  },
  {
    title: 'Custom Reports',
    description: 'Generate custom reports with specific criteria',
    icon: FileSpreadsheet,
    color: 'bg-indigo-500',
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and export various reports</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Export All
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {reportTypes.map((report, index) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${report.color} flex items-center justify-center mb-4`}>
                  <report.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full gap-2">
                  <BarChart3 className="h-4 w-4" /> Generate Report
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Previously generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Recent Reports</h3>
              <p className="text-muted-foreground">
                Generated reports will appear here for quick access
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
