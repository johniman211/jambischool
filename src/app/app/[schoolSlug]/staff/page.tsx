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
import { Plus, Users, GraduationCap, Calculator, Shield } from 'lucide-react';

interface StaffPageProps {
  params: { schoolSlug: string };
}

export default async function StaffPage({ params }: StaffPageProps) {
  const supabase = await createClient();

  const { data: school } = await supabase
    .from('schools')
    .select('id')
    .eq('slug', params.schoolSlug)
    .single();

  if (!school) {
    return <div>School not found</div>;
  }

  // Get staff members with their memberships
  const { data: memberships } = await supabase
    .from('memberships')
    .select(`
      id,
      role,
      is_active,
      created_at,
      profile:profiles(id, full_name, email, phone, avatar_url)
    `)
    .eq('school_id', school.id)
    .neq('role', 'parent')
    .order('created_at', { ascending: false });

  // Get staff by role counts
  const roleCounts = {
    admin: memberships?.filter(m => m.role === 'admin').length || 0,
    teacher: memberships?.filter(m => m.role === 'teacher').length || 0,
    accountant: memberships?.filter(m => m.role === 'accountant').length || 0,
    total: memberships?.length || 0,
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'accountant': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage teachers, administrators, and other staff</p>
        </div>
        <Link href={`/app/${params.schoolSlug}/staff/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.admin}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <GraduationCap className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.teacher}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accountants</CardTitle>
            <Calculator className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.accountant}</div>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships && memberships.length > 0 ? (
                memberships.map((member: any) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                          {member.profile?.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-medium">{member.profile?.full_name || 'Unknown'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.profile?.email || '-'}</TableCell>
                    <TableCell>{member.profile?.phone || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(member.role)}`}>
                        {member.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.is_active ? 'default' : 'secondary'}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/app/${params.schoolSlug}/staff/${member.profile?.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No staff members found. Add your first staff member to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
