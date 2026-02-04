import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppSidebar } from '@/components/app/sidebar';
import { AppHeader } from '@/components/app/header';
import { OfflineBanner } from '@/components/app/offline-banner';

interface SchoolLayoutProps {
  children: React.ReactNode;
  params: { schoolSlug: string };
}

export default async function SchoolLayout({ children, params }: SchoolLayoutProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get school by slug
  const { data: school } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', params.schoolSlug)
    .single();

  if (!school) {
    redirect('/app');
  }

  // Get user's membership in this school
  const { data: membership } = await supabase
    .from('school_memberships')
    .select('*, profile:profiles(*)')
    .eq('school_id', school.id)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (!membership) {
    redirect('/app');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-background">
      <OfflineBanner />
      <div className="flex">
        <AppSidebar 
          school={school} 
          membership={membership} 
          profile={profile} 
        />
        <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
          <AppHeader 
            school={school} 
            membership={membership} 
            profile={profile} 
          />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
