'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Save, Upload } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function SchoolProfilePage() {
  const params = useParams();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    motto: '',
  });

  useEffect(() => {
    const fetchSchool = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('schools')
        .select('*')
        .eq('slug', params.schoolSlug)
        .single();
      
      if (data) {
        setSchoolId(data.id);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          website: data.website || '',
          address: data.address || '',
          motto: (data.settings as Record<string, string>)?.motto || '',
        });
      }
      setLoading(false);
    };
    fetchSchool();
  }, [params.schoolSlug]);

  const handleSave = async () => {
    if (!schoolId) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          address: formData.address,
          settings: { motto: formData.motto },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update school profile');
      }

      toast({
        title: 'Profile updated',
        description: 'School profile has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">School Profile</h1>
        <p className="text-muted-foreground">Manage your school's basic information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" /> School Information
            </CardTitle>
            <CardDescription>Update your school's profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                <Building2 className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" /> Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: 200x200px, PNG or JPG
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">School Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter school name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="school@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="+1 234 567 890" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  placeholder="https://www.school.com" 
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                placeholder="Enter school address" 
                rows={3} 
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motto">School Motto</Label>
              <Input 
                id="motto" 
                placeholder="Enter school motto" 
                value={formData.motto}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
              />
            </div>

            <Button className="gap-2" disabled={saving} onClick={handleSave}>
              <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
