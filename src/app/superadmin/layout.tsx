import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { config } from '@/lib/config';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Settings,
  LogOut,
  Shield
} from 'lucide-react';

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only available in SaaS mode
  if (!config.isSaas()) {
    redirect('/');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user is super admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_super_admin) {
    redirect('/app');
  }

  const navItems = [
    { href: '/superadmin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/superadmin/schools', label: 'Schools', icon: Building2 },
    { href: '/superadmin/users', label: 'Users', icon: Users },
    { href: '/superadmin/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { href: '/superadmin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-bold text-lg">Super Admin</h1>
            <p className="text-xs text-muted-foreground">Jambi School Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
