'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function NewDisciplineRecordPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    incident_type: '',
    severity: '',
    incident_date: new Date().toISOString().split('T')[0],
    description: '',
    action_taken: '',
    reported_by: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement discipline record creation logic with Supabase
      toast({
        title: 'Record created',
        description: 'The discipline record has been successfully created.',
      });
      router.push(`/app/${params.schoolSlug}/discipline`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create record. Please try again.',
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
        <Link href={`/app/${params.schoolSlug}/discipline`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Discipline Record</h1>
          <p className="text-muted-foreground">Record a new discipline incident</p>
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
              <FileText className="h-5 w-5" /> Incident Details
            </CardTitle>
            <CardDescription>Enter the discipline record information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="student">Select Student *</Label>
                  <Select
                    value={formData.student_id}
                    onValueChange={(value) => setFormData({ ...formData, student_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="placeholder">No students available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident_type">Incident Type *</Label>
                  <Select
                    value={formData.incident_type}
                    onValueChange={(value) => setFormData({ ...formData, incident_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="misconduct">Misconduct</SelectItem>
                      <SelectItem value="tardiness">Tardiness</SelectItem>
                      <SelectItem value="absence">Unauthorized Absence</SelectItem>
                      <SelectItem value="dress_code">Dress Code Violation</SelectItem>
                      <SelectItem value="fighting">Fighting</SelectItem>
                      <SelectItem value="bullying">Bullying</SelectItem>
                      <SelectItem value="vandalism">Vandalism</SelectItem>
                      <SelectItem value="cheating">Cheating</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity *</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) => setFormData({ ...formData, severity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident_date">Incident Date *</Label>
                  <Input
                    id="incident_date"
                    type="date"
                    value={formData.incident_date}
                    onChange={(e) => setFormData({ ...formData, incident_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the incident in detail..."
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="action_taken">Action Taken</Label>
                  <Textarea
                    id="action_taken"
                    value={formData.action_taken}
                    onChange={(e) => setFormData({ ...formData, action_taken: e.target.value })}
                    placeholder="What action was taken..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? 'Creating...' : 'Create Record'}
                </Button>
                <Link href={`/app/${params.schoolSlug}/discipline`}>
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
