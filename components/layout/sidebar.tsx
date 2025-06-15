'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth';
import { useLanguageStore } from '@/lib/translations';
import {
  BookOpen,
  Users,
  FileText,
  CreditCard,
  UserCheck,
  BarChart3,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { t } = useLanguageStore();

  const navigationItems = [
    { 
      href: '/dashboard', 
      label: t('nav.dashboard'), 
      icon: BarChart3,
      roles: ['admin', 'teacher', 'student']
    },
    { 
      href: '/exams', 
      label: t('nav.exams'), 
      icon: FileText,
      roles: ['admin', 'teacher', 'student']
    },
    { 
      href: '/courses', 
      label: t('nav.courses'), 
      icon: BookOpen,
      roles: ['admin', 'teacher', 'student']
    },
    { 
      href: '/students', 
      label: t('nav.students'), 
      icon: Users,
      roles: ['admin', 'teacher']
    },
    { 
      href: '/enrollments', 
      label: t('nav.enrollments'), 
      icon: UserCheck,
      roles: ['admin', 'teacher', 'student']
    },
    { 
      href: '/payments', 
      label: t('nav.payments'), 
      icon: CreditCard,
      roles: ['admin', 'teacher', 'student']
    },
  ];

  const filteredNavItems = navigationItems.filter(item => {
    if (!user?.role?.role_name) return false;
    return item.roles.includes(user.role.role_name);
  });

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 bg-gradient-to-b from-primary/10 via-accent/10 to-white border-r border-primary/20">
      <div className="flex-1 flex flex-col min-h-0 pt-6">
        <nav className="flex-1 px-4 space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-bold rounded-xl transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary border-r-4 border-primary shadow'
                    : 'text-em-navy hover:text-primary hover:bg-accent/10'
                )}
              >
                <Icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-primary' : 'text-accent group-hover:text-primary'
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}