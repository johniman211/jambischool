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
import { Plus, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function SuperAdminSchoolsPage() {
  const supabase = await createClient();

  const { data: schools } = await supabase
    .from('schools')
    .select(`
      *,
      students:students(count),
      memberships:memberships(count)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schools</h1>
          <p className="text-muted-foreground">Manage all schools on the platform</p>
        </div>
        <Link href="/superadmin/schools/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Schools</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools && schools.length > 0 ? (
                schools.map((school: any) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell className="text-muted-foreground">/{school.slug}</TableCell>
                    <TableCell>{school.students?.[0]?.count || 0}</TableCell>
                    <TableCell>{school.memberships?.[0]?.count || 0}</TableCell>
                    <TableCell>
                      <Badge variant={school.is_active ? 'default' : 'secondary'}>
                        {school.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(school.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/app/${school.slug}/dashboard`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/superadmin/schools/${school.id}`}>
                          <Button variant="outline" size="sm">Manage</Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No schools registered yet
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
