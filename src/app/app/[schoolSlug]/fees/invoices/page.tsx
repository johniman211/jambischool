'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Search, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Invoice {
  id: string;
  invoice_number: string;
  student_id: string;
  total: number;
  balance: number;
  status: string;
  due_date: string;
  created_at: string;
  students?: { first_name: string; last_name: string; admission_number: string };
}

export default function InvoicesPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      const supabase = createClient();
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', params.schoolSlug)
        .single();

      if (school) {
        const { data } = await supabase
          .from('invoices')
          .select('*, students(first_name, last_name, admission_number)')
          .eq('school_id', school.id)
          .order('created_at', { ascending: false });

        if (data) {
          setInvoices(data as Invoice[]);
          const paid = data.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.total), 0);
          const pending = data.filter(i => i.status === 'pending' || i.status === 'partial').reduce((sum, i) => sum + Number(i.balance), 0);
          const overdue = data.filter(i => i.status === 'overdue').reduce((sum, i) => sum + Number(i.balance), 0);
          setStats({
            total: data.length,
            paid,
            pending,
            overdue,
          });
        }
      }
      setLoading(false);
    };
    fetchInvoices();
  }, [params.schoolSlug]);

  const filteredInvoices = invoices.filter(inv => 
    inv.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.students?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.students?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statCards = [
    { label: 'Total Invoices', value: stats.total.toString(), icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Paid', value: `$${stats.paid.toLocaleString()}`, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'Pending', value: `$${stats.pending.toLocaleString()}`, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { label: 'Overdue', value: `$${stats.overdue.toLocaleString()}`, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Create and manage student fee invoices</p>
        </div>
        <Link href={`/app/${params.schoolSlug}/fees/invoices/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Create Invoice
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
                <CardTitle>All Invoices</CardTitle>
                <CardDescription>View and manage all student invoices</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
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
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Invoices Created</h3>
                <p className="text-muted-foreground mb-4">
                  Create fee structures first, then generate invoices for students
                </p>
                <Link href={`/app/${params.schoolSlug}/fees/invoices/new`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Create First Invoice
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{invoice.invoice_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.students?.first_name} {invoice.students?.last_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${Number(invoice.total).toLocaleString()}</p>
                      <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'overdue' ? 'destructive' : 'secondary'}>
                        {invoice.status}
                      </Badge>
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
