'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  CreditCard,
  UserCog,
  Clock,
  FileText,
  Bell,
  Settings,
  BarChart3,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { hasPermission, ROLE_PERMISSIONS, type UserRole } from '@/lib/config';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  school: {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
  };
  membership: {
    role: UserRole;
  };
  profile: {
    full_name: string;
    avatar_url?: string;
  } | null;
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    permission: null,
  },
  {
    title: 'Students',
    href: '/students',
    icon: Users,
    permission: 'students:read' as const,
  },
  {
    title: 'Attendance',
    href: '/attendance',
    icon: Calendar,
    permission: 'attendance:read' as const,
  },
  {
    title: 'Academics',
    href: '/academics',
    icon: BookOpen,
    permission: 'academics:read' as const,
    children: [
      { title: 'Exams', href: '/academics/exams' },
      { title: 'Marks Entry', href: '/academics/marks' },
      { title: 'Report Cards', href: '/academics/report-cards' },
    ],
  },
  {
    title: 'Fees & Finance',
    href: '/fees',
    icon: CreditCard,
    permission: 'finance:read' as const,
    children: [
      { title: 'Invoices', href: '/fees/invoices' },
      { title: 'Payments', href: '/fees/payments' },
      { title: 'Fee Structures', href: '/fees/structures' },
    ],
  },
  {
    title: 'Staff',
    href: '/staff',
    icon: UserCog,
    permission: 'staff:read' as const,
  },
  {
    title: 'Timetable',
    href: '/timetable',
    icon: Clock,
    permission: 'timetable:read' as const,
  },
  {
    title: 'Discipline',
    href: '/discipline',
    icon: FileText,
    permission: 'discipline:read' as const,
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
    permission: 'notifications:read' as const,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
    permission: 'reports:read' as const,
  },
  {
    title: 'School Setup',
    href: '/settings',
    icon: Settings,
    permission: 'settings:read' as const,
    children: [
      { title: 'School Profile', href: '/settings/profile' },
      { title: 'Academic Years', href: '/settings/academic-years' },
      { title: 'Classes', href: '/settings/classes' },
      { title: 'Subjects', href: '/settings/subjects' },
    ],
  },
];

export function AppSidebar({ school, membership, profile }: SidebarProps) {
  const pathname = usePathname();
  const basePath = `/app/${school.slug}`;

  const filteredNavigation = navigationItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(membership.role, item.permission);
  });

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b">
        {school.logo_url ? (
          <img src={school.logo_url} alt={school.name} className="h-8 w-8 rounded" />
        ) : (
          <Building2 className="h-8 w-8 text-primary" />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{school.name}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname.startsWith(`${basePath}${item.href}`);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={`${basePath}${item.href}`}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.title}</span>
                  {item.children && (
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  )}
                </Link>
                {item.children && isActive && (
                  <ul className="mt-1 ml-8 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={`${basePath}${child.href}`}
                          className={cn(
                            'block px-3 py-1.5 rounded-md text-sm transition-colors',
                            pathname === `${basePath}${child.href}`
                              ? 'text-primary font-medium'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
            {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-muted-foreground capitalize">{membership.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
