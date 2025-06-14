
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

export default function DashboardPage() {
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
      color: 'bg-blue-500',
    },
    {
      title: t('dashboard.totalCourses'),
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-green-500',
    },
    {
      title: t('dashboard.totalExams'),
      value: stats.totalExams,
      icon: FileText,
      color: 'bg-yellow-500',
    },
    {
      title: t('dashboard.totalPayments'),
      value: stats.totalPayments,
      icon: CreditCard,
      color: 'bg-red-500',
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
      <div className="min-h-screen bg-gray-50">
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
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">
                      {getGreeting()}, {user?.name || 'User'}!
                    </h1>
                    <p className="text-blue-100 text-sm">
                      {t('dashboard.welcome')} English Mania by KruYam
                    </p>
                    <p className="text-blue-100 text-xs mt-1 capitalize">
                      {user?.role?.role_name} Dashboard
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Activity className="h-8 w-8 text-white" />
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
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <span>{t('dashboard.recentActivity')}</span>
                      </CardTitle>
                      <CardDescription>
                        Latest updates and activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              System initialized successfully
                            </p>
                            <p className="text-xs text-gray-500">Just now</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
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
                        <FileText className="h-5 w-5 text-green-600" />
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
                              className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center"
                            >
                              <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                              <p className="text-xs font-medium text-blue-900">
                                {t('nav.students')}
                              </p>
                            </a>
                            <a
                              href="/exams"
                              className="p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center"
                            >
                              <FileText className="h-6 w-6 text-green-600 mx-auto mb-1" />
                              <p className="text-xs font-medium text-green-900">
                                {t('nav.exams')}
                              </p>
                            </a>
                          </>
                        )}
                        <a
                          href="/courses"
                          className="p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-center"
                        >
                          <BookOpen className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                          <p className="text-xs font-medium text-yellow-900">
                            {t('nav.courses')}
                          </p>
                        </a>
                        <a
                          href="/payments"
                          className="p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-center"
                        >
                          <CreditCard className="h-6 w-6 text-red-600 mx-auto mb-1" />
                          <p className="text-xs font-medium text-red-900">
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
