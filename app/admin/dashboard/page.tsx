'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/auth';
import { useLanguageStore } from '@/lib/translations';
import { apiClient } from '@/lib/api';
import { 
  Users, 
  BookOpen, 
  FileText, 
  CreditCard,
  TrendingUp,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalExams: number;
  totalPayments: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCourses: 0,
    totalExams: 0,
    totalPayments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, courses, exams, payments] = await Promise.allSettled([
          apiClient.getStudents(0, 1000),
          apiClient.getCourses(),
          apiClient.getExams(0, 1000),
          apiClient.getPayments(0, 1000),
        ]);

        setStats({
          totalStudents: students.status === 'fulfilled' ? students.value.length : 0,
          totalCourses: courses.status === 'fulfilled' ? courses.value.length : 0,
          totalExams: exams.status === 'fulfilled' ? exams.value.length : 0,
          totalPayments: payments.status === 'fulfilled' ? payments.value.length : 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: t('dashboard.totalStudents'),
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-primary', // ฟ้าอมเขียว
    },
    {
      title: t('dashboard.totalCourses'),
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-accent', // เหลืองทอง
    },
    {
      title: t('dashboard.totalExams'),
      value: stats.totalExams,
      icon: FileText,
      color: 'bg-em-navy', // navy
    },
    {
      title: t('dashboard.totalPayments'),
      value: stats.totalPayments,
      icon: CreditCard,
      color: 'bg-em-yellow', // เหลืองทอง
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return t('dashboard.goodMorning') || 'Good Morning';
    } else if (hour < 18) {
      return t('dashboard.goodAfternoon') || 'Good Afternoon';
    } else {
      return t('dashboard.goodEvening') || 'Good Evening';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-white">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-64 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-primary via-accent to-em-navy rounded-2xl p-6 text-em-navy shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2 text-white drop-shadow">
                      {getGreeting()}, {user?.name || 'User'}!
                    </h1>
                    <p className="text-accent text-sm font-medium">
                      {t('dashboard.welcome')} English Mania by KruYam
                    </p>
                    <p className="text-primary-foreground text-xs mt-1 capitalize">
                      {user?.role?.role_name} Dashboard
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                      <Activity className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                  <StatsCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                    index={index}
                  />
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <span>{t('dashboard.recentActivity')}</span>
                      </CardTitle>
                      <CardDescription>
                        Latest updates and activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-em-navy">
                              System initialized successfully
                            </p>
                            <p className="text-xs text-gray-500">Just now</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-em-navy">
                              Dashboard loaded
                            </p>
                            <p className="text-xs text-gray-500">1 minute ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-accent" />
                        <span>Quick Actions</span>
                      </CardTitle>
                      <CardDescription>
                        Common tasks and shortcuts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {user?.role?.role_name === 'admin' && (
                          <>
                            <a
                              href="/students"
                              className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-center"
                            >
                              <Users className="h-6 w-6 text-primary mx-auto mb-1" />
                              <p className="text-xs font-medium text-em-navy">
                                {t('nav.students')}
                              </p>
                            </a>
                            <a
                              href="/exams"
                              className="p-3 bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors text-center"
                            >
                              <FileText className="h-6 w-6 text-accent mx-auto mb-1" />
                              <p className="text-xs font-medium text-em-navy">
                                {t('nav.exams')}
                              </p>
                            </a>
                          </>
                        )}
                        <a
                          href="/courses"
                          className="p-3 bg-em-yellow/10 hover:bg-em-yellow/20 rounded-lg transition-colors text-center"
                        >
                          <BookOpen className="h-6 w-6 text-em-yellow mx-auto mb-1" />
                          <p className="text-xs font-medium text-em-navy">
                            {t('nav.courses')}
                          </p>
                        </a>
                        <a
                          href="/payments"
                          className="p-3 bg-em-blue/10 hover:bg-em-blue/20 rounded-lg transition-colors text-center"
                        >
                          <CreditCard className="h-6 w-6 text-em-blue mx-auto mb-1" />
                          <p className="text-xs font-medium text-em-navy">
                            {t('nav.payments')}
                          </p>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}