import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface StudentsPageProps {
  params: { schoolSlug: string };
  searchParams: { page?: string; search?: string; status?: string; class?: string };
}

export default async function StudentsPage({ params, searchParams }: StudentsPageProps) {
  const supabase = await createClient();
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  // Get school
  const { data: school } = await supabase
    .from('schools')
    .select('id')
    .eq('slug', params.schoolSlug)
    .single();

  if (!school) {
    return <div>School not found</div>;
  }

  // Build query
  let query = supabase
    .from('students')
    .select(`
      *,
      enrollments(id, class_id, classes(id, name)),
      guardians(id, first_name, last_name, phone, relationship)
    `, { count: 'exact' })
    .eq('school_id', school.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  // Apply filters
  if (searchParams.search) {
    query = query.or(`first_name.ilike.%${searchParams.search}%,last_name.ilike.%${searchParams.search}%,admission_number.ilike.%${searchParams.search}%`);
  }
  if (searchParams.status) {
    query = query.eq('status', searchParams.status);
  }
  if (searchParams.class) {
    query = query.eq('current_class_id', searchParams.class);
  }

  const { data: students, count } = await query;

  // Get classes for filter
  const { data: classes } = await supabase
    .from('classes')
    .select('id, name, section')
    .eq('school_id', school.id)
    .order('name');

  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">{count || 0} total students</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/app/${params.schoolSlug}/students/import`}>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Import
            </Button>
          </Link>
          <Link href={`/app/${params.schoolSlug}/students/new`}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search by name or admission no..."
              defaultValue={searchParams.search}
              className="pl-9"
            />
          </div>
        </form>
        <div className="flex gap-2">
          <select
            name="status"
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            defaultValue={searchParams.status}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
            <option value="transferred">Transferred</option>
            <option value="expelled">Expelled</option>
          </select>
          <select
            name="class"
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            defaultValue={searchParams.class}
          >
            <option value="">All Classes</option>
            {classes?.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} {cls.section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admission No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Guardian</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students && students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.admission_number}</TableCell>
                  <TableCell>
                    <Link 
                      href={`/app/${params.schoolSlug}/students/${student.id}`}
                      className="hover:underline"
                    >
                      {student.first_name} {student.last_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {student.enrollments?.[0]?.classes ? (
                      <span>{student.enrollments[0].classes.name}</span>
                    ) : (
                      <span className="text-muted-foreground">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {student.guardians?.[0] ? (
                      <div>
                        <p className="text-sm">{student.guardians[0].first_name} {student.guardians[0].last_name}</p>
                        <p className="text-xs text-muted-foreground">{student.guardians[0].phone}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(student.enrollment_date)}</TableCell>
                  <TableCell>
                    <Link href={`/app/${params.schoolSlug}/students/${student.id}/edit`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {offset + 1} to {Math.min(offset + pageSize, count || 0)} of {count} students
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`/app/${params.schoolSlug}/students?page=${page - 1}`}>
                <Button variant="outline" size="sm">Previous</Button>
              </Link>
            )}
            {page < totalPages && (
              <Link href={`/app/${params.schoolSlug}/students?page=${page + 1}`}>
                <Button variant="outline" size="sm">Next</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
