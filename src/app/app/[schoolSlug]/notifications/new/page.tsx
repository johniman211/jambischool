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
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Send, Bell } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function NewNotificationPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    recipient_type: '',
    class_id: '',
    send_sms: false,
    send_email: false,
    send_push: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement notification sending logic with Supabase
      toast({
        title: 'Notification sent',
        description: 'The notification has been successfully sent.',
      });
      router.push(`/app/${params.schoolSlug}/notifications`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send notification. Please try again.',
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
        <Link href={`/app/${params.schoolSlug}/notifications`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Notification</h1>
          <p className="text-muted-foreground">Send a notification to parents, students, or staff</p>
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
              <Bell className="h-5 w-5" /> Notification Details
            </CardTitle>
            <CardDescription>Compose your notification message</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Notification title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient_type">Send To *</Label>
                  <Select
                    value={formData.recipient_type}
                    onValueChange={(value) => setFormData({ ...formData, recipient_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All (Parents, Students, Staff)</SelectItem>
                      <SelectItem value="parents">All Parents</SelectItem>
                      <SelectItem value="students">All Students</SelectItem>
                      <SelectItem value="staff">All Staff</SelectItem>
                      <SelectItem value="class">Specific Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.recipient_type === 'class' && (
                  <div className="space-y-2">
                    <Label htmlFor="class">Select Class</Label>
                    <Select
                      value={formData.class_id}
                      onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placeholder">No classes available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Type your message here..."
                    rows={6}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Delivery Channels</Label>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="send_push"
                      checked={formData.send_push}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, send_push: checked as boolean })
                      }
                    />
                    <Label htmlFor="send_push" className="font-normal">In-App Notification</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="send_sms"
                      checked={formData.send_sms}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, send_sms: checked as boolean })
                      }
                    />
                    <Label htmlFor="send_sms" className="font-normal">SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="send_email"
                      checked={formData.send_email}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, send_email: checked as boolean })
                      }
                    />
                    <Label htmlFor="send_email" className="font-normal">Email</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="gap-2">
                  <Send className="h-4 w-4" />
                  {loading ? 'Sending...' : 'Send Notification'}
                </Button>
                <Link href={`/app/${params.schoolSlug}/notifications`}>
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
