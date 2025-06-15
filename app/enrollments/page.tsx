
'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguageStore } from '@/lib/translations';
import { apiClient } from '@/lib/api';
import { Enrollment } from '@/lib/types';
import { 
  Search, 
  UserCheck, 
  Loader2,
  AlertCircle,
  Calendar,
  User,
  BookOpen,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { th, enUS } from 'date-fns/locale';

export default function EnrollmentsPage() {
  const { t, language } = useLanguageStore();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  useEffect(() => {
    const filtered = enrollments.filter(enrollment =>
      (enrollment.student && `${enrollment.student.first_name} ${enrollment.student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (enrollment.course && enrollment.course.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      enrollment.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEnrollments(filtered);
  }, [enrollments, searchTerm]);

  const fetchEnrollments = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getEnrollments();
      setEnrollments(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch enrollments');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy', { 
      locale: language === 'th' ? th : enUS 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-zinc-200';
    }
  };

  const handleViewEnrollment = (enrollmentId: number) => {
    // In a real app, this would navigate to enrollment details
    console.log('View enrollment:', enrollmentId);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-64 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
              >
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <UserCheck className="h-6 w-6 text-purple-600" />
                    <span>{t('enrollments.title')}</span>
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Track student course enrollments and status
                  </p>
                </div>
              </motion.div>

              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`${t('common.search')} ${t('enrollments.title').toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </motion.div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Loading */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <span className="ml-2 text-gray-600">{t('common.loading')}</span>
                </div>
              )}

              {/* Enrollments Table */}
              {!isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t('enrollments.title')} ({filteredEnrollments.length})
                      </CardTitle>
                      <CardDescription>
                        {searchTerm 
                          ? `Showing results for "${searchTerm}"`
                          : 'All course enrollments'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {filteredEnrollments.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t('enrollments.student')}</TableHead>
                                <TableHead>{t('enrollments.course')}</TableHead>
                                <TableHead>{t('enrollments.enrollDate')}</TableHead>
                                <TableHead>{t('enrollments.expireDate')}</TableHead>
                                <TableHead>{t('enrollments.status')}</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredEnrollments.map((enrollment, index) => (
                                <motion.tr
                                  key={enrollment.enrollment_id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  className="hover:bg-gray-50"
                                >
                                  <TableCell>
                                    {enrollment.student ? (
                                      <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium">
                                          {enrollment.student.first_name} {enrollment.student.last_name}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 text-sm">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {enrollment.course ? (
                                      <div className="flex items-center space-x-2">
                                        <BookOpen className="h-4 w-4 text-gray-400" />
                                        <span>{enrollment.course.name}</span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 text-sm">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="h-4 w-4 text-green-500" />
                                      <span className="text-sm">
                                        {formatDate(enrollment.enroll_date)}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {enrollment.expire_date ? (
                                      <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-red-500" />
                                        <span className="text-sm">
                                          {formatDate(enrollment.expire_date)}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 text-sm">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Badge 
                                      variant="outline" 
                                      className={getStatusColor(enrollment.status)}
                                    >
                                      {enrollment.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleViewEnrollment(enrollment.enrollment_id)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </motion.tr>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm ? 'No enrollments found' : 'No enrollments yet'}
                          </h3>
                          <p className="text-gray-600">
                            {searchTerm 
                              ? `No enrollments match "${searchTerm}". Try a different search term.`
                              : 'Student enrollments will appear here once they register for courses.'
                            }
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
