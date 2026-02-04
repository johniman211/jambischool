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
import { ArrowLeft, Save, Layers } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function NewFeeStructurePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    class_id: '',
    term: '',
    amount: '',
    fee_type: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement fee structure creation logic with Supabase
      toast({
        title: 'Fee structure created',
        description: 'The fee structure has been successfully created.',
      });
      router.push(`/app/${params.schoolSlug}/fees/structures`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create fee structure. Please try again.',
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
        <Link href={`/app/${params.schoolSlug}/fees/structures`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Fee Structure</h1>
          <p className="text-muted-foreground">Define a new fee structure for a class</p>
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
              <Layers className="h-5 w-5" /> Fee Structure Details
            </CardTitle>
            <CardDescription>Enter the fee structure information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Fee Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Tuition Fee, Boarding Fee"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fee_type">Fee Type *</Label>
                  <Select
                    value={formData.fee_type}
                    onValueChange={(value) => setFormData({ ...formData, fee_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tuition">Tuition</SelectItem>
                      <SelectItem value="boarding">Boarding</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="uniform">Uniform</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select
                    value={formData.class_id}
                    onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="placeholder">No classes available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term">Term</Label>
                  <Select
                    value={formData.term}
                    onValueChange={(value) => setFormData({ ...formData, term: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Terms</SelectItem>
                      <SelectItem value="term1">Term 1</SelectItem>
                      <SelectItem value="term2">Term 2</SelectItem>
                      <SelectItem value="term3">Term 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fee structure description..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? 'Creating...' : 'Create Fee Structure'}
                </Button>
                <Link href={`/app/${params.schoolSlug}/fees/structures`}>
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
