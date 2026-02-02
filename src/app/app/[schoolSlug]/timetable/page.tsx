'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Clock, Calendar } from 'lucide-react';

interface TimetablePageProps {
  params: { schoolSlug: string };
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '08:00 - 08:45',
  '08:45 - 09:30',
  '09:30 - 10:15',
  '10:15 - 10:30', // Break
  '10:30 - 11:15',
  '11:15 - 12:00',
  '12:00 - 13:00', // Lunch
  '13:00 - 13:45',
  '13:45 - 14:30',
];

interface TimetableEntry {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  subject: { name: string; code: string } | null;
  teacher: { full_name: string } | null;
}

export default function TimetablePage({ params }: TimetablePageProps) {
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState<Array<{ id: string; name: string; section: string }>>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!selectedClass) return;

    async function loadTimetable() {
      setLoading(true);
      const supabase = createClient();

      const { data } = await supabase
        .from('timetable_entries')
        .select(`
          id,
          day,
          start_time,
          end_time,
          subject:subjects(name, code),
          teacher:profiles(full_name)
        `)
        .eq('class_id', selectedClass)
        .order('day')
        .order('start_time');

      if (data) {
        setTimetable(data as TimetableEntry[]);
      }
      setLoading(false);
    }
    loadTimetable();
  }, [selectedClass]);

  const getEntryForSlot = (day: string, timeSlot: string) => {
    const [start] = timeSlot.split(' - ');
    return timetable.find(
      entry => entry.day === day && entry.start_time.startsWith(start)
    );
  };

  const isBreak = (timeSlot: string) => {
    return timeSlot.includes('10:15') || timeSlot.includes('12:00');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-muted-foreground">Manage class schedules and periods</p>
        </div>
        {selectedClass && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Period
          </Button>
        )}
      </div>

      {/* Class Selection */}
      <div className="flex gap-4 items-end">
        <div>
          <label className="text-sm font-medium mb-1 block">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 min-w-[200px]"
          >
            <option value="">Choose a class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} {cls.section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timetable Grid */}
      {selectedClass ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading timetable...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-muted text-left w-32">
                        <Clock className="h-4 w-4 inline mr-2" />
                        Time
                      </th>
                      {DAYS.map(day => (
                        <th key={day} className="border p-2 bg-muted text-center min-w-[120px]">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_SLOTS.map((timeSlot) => (
                      <tr key={timeSlot}>
                        <td className="border p-2 text-sm font-medium bg-muted/50">
                          {timeSlot}
                        </td>
                        {isBreak(timeSlot) ? (
                          <td colSpan={5} className="border p-2 text-center bg-amber-50 text-amber-700">
                            {timeSlot.includes('12:00') ? 'Lunch Break' : 'Break'}
                          </td>
                        ) : (
                          DAYS.map(day => {
                            const entry = getEntryForSlot(day, timeSlot);
                            return (
                              <td key={day} className="border p-2 text-center">
                                {entry ? (
                                  <div className="bg-primary/10 rounded p-2">
                                    <p className="font-medium text-sm">{entry.subject?.name || 'N/A'}</p>
                                    <p className="text-xs text-muted-foreground">{entry.teacher?.full_name || ''}</p>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-xs">-</span>
                                )}
                              </td>
                            );
                          })
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Select a class to view or manage its timetable
          </CardContent>
        </Card>
      )}
    </div>
  );
}
