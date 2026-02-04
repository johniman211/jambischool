'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  Plus, 
  Search, 
  DollarSign,
  TrendingUp,
  Calendar,
  Receipt
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PaymentsPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Collected', value: '$0', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'This Month', value: '$0', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'This Week', value: '$0', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-100' },
    { label: 'Transactions', value: '0', icon: Receipt, color: 'text-orange-500', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Record and track fee payments</p>
        </div>
        <Link href={`/app/${params.schoolSlug}/fees/payments/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Record Payment
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View all recorded payments</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Payments Recorded</h3>
              <p className="text-muted-foreground mb-4">
                Record your first payment to start tracking collections
              </p>
              <Link href={`/app/${params.schoolSlug}/fees/payments/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Record First Payment
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
