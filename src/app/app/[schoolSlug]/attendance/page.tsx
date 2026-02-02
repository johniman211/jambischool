'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Save, Check, X, Clock, Users } from 'lucide-react';

interface AttendancePageProps {
  params: { schoolSlug: string };
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  admission_number: string;
  status?: AttendanceStatus;
}

export default function AttendancePage({ params }: AttendancePageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState<Array<{ id: string; name: string; section: string }>>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load classes
  useEffect(() => {
    async function loadClasses() {
      const supabase = createClient();
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', params.schoolSlug)
        .single();

      if (school) {
        const { data } = await supabase
          .from('classes')
          .select('id, name, section')
          .eq('school_id', school.id)
          .order('name');
        
        if (data) setClasses(data);
      }
    }
    loadClasses();
  }, [params.schoolSlug]);

  // Load students and attendance when class/date changes
  useEffect(() => {
    if (!selectedClass) return;

    async function loadData() {
      setLoading(true);
      const supabase = createClient();

      // Get students in class
      const { data: studentData } = await supabase
        .from('students')
        .select('id, first_name, last_name, admission_number')
        .eq('current_class_id', selectedClass)
        .eq('status', 'active')
        .order('first_name');

      if (studentData) {
        setStudents(studentData);

        // Get existing attendance for this date
        const { data: attendanceData } = await supabase
          .from('attendance_records')
          .select('student_id, status')
          .eq('class_id', selectedClass)
          .eq('date', selectedDate);

        const attendanceMap: Record<string, AttendanceStatus> = {};
        attendanceData?.forEach(record => {
          attendanceMap[record.student_id] = record.status as AttendanceStatus;
        });
        setAttendance(attendanceMap);
      }

      setLoading(false);
    }
    loadData();
  }, [selectedClass, selectedDate]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const newAttendance: Record<string, AttendanceStatus> = {};
    students.forEach(s => {
      newAttendance[s.id] = 'present';
    });
    setAttendance(newAttendance);
  };

  const handleSave = async () => {
    if (!selectedClass || Object.keys(attendance).length === 0) {
      toast({
        title: 'Error',
        description: 'Please select a class and mark attendance',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    const supabase = createClient();

    try {
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', params.schoolSlug)
        .single();

      if (!school) throw new Error('School not found');

      // Get current academic year
      const { data: academicYear } = await supabase
        .from('academic_years')
        .select('id')
        .eq('school_id', school.id)
        .eq('is_current', true)
        .single();

      // Get current term
      const { data: term } = await supabase
        .from('terms')
        .select('id')
        .eq('academic_year_id', academicYear?.id)
        .eq('is_current', true)
        .single();

      // Delete existing records for this date/class
      await supabase
        .from('attendance_records')
        .delete()
        .eq('class_id', selectedClass)
        .eq('date', selectedDate);

      // Insert new records
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        school_id: school.id,
        student_id: studentId,
        class_id: selectedClass,
        academic_year_id: academicYear?.id,
        term_id: term?.id,
        date: selectedDate,
        status,
      }));

      const { error } = await supabase
        .from('attendance_records')
        .insert(records);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Attendance saved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save attendance',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const summary = {
    total: students.length,
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    late: Object.values(attendance).filter(s => s === 'late').length,
    unmarked: students.length - Object.keys(attendance).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Record daily student attendance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 min-w-[200px]"
          >
            <option value="">Select a class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} {cls.section}
              </option>
            ))}
          </select>
        </div>
        {selectedClass && (
          <>
            <div className="flex items-end">
              <Button variant="outline" onClick={markAllPresent}>
                <Check className="h-4 w-4 mr-2" />
                Mark All Present
              </Button>
            </div>
            <div className="flex items-end ml-auto">
              <Button onClick={handleSave} loading={saving}>
                <Save className="h-4 w-4 mr-2" />
                Save Attendance
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Summary Cards */}
      {selectedClass && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{summary.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-success" />
                <div>
                  <p className="text-2xl font-bold text-success">{summary.present}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <X className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-destructive">{summary.absent}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold text-warning">{summary.late}</p>
                  <p className="text-xs text-muted-foreground">Late</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{summary.unmarked}</p>
                  <p className="text-xs text-muted-foreground">Unmarked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student List */}
      {selectedClass && (
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No students in this class</div>
            ) : (
              <div className="space-y-2">
                {students.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground w-8">{index + 1}.</span>
                      <div>
                        <p className="font-medium">{student.first_name} {student.last_name}</p>
                        <p className="text-sm text-muted-foreground">{student.admission_number}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                        className={attendance[student.id] === 'present' ? 'bg-success hover:bg-success/90' : ''}
                        onClick={() => handleStatusChange(student.id, 'present')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={attendance[student.id] === 'absent' ? 'default' : 'outline'}
                        className={attendance[student.id] === 'absent' ? 'bg-destructive hover:bg-destructive/90' : ''}
                        onClick={() => handleStatusChange(student.id, 'absent')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={attendance[student.id] === 'late' ? 'default' : 'outline'}
                        className={attendance[student.id] === 'late' ? 'bg-warning hover:bg-warning/90' : ''}
                        onClick={() => handleStatusChange(student.id, 'late')}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedClass && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Select a class to start taking attendance
          </CardContent>
        </Card>
      )}
    </div>
  );
}
