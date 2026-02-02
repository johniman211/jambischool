import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Bell, Shield, Palette, Globe } from 'lucide-react';

interface SettingsPageProps {
  params: { schoolSlug: string };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const supabase = await createClient();

  const { data: school } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', params.schoolSlug)
    .single();

  if (!school) {
    return <div>School not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your school settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Academic
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>Basic information about your school</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name</Label>
                  <Input id="name" defaultValue={school.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input id="slug" defaultValue={school.slug} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={school.email || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue={school.phone || ''} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue={school.address || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue={school.website || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select 
                    id="currency" 
                    defaultValue={school.currency || 'USD'}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="SSP">SSP - South Sudanese Pound</option>
                    <option value="KES">KES - Kenyan Shilling</option>
                    <option value="UGX">UGX - Ugandan Shilling</option>
                    <option value="TZS">TZS - Tanzanian Shilling</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Academic Settings</CardTitle>
              <CardDescription>Configure academic year and grading settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="grading">Grading System</Label>
                  <select 
                    id="grading"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="percentage">Percentage (0-100)</option>
                    <option value="letter">Letter Grades (A-F)</option>
                    <option value="points">Grade Points (0-4)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passmark">Pass Mark (%)</Label>
                  <Input id="passmark" type="number" defaultValue="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attendance">Minimum Attendance (%)</Label>
                  <Input id="attendance" type="number" defaultValue="75" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms per Year</Label>
                  <select 
                    id="terms"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="2">2 Semesters</option>
                    <option value="3">3 Terms</option>
                    <option value="4">4 Quarters</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Fee Reminders</p>
                    <p className="text-sm text-muted-foreground">Automatic fee payment reminders</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Attendance Alerts</p>
                    <p className="text-sm text-muted-foreground">Alert parents of absences</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin users</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
                  </div>
                  <select className="h-10 rounded-md border border-input bg-background px-3 py-2">
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="480">8 hours</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <select 
                    id="theme"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Primary Color</Label>
                  <select 
                    id="color"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
