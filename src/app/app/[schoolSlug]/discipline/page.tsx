'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface DisciplineRecord {
  id: string;
  incident_type: string;
  description: string;
  status: string;
  severity: string;
  incident_date: string;
  students?: { first_name: string; last_name: string };
}

export default function DisciplinePage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<DisciplineRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      const supabase = createClient();
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', params.schoolSlug)
        .single();

      if (school) {
        const { data } = await supabase
          .from('discipline_records')
          .select('*, students(first_name, last_name)')
          .eq('school_id', school.id)
          .order('incident_date', { ascending: false });

        if (data) setRecords(data as DisciplineRecord[]);
      }
      setLoading(false);
    };
    fetchRecords();
  }, [params.schoolSlug]);

  const filteredRecords = records.filter(r =>
    r.incident_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.students?.first_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Records', value: records.length.toString(), icon: FileText, color: 'text-blue-500' },
    { label: 'Pending Review', value: records.filter(r => r.status === 'pending').length.toString(), icon: Clock, color: 'text-yellow-500' },
    { label: 'Resolved', value: records.filter(r => r.status === 'resolved').length.toString(), icon: CheckCircle, color: 'text-green-500' },
    { label: 'Serious Incidents', value: records.filter(r => r.severity === 'serious' || r.severity === 'critical').length.toString(), icon: AlertTriangle, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Discipline Records</h1>
          <p className="text-muted-foreground">Track and manage student behavior and incidents</p>
        </div>
        <Link href={`/app/${params.schoolSlug}/discipline/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Record
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Discipline Records</CardTitle>
                <CardDescription>View and manage all discipline records</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
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
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Discipline Records</h3>
                <p className="text-muted-foreground mb-4">
                  No discipline records have been created yet
                </p>
                <Link href={`/app/${params.schoolSlug}/discipline/new`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Create First Record
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{record.incident_type?.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.students?.first_name} {record.students?.last_name} • {new Date(record.incident_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={record.severity === 'serious' || record.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {record.severity}
                      </Badge>
                      <Badge variant={record.status === 'resolved' ? 'default' : 'outline'}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
