'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Send, Inbox, CheckCheck, Plus, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NotificationsPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('inbox');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Manage communications and announcements</p>
        </div>
        <Link href={`/app/${params.schoolSlug}/notifications/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Notification
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <Inbox className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Total Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <CheckCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inbox" className="gap-2">
            <Inbox className="h-4 w-4" /> All Notifications
          </TabsTrigger>
          <TabsTrigger value="sms" className="gap-2">
            <MessageSquare className="h-4 w-4" /> SMS
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" /> Email
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" /> Notification History
                </CardTitle>
                <CardDescription>View all sent notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Notifications Sent</h3>
                  <p className="text-muted-foreground mb-4">
                    Send your first notification to parents or staff
                  </p>
                  <Link href={`/app/${params.schoolSlug}/notifications/new`}>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" /> Create Notification
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
