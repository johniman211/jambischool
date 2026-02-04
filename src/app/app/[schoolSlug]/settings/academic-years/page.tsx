'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface AcademicYearData {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export default function AcademicYearsPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [academicYears, setAcademicYears] = useState<AcademicYearData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      const supabase = createClient();
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', params.schoolSlug)
        .single();

      if (school) {
        const { data } = await supabase
          .from('academic_years')
          .select('*')
          .eq('school_id', school.id)
          .order('start_date', { ascending: false });

        if (data) setAcademicYears(data);
      }
      setLoading(false);
    };
    fetchAcademicYears();
  }, [params.schoolSlug]);

  const filteredYears = academicYears.filter(y => 
    y.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Academic Years</h1>
          <p className="text-muted-foreground">Manage academic years and terms</p>
        </div>
        <Link href={`/app/${params.schoolSlug}/settings/academic-years/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Academic Year
          </Button>
        </Link>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Academic Years ({academicYears.length})</CardTitle>
              <CardDescription>Configure academic years and their terms</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
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
          ) : filteredYears.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Academic Years</h3>
              <p className="text-muted-foreground mb-4">
                Create your first academic year to get started
              </p>
              <Link href={`/app/${params.schoolSlug}/settings/academic-years/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Create Academic Year
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredYears.map((year) => (
                <Card key={year.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{year.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(year.start_date)} - {formatDate(year.end_date)}
                          </p>
                        </div>
                      </div>
                      {year.is_current && (
                        <Badge variant="default">Current</Badge>
                      )}
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
