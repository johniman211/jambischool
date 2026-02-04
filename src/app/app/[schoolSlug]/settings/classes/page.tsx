'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Plus, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface ClassData {
  id: string;
  name: string;
  level: number;
  description: string | null;
  capacity: number | null;
  is_active: boolean;
}

export default function ClassesPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      const supabase = createClient();
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', params.schoolSlug)
        .single();

      if (school) {
        const { data } = await supabase
          .from('classes')
          .select('*')
          .eq('school_id', school.id)
          .eq('is_active', true)
          .order('level', { ascending: true });

        if (data) setClasses(data);
      }
      setLoading(false);
    };
    fetchClasses();
  }, [params.schoolSlug]);

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Classes</h1>
          <p className="text-muted-foreground">Manage classes and streams</p>
        </div>
        <Link href={`/app/${params.schoolSlug}/settings/classes/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Class
          </Button>
        </Link>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Classes ({classes.length})</CardTitle>
              <CardDescription>Configure classes and their streams</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
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
          ) : filteredClasses.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Classes Created</h3>
              <p className="text-muted-foreground mb-4">
                Add classes like Primary 1, Grade 7, etc.
              </p>
              <Link href={`/app/${params.schoolSlug}/settings/classes/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Create First Class
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((classItem) => (
                <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{classItem.name}</h3>
                          {classItem.description && (
                            <p className="text-sm text-muted-foreground">{classItem.description}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary">Level {classItem.level}</Badge>
                    </div>
                    {classItem.capacity && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Capacity: {classItem.capacity}</span>
                      </div>
                    )}
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
