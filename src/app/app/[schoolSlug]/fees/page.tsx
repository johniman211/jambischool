import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, DollarSign, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

interface FeesPageProps {
  params: { schoolSlug: string };
}

export default async function FeesPage({ params }: FeesPageProps) {
  const supabase = await createClient();

  // Get school
  const { data: school } = await supabase
    .from('schools')
    .select('id, currency')
    .eq('slug', params.schoolSlug)
    .single();

  if (!school) {
    return <div>School not found</div>;
  }

  // Get summary stats
  const { data: invoices } = await supabase
    .from('fee_invoices')
    .select('total_amount, paid_amount, status')
    .eq('school_id', school.id);

  const stats = {
    totalBilled: invoices?.reduce((sum, i) => sum + Number(i.total_amount), 0) || 0,
    totalCollected: invoices?.reduce((sum, i) => sum + Number(i.paid_amount), 0) || 0,
    pendingInvoices: invoices?.filter(i => i.status === 'pending' || i.status === 'partial').length || 0,
    overdueInvoices: invoices?.filter(i => i.status === 'overdue').length || 0,
  };

  // Get recent invoices
  const { data: recentInvoices } = await supabase
    .from('fee_invoices')
    .select(`
      *,
      student:students(id, first_name, last_name, admission_number)
    `)
    .eq('school_id', school.id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Get recent payments
  const { data: recentPayments } = await supabase
    .from('fee_payments')
    .select(`
      *,
      invoice:fee_invoices(
        id,
        invoice_number,
        student:students(id, first_name, last_name)
      )
    `)
    .eq('school_id', school.id)
    .order('payment_date', { ascending: false })
    .limit(10);

  const currency = school.currency || 'USD';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Fees & Finance</h1>
          <p className="text-muted-foreground">Manage invoices, payments, and fee structures</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/app/${params.schoolSlug}/fees/structures`}>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Fee Structures
            </Button>
          </Link>
          <Link href={`/app/${params.schoolSlug}/fees/invoices/new`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalBilled, currency)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <TrendingUp className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(stats.totalCollected, currency)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalBilled > 0 ? Math.round((stats.totalCollected / stats.totalBilled) * 100) : 0}% collection rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertCircle className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {formatCurrency(stats.totalBilled - stats.totalCollected, currency)}
            </div>
            <p className="text-xs text-muted-foreground">{stats.pendingInvoices} pending invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdueInvoices}</div>
            <p className="text-xs text-muted-foreground">Invoices past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-4">
        <Link href={`/app/${params.schoolSlug}/fees/invoices`}>
          <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
            <CardContent className="pt-6 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">All Invoices</p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/app/${params.schoolSlug}/fees/payments`}>
          <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">All Payments</p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/app/${params.schoolSlug}/fees/reports`}>
          <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Financial Reports</p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/app/${params.schoolSlug}/fees/structures`}>
          <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
            <CardContent className="pt-6 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Fee Structures</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Link href={`/app/${params.schoolSlug}/fees/invoices`}>
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices && recentInvoices.length > 0 ? (
                  recentInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <Link 
                          href={`/app/${params.schoolSlug}/fees/invoices/${invoice.id}`}
                          className="font-medium hover:underline"
                        >
                          {invoice.invoice_number}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {invoice.student?.first_name} {invoice.student?.last_name}
                      </TableCell>
                      <TableCell>{formatCurrency(invoice.total_amount, currency)}</TableCell>
                      <TableCell>
                        <Badge variant={
                          invoice.status === 'paid' ? 'default' :
                          invoice.status === 'overdue' ? 'destructive' :
                          'secondary'
                        }>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No invoices yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Payments</CardTitle>
            <Link href={`/app/${params.schoolSlug}/fees/payments`}>
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments && recentPayments.length > 0 ? (
                  recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.receipt_number}</TableCell>
                      <TableCell>
                        {payment.invoice?.student?.first_name} {payment.invoice?.student?.last_name}
                      </TableCell>
                      <TableCell className="text-success">
                        +{formatCurrency(payment.amount, currency)}
                      </TableCell>
                      <TableCell>{formatDate(payment.payment_date)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No payments yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
