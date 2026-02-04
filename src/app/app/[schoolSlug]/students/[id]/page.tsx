import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, User, Phone, Mail, MapPin, Calendar, GraduationCap } from 'lucide-react';
import { formatDate, calculateAge } from '@/lib/utils';

interface StudentDetailPageProps {
  params: { schoolSlug: string; id: string };
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const supabase = await createClient();

  // Get student with related data
  const { data: student } = await supabase
    .from('students')
    .select(`
      *,
      current_class:classes(id, name, section),
      guardian:guardians(*),
      school:schools(id, name, slug)
    `)
    .eq('id', params.id)
    .single();

  if (!student || student.school?.slug !== params.schoolSlug) {
    notFound();
  }

  // Get attendance summary
  const { data: attendanceRecords } = await supabase
    .from('attendance_records')
    .select('status')
    .eq('student_id', student.id);

  const attendanceSummary = {
    present: attendanceRecords?.filter(a => a.status === 'present').length || 0,
    absent: attendanceRecords?.filter(a => a.status === 'absent').length || 0,
    late: attendanceRecords?.filter(a => a.status === 'late').length || 0,
    total: attendanceRecords?.length || 0,
  };

  // Get fee summary
  const { data: invoices } = await supabase
    .from('fee_invoices')
    .select('total_amount, paid_amount, status')
    .eq('student_id', student.id);

  const feeSummary = {
    totalBilled: invoices?.reduce((sum, i) => sum + Number(i.total_amount), 0) || 0,
    totalPaid: invoices?.reduce((sum, i) => sum + Number(i.paid_amount), 0) || 0,
    pending: invoices?.filter(i => i.status === 'pending' || i.status === 'partial').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/app/${params.schoolSlug}/students`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {student.first_name.charAt(0)}{student.last_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{student.first_name} {student.last_name}</h1>
              <p className="text-muted-foreground">
                {student.admission_number} • {student.current_class ? `${student.current_class.name} ${student.current_class.section}` : 'No class assigned'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="h-8">
            {student.status}
          </Badge>
          <Link href={`/app/${params.schoolSlug}/students/${student.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {attendanceSummary.total > 0 
                  ? Math.round((attendanceSummary.present / attendanceSummary.total) * 100) 
                  : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{attendanceSummary.present}</p>
              <p className="text-sm text-muted-foreground">Days Present</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">${feeSummary.totalPaid.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Fees Paid</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">${(feeSummary.totalBilled - feeSummary.totalPaid).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Balance Due</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="academics">Academics</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Full Name" value={`${student.first_name} ${student.last_name}`} />
                <InfoRow label="Date of Birth" value={student.date_of_birth ? `${formatDate(student.date_of_birth)} (${calculateAge(student.date_of_birth)} years)` : '-'} />
                <InfoRow label="Gender" value={student.gender} />
                <InfoRow label="Nationality" value={student.nationality || '-'} />
                <InfoRow label="Address" value={student.address || '-'} />
                {student.medical_info && (
                  <InfoRow label="Medical Info" value={student.medical_info} />
                )}
              </CardContent>
            </Card>

            {/* Guardian Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Guardian Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.guardian ? (
                  <>
                    <InfoRow label="Name" value={`${student.guardian.first_name || ''} ${student.guardian.last_name || ''}`.trim() || '-'} />
                    <InfoRow label="Relationship" value={student.guardian.relationship} />
                    <InfoRow label="Phone" value={student.guardian.phone} />
                    <InfoRow label="Email" value={student.guardian.email || '-'} />
                    <InfoRow label="Address" value={student.guardian.address || '-'} />
                  </>
                ) : (
                  <p className="text-muted-foreground">No guardian information</p>
                )}
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Admission Number" value={student.admission_number} />
                <InfoRow label="Enrollment Date" value={formatDate(student.enrollment_date)} />
                <InfoRow label="Current Class" value={student.current_class ? `${student.current_class.name} ${student.current_class.section}` : 'Not assigned'} />
                <InfoRow label="Status" value={student.status} />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Link href={`/app/${params.schoolSlug}/fees/invoices/new?student=${student.id}`}>
                  <Button variant="outline" className="w-full">Create Invoice</Button>
                </Link>
                <Link href={`/app/${params.schoolSlug}/academics/report-cards/new?student=${student.id}`}>
                  <Button variant="outline" className="w-full">Generate Report</Button>
                </Link>
                <Link href={`/app/${params.schoolSlug}/discipline/new?student=${student.id}`}>
                  <Button variant="outline" className="w-full">Add Note</Button>
                </Link>
                <Link href={`/app/${params.schoolSlug}/students/${student.id}/documents`}>
                  <Button variant="outline" className="w-full">Upload Document</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Attendance history will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academics">
          <Card>
            <CardHeader>
              <CardTitle>Academic Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Academic records, grades, and report cards will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Fee History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Invoices and payment history will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Student documents will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  );
}
