import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, CreditCard, TrendingUp } from 'lucide-react';

export default async function SuperAdminDashboard() {
  const supabase = await createClient();

  // Get platform stats
  const { count: schoolCount } = await supabase
    .from('schools')
    .select('*', { count: 'exact', head: true });

  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: studentCount } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true });

  // Get recent schools
  const { data: recentSchools } = await supabase
    .from('schools')
    .select('id, name, slug, created_at, is_active')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Dashboard</h1>
        <p className="text-muted-foreground">Overview of the Jambi School platform</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolCount || 0}</div>
            <p className="text-xs text-muted-foreground">Active schools on platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount || 0}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentCount || 0}</div>
            <p className="text-xs text-muted-foreground">Across all schools</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Schools */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Schools</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSchools && recentSchools.length > 0 ? (
            <div className="space-y-4">
              {recentSchools.map((school) => (
                <div key={school.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{school.name}</p>
                    <p className="text-sm text-muted-foreground">/{school.slug}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${school.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {school.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(school.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No schools registered yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
