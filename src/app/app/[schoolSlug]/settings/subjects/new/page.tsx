'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';

export default function NewSubjectPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: '',
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
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_id: schoolId,
          name: formData.name,
          code: formData.code || formData.name.substring(0, 4).toUpperCase(),
          description: null,
          is_compulsory: formData.type === 'core',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create subject');
      }

      toast({
        title: 'Subject created',
        description: 'The subject has been successfully created.',
      });
      router.push(`/app/${params.schoolSlug}/settings/subjects`);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create subject. Please try again.',
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
        <Link href={`/app/${params.schoolSlug}/settings/subjects`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Subject</h1>
          <p className="text-muted-foreground">Create a new subject for your school</p>
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
              <BookOpen className="h-5 w-5" /> Subject Information
            </CardTitle>
            <CardDescription>Enter the subject details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Subject Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Mathematics, English"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Subject Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g., MATH, ENG"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Subject Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="core">Core Subject</SelectItem>
                      <SelectItem value="elective">Elective</SelectItem>
                      <SelectItem value="extra">Extra-Curricular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? 'Creating...' : 'Create Subject'}
                </Button>
                <Link href={`/app/${params.schoolSlug}/settings/subjects`}>
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
