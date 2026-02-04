'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { createClient } from '@/lib/supabase/client';

interface Payment {
  id: string;
  receipt_number: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  status: string;
  students?: { first_name: string; last_name: string };
}

export default function PaymentsPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    transactions: 0,
  });

  useEffect(() => {
    const fetchPayments = async () => {
      const supabase = createClient();
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', params.schoolSlug)
        .single();

      if (school) {
        const { data } = await supabase
          .from('payments')
          .select('*, students(first_name, last_name)')
          .eq('school_id', school.id)
          .order('payment_date', { ascending: false });

        if (data) {
          setPayments(data as Payment[]);
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split('T')[0];
          
          const total = data.reduce((sum, p) => sum + Number(p.amount), 0);
          const thisMonth = data.filter(p => p.payment_date >= startOfMonth).reduce((sum, p) => sum + Number(p.amount), 0);
          const thisWeek = data.filter(p => p.payment_date >= startOfWeek).reduce((sum, p) => sum + Number(p.amount), 0);
          
          setStats({
            total,
            thisMonth,
            thisWeek,
            transactions: data.length,
          });
        }
      }
      setLoading(false);
    };
    fetchPayments();
  }, [params.schoolSlug]);

  const filteredPayments = payments.filter(p => 
    p.receipt_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.students?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.students?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statCards = [
    { label: 'Total Collected', value: `$${stats.total.toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'This Month', value: `$${stats.thisMonth.toLocaleString()}`, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'This Week', value: `$${stats.thisWeek.toLocaleString()}`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-100' },
    { label: 'Transactions', value: stats.transactions.toString(), icon: Receipt, color: 'text-orange-500', bg: 'bg-orange-100' },
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
        {statCards.map((stat) => (
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
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : filteredPayments.length === 0 ? (
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
            ) : (
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{payment.receipt_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.students?.first_name} {payment.students?.last_name} • {new Date(payment.payment_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${Number(payment.amount).toLocaleString()}</p>
                      <Badge variant="secondary">{payment.payment_method?.replace('_', ' ')}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
