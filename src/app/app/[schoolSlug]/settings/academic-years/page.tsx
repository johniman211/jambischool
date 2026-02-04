'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AcademicYearsPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState('');

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
              <CardTitle>All Academic Years</CardTitle>
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
        </CardContent>
      </Card>
    </div>
  );
}
