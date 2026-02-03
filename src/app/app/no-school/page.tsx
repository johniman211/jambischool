'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Building2, Plus, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function NoSchoolPage() {
  const [schoolName, setSchoolName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({ title: 'Error', description: 'You must be logged in', variant: 'destructive' });
        router.push('/login');
        return;
      }

      // Create slug from school name
      const slug = schoolName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Create the school
      const { data: school, error: schoolError } = await (supabase as any)
        .from('schools')
        .insert({
          name: schoolName,
          slug: slug,
          settings: {},
        })
        .select()
        .single();

      if (schoolError) {
        if (schoolError.code === '23505') {
          toast({ title: 'Error', description: 'A school with this name already exists', variant: 'destructive' });
        } else {
          toast({ title: 'Error', description: schoolError.message, variant: 'destructive' });
        }
        setLoading(false);
        return;
      }

      // Create school membership for the user as admin
      const { error: membershipError } = await (supabase as any)
        .from('school_memberships')
        .insert({
          user_id: user.id,
          school_id: school.id,
          role: 'school_admin',
          is_active: true,
        });

      if (membershipError) {
        toast({ title: 'Error', description: 'Failed to set up your admin access', variant: 'destructive' });
        setLoading(false);
        return;
      }

      toast({ title: 'Success!', description: 'Your school has been created' });
      router.push(`/app/${slug}/dashboard`);
      router.refresh();
    } catch (err) {
      toast({ title: 'Error', description: 'An unexpected error occurred', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4"
            >
              <Building2 className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl">Welcome to Jambi School!</CardTitle>
            <CardDescription>
              You don't have a school yet. Create one to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSchool} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  placeholder="Enter your school name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  This will be the name displayed throughout the system
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? 'Creating...' : <><Plus className="h-4 w-4" /> Create School</>}
                </Button>
              </motion.div>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Or if you were invited to a school, ask your administrator to add you.
              </p>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
