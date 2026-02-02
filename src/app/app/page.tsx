import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { APP_CONFIG } from '@/lib/config';

export default async function AppPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user's school memberships
  const { data: memberships } = await supabase
    .from('school_memberships')
    .select('school:schools(id, name, slug)')
    .eq('user_id', user.id)
    .eq('is_active', true);

  // If SaaS mode and user has memberships, redirect to their first school
  if (APP_CONFIG.mode === 'saas' && memberships && memberships.length > 0) {
    const firstSchool = memberships[0].school as { slug: string };
    redirect(`/app/${firstSchool.slug}/dashboard`);
  }

  // If self-hosted mode, redirect to dashboard directly
  if (APP_CONFIG.mode === 'self-hosted') {
    redirect('/app/dashboard');
  }

  // SaaS mode with no schools - show onboarding
  redirect('/app/onboarding');
}
