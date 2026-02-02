import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, CreditCard, Calendar, TrendingUp, UserCheck } from 'lucide-react';

interface DashboardPageProps {
  params: { schoolSlug: string };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const supabase = await createClient();

  // Get school
  const { data: school } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', params.schoolSlug)
    .single();

  if (!school) {
    return <div>School not found</div>;
  }

  // Get current academic year
  const { data: currentYear } = await supabase
    .from('academic_years')
    .select('*')
    .eq('school_id', school.id)
    .eq('is_current', true)
    .single();

  // Get stats
  const [
    { count: totalStudents },
    { count: activeStudents },
    { count: totalStaff },
    { count: totalClasses },
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('school_id', school.id),
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('school_id', school.id).eq('status', 'active'),
    supabase.from('school_memberships').select('*', { count: 'exact', head: true }).eq('school_id', school.id).eq('is_active', true),
    supabase.from('classes').select('*', { count: 'exact', head: true }).eq('school_id', school.id),
  ]);

  // Get today's attendance summary
  const today = new Date().toISOString().split('T')[0];
  const { data: todayAttendance } = await supabase
    .from('attendance_records')
    .select('status')
    .eq('school_id', school.id)
    .eq('date', today);

  const attendanceSummary = {
    present: todayAttendance?.filter(a => a.status === 'present').length || 0,
    absent: todayAttendance?.filter(a => a.status === 'absent').length || 0,
    late: todayAttendance?.filter(a => a.status === 'late').length || 0,
  };

  // Get recent fee collection
  const { data: recentPayments } = await supabase
    .from('fee_payments')
    .select('amount')
    .eq('school_id', school.id)
    .gte('payment_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const monthlyCollection = recentPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to {school.name} • {currentYear?.name || 'No academic year set'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={totalStudents || 0}
          subtitle={`${activeStudents || 0} active`}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard
          title="Staff Members"
          value={totalStaff || 0}
          subtitle="Active staff"
          icon={<GraduationCap className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard
          title="Classes"
          value={totalClasses || 0}
          subtitle="Total classes"
          icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard
          title="Monthly Collection"
          value={`$${monthlyCollection.toLocaleString()}`}
          subtitle="Last 30 days"
          icon={<CreditCard className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <UserCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{attendanceSummary.present}</div>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{attendanceSummary.absent}</div>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{attendanceSummary.late}</div>
                <p className="text-xs text-muted-foreground">Late</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <a href={`/app/${params.schoolSlug}/students/new`} className="p-2 text-sm text-center rounded-md bg-muted hover:bg-muted/80">
                Add Student
              </a>
              <a href={`/app/${params.schoolSlug}/attendance`} className="p-2 text-sm text-center rounded-md bg-muted hover:bg-muted/80">
                Take Attendance
              </a>
              <a href={`/app/${params.schoolSlug}/fees/invoices/new`} className="p-2 text-sm text-center rounded-md bg-muted hover:bg-muted/80">
                Create Invoice
              </a>
              <a href={`/app/${params.schoolSlug}/reports`} className="p-2 text-sm text-center rounded-md bg-muted hover:bg-muted/80">
                View Reports
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academic Year</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {currentYear ? (
              <div>
                <p className="text-lg font-semibold">{currentYear.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(currentYear.start_date).toLocaleDateString()} - {new Date(currentYear.end_date).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No academic year configured</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon 
}: { 
  title: string; 
  value: string | number; 
  subtitle: string; 
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
