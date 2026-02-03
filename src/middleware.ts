import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { config as appConfig } from '@/lib/config';

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/features',
    '/pricing',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/auth/callback',
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith('/api/public')
  );

  // Allow public routes
  if (isPublicRoute) {
    return response;
  }

  // If Supabase is not configured, redirect to login for protected routes
  if (!supabase) {
    const redirectUrl = new URL('/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Check if user is authenticated for protected routes
  if (!user && (pathname.startsWith('/app') || pathname.startsWith('/superadmin'))) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Super admin routes
  if (pathname.startsWith('/superadmin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_super_admin')
      .eq('id', user!.id)
      .single();

    if (!profile?.is_super_admin) {
      return NextResponse.redirect(new URL('/app', request.url));
    }
  }

  // SaaS mode: require school slug in URL
  if (appConfig.isSaas() && pathname.startsWith('/app/')) {
    const pathParts = pathname.split('/');
    const schoolSlug = pathParts[2];

    if (!schoolSlug || schoolSlug === 'undefined') {
      // Redirect to school selection or first available school
      const { data: memberships } = await supabase
        .from('school_memberships')
        .select('school:schools(slug)')
        .eq('user_id', user!.id)
        .eq('is_active', true)
        .limit(1);

      if (memberships && memberships.length > 0 && memberships[0].school) {
        const firstSchool = memberships[0].school as { slug: string };
        return NextResponse.redirect(
          new URL(`/app/${firstSchool.slug}/dashboard`, request.url)
        );
      }

      // No schools, redirect to onboarding or error
      return NextResponse.redirect(new URL('/app/no-school', request.url));
    }

    // Verify user has access to this school
    const { data: school } = await supabase
      .from('schools')
      .select('id')
      .eq('slug', schoolSlug)
      .single();

    if (!school) {
      return NextResponse.redirect(new URL('/app/school-not-found', request.url));
    }

    const { data: membership } = await supabase
      .from('school_memberships')
      .select('id, role')
      .eq('user_id', user!.id)
      .eq('school_id', school.id)
      .eq('is_active', true)
      .single();

    // Check if super admin (they have access to all schools)
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_super_admin')
      .eq('id', user!.id)
      .single();

    if (!membership && !profile?.is_super_admin) {
      return NextResponse.redirect(new URL('/app/access-denied', request.url));
    }
  }

  // Self-hosted mode: lock to configured school
  if (appConfig.isSelfHosted() && pathname.startsWith('/app')) {
    const schoolId = appConfig.selfHosted.schoolId;

    if (!schoolId) {
      // First-time setup needed
      if (!pathname.startsWith('/app/setup')) {
        return NextResponse.redirect(new URL('/app/setup', request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
