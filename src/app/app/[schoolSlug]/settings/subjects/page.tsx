'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface SubjectData {
  id: string;
  name: string;
  code: string;
  description: string | null;
  is_compulsory: boolean;
  is_active: boolean;
}

export default function SubjectsPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      const supabase = createClient();
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', params.schoolSlug)
        .single();

      if (school) {
        const { data } = await supabase
          .from('subjects')
          .select('*')
          .eq('school_id', school.id)
          .eq('is_active', true)
          .order('name', { ascending: true });

        if (data) setSubjects(data);
      }
      setLoading(false);
    };
    fetchSubjects();
  }, [params.schoolSlug]);

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Subjects</h1>
          <p className="text-muted-foreground">Manage subjects taught in your school</p>
        </div>
        <Link href={`/app/${params.schoolSlug}/settings/subjects/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Subject
          </Button>
        </Link>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Subjects ({subjects.length})</CardTitle>
              <CardDescription>Configure subjects and assign to classes</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
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
          ) : filteredSubjects.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Subjects Created</h3>
              <p className="text-muted-foreground mb-4">
                Add subjects like Mathematics, English, Science, etc.
              </p>
              <Link href={`/app/${params.schoolSlug}/settings/subjects/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Create First Subject
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubjects.map((subject) => (
                <Card key={subject.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground">{subject.code}</p>
                        </div>
                      </div>
                      <Badge variant={subject.is_compulsory ? "default" : "secondary"}>
                        {subject.is_compulsory ? "Core" : "Elective"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
