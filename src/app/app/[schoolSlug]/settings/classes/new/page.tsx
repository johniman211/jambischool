'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';

export default function NewClassPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    capacity: '',
    level: '1',
  });

  useEffect(() => {
    const fetchSchool = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', params.schoolSlug)
        .single();
      if (data) setSchoolId(data.id);
    };
    fetchSchool();
  }, [params.schoolSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) {
      toast({
        title: 'Error',
        description: 'School not found. Please try again.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_id: schoolId,
          name: formData.name,
          level: parseInt(formData.level) || 1,
          description: formData.section || null,
          capacity: formData.capacity || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create class');
      }

      toast({
        title: 'Class created',
        description: 'The class has been successfully created.',
      });
      router.push(`/app/${params.schoolSlug}/settings/classes`);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create class. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href={`/app/${params.schoolSlug}/settings/classes`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Class</h1>
          <p className="text-muted-foreground">Create a new class for your school</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" /> Class Information
            </CardTitle>
            <CardDescription>Enter the class details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Class Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Grade 1, Primary 5"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section/Stream</Label>
                  <Input
                    id="section"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="e.g., A, B, Blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="Maximum students"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? 'Creating...' : 'Create Class'}
                </Button>
                <Link href={`/app/${params.schoolSlug}/settings/classes`}>
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
