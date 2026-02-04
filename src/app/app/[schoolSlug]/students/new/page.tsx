'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NewStudentPageProps {
  params: { schoolSlug: string };
}

export default function NewStudentPage({ params }: NewStudentPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'male',
    nationality: '',
    address: '',
    medical_info: '',
    enrollment_date: new Date().toISOString().split('T')[0],
    // Guardian info
    guardian_name: '',
    guardian_phone: '',
    guardian_email: '',
    guardian_relationship: 'parent',
    guardian_address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      // Get school
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', params.schoolSlug)
        .single();

      if (!school) {
        throw new Error('School not found');
      }

      // Create guardian first - split name into first_name and last_name
      const nameParts = formData.guardian_name.trim().split(' ');
      const guardianFirstName = nameParts[0] || '';
      const guardianLastName = nameParts.slice(1).join(' ') || '';

      const { data: guardian, error: guardianError } = await supabase
        .from('guardians')
        .insert({
          school_id: school.id,
          first_name: guardianFirstName,
          last_name: guardianLastName,
          phone: formData.guardian_phone,
          email: formData.guardian_email || null,
          relationship: formData.guardian_relationship,
          address: formData.guardian_address || null,
        })
        .select()
        .single();

      if (guardianError) throw guardianError;

      // Create student
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({
          school_id: school.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          date_of_birth: formData.date_of_birth || null,
          gender: formData.gender,
          nationality: formData.nationality || null,
          address: formData.address || null,
          medical_info: formData.medical_info || null,
          enrollment_date: formData.enrollment_date,
          guardian_id: guardian.id,
          status: 'active',
        })
        .select()
        .single();

      if (studentError) throw studentError;

      toast({
        title: 'Student Created',
        description: `${formData.first_name} ${formData.last_name} has been enrolled successfully.`,
      });

      router.push(`/app/${params.schoolSlug}/students/${student.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create student',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/app/${params.schoolSlug}/students`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Student</h1>
          <p className="text-muted-foreground">Enroll a new student in the school</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollment_date">Enrollment Date *</Label>
              <Input
                id="enrollment_date"
                name="enrollment_date"
                type="date"
                value={formData.enrollment_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="medical_info">Medical Information</Label>
              <Textarea
                id="medical_info"
                name="medical_info"
                value={formData.medical_info}
                onChange={handleChange}
                rows={2}
                placeholder="Allergies, conditions, etc."
              />
            </div>
          </CardContent>
        </Card>

        {/* Guardian Information */}
        <Card>
          <CardHeader>
            <CardTitle>Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guardian_name">Full Name *</Label>
              <Input
                id="guardian_name"
                name="guardian_name"
                value={formData.guardian_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian_relationship">Relationship *</Label>
              <select
                id="guardian_relationship"
                name="guardian_relationship"
                value={formData.guardian_relationship}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="parent">Parent</option>
                <option value="guardian">Guardian</option>
                <option value="sibling">Sibling</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian_phone">Phone Number *</Label>
              <Input
                id="guardian_phone"
                name="guardian_phone"
                type="tel"
                value={formData.guardian_phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian_email">Email</Label>
              <Input
                id="guardian_email"
                name="guardian_email"
                type="email"
                value={formData.guardian_email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="guardian_address">Address</Label>
              <Textarea
                id="guardian_address"
                name="guardian_address"
                value={formData.guardian_address}
                onChange={handleChange}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href={`/app/${params.schoolSlug}/students`}>
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" loading={loading}>
            Create Student
          </Button>
        </div>
      </form>
    </div>
  );
}
