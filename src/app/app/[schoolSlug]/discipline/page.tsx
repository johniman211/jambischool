'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function DisciplinePage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Records', value: '0', icon: FileText, color: 'text-blue-500' },
    { label: 'Pending Review', value: '0', icon: Clock, color: 'text-yellow-500' },
    { label: 'Resolved', value: '0', icon: CheckCircle, color: 'text-green-500' },
    { label: 'Serious Incidents', value: '0', icon: AlertTriangle, color: 'text-red-500' },
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
