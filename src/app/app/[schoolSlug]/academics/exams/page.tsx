'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Search, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Exam {
  id: string;
  name: string;
  exam_type: string;
  start_date: string;
  end_date: string;
  status: string;
  academic_years?: { name: string };
  terms?: { name: string };
}

export default function ExamsPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      const supabase = createClient();
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', params.schoolSlug)
        .single();

      if (school) {
        const { data } = await supabase
          .from('exams')
          .select('*, academic_years(name), terms(name)')
          .eq('school_id', school.id)
          .order('start_date', { ascending: false });

        if (data) setExams(data as Exam[]);
      }
      setLoading(false);
    };
    fetchExams();
  }, [params.schoolSlug]);

  const filteredExams = exams.filter(exam =>
    exam.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Examinations</h1>
          <p className="text-muted-foreground">Schedule and manage exams</p>
        </div>
        <Link href={`/app/${params.schoolSlug}/academics/exams/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Schedule Exam
          </Button>
        </Link>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Exams</CardTitle>
              <CardDescription>View scheduled examinations</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exams..."
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
          ) : filteredExams.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Exams Scheduled</h3>
              <p className="text-muted-foreground mb-4">
                Schedule your first exam to start tracking academic performance
              </p>
              <Link href={`/app/${params.schoolSlug}/academics/exams/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Schedule First Exam
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{exam.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.exam_type?.replace('_', ' ')} • {new Date(exam.start_date).toLocaleDateString()} - {new Date(exam.end_date).toLocaleDateString()}
                    </p>
                    {exam.terms?.name && <p className="text-xs text-muted-foreground">{exam.terms.name}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={exam.status === 'completed' ? 'default' : exam.status === 'ongoing' ? 'secondary' : 'outline'}>
                      {exam.status}
                    </Badge>
                    <Link href={`/app/${params.schoolSlug}/academics/exams/${exam.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
