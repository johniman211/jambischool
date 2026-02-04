'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, PenLine } from 'lucide-react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function MarksEntryPage() {
  const params = useParams();
  const [exams, setExams] = useState<Array<{ id: string; name: string }>>([]);
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', params.schoolSlug)
        .single();

      if (school) {
        const [examsRes, classesRes, subjectsRes] = await Promise.all([
          supabase.from('exams').select('id, name').eq('school_id', school.id).order('created_at', { ascending: false }),
          supabase.from('classes').select('id, name').eq('school_id', school.id).order('name'),
          supabase.from('subjects').select('id, name').eq('school_id', school.id).order('name'),
        ]);
        if (examsRes.data) setExams(examsRes.data);
        if (classesRes.data) setClasses(classesRes.data);
        if (subjectsRes.data) setSubjects(subjectsRes.data);
      }
      setLoading(false);
    };
    fetchData();
  }, [params.schoolSlug]);
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Marks Entry</h1>
          <p className="text-muted-foreground">Enter and manage student marks</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Select Exam & Class</CardTitle>
            <CardDescription>Choose an exam and class to enter marks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.length === 0 ? (
                    <SelectItem value="none">No exams available</SelectItem>
                  ) : (
                    exams.map(exam => (
                      <SelectItem key={exam.id} value={exam.id}>{exam.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.length === 0 ? (
                    <SelectItem value="none">No classes available</SelectItem>
                  ) : (
                    classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.length === 0 ? (
                    <SelectItem value="none">No subjects available</SelectItem>
                  ) : (
                    subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="text-center py-12">
              <PenLine className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Select Options Above</h3>
              <p className="text-muted-foreground">
                Choose an exam, class, and subject to enter marks
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
