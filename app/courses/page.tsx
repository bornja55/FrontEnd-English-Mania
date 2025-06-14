
'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/lib/auth';
import { useLanguageStore } from '@/lib/translations';
import { apiClient } from '@/lib/api';
import { Course } from '@/lib/types';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Loader2,
  AlertCircle,
  Calendar,
  User,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { th, enUS } from 'date-fns/locale';

export default function CoursesPage() {
  const { user } = useAuthStore();
  const { t, language } = useLanguageStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.role?.role_name === 'admin';
  const isTeacher = user?.role?.role_name === 'teacher';
  const isStudent = user?.role?.role_name === 'student';

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.teacher && `${course.teacher.first_name} ${course.teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCourses(filtered);
  }, [courses, searchTerm]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getCourses();
      setCourses(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy', { 
      locale: language === 'th' ? th : enUS 
    });
  };

  const handleCreateCourse = () => {
    // In a real app, this would open a modal or navigate to a form
    console.log('Create course');
  };

  const handleEnrollCourse = async (courseId: number) => {
    if (!user?.student_id) {
      setError('Student ID not found');
      return;
    }

    try {
      await apiClient.createEnrollment({
        student_id: user.student_id,
        course_id: courseId
      });
      // Show success message or redirect
      console.log('Enrolled successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enroll in course');
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
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
              >
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <BookOpen className="h-6 w-6 text-green-600" />
                    <span>{t('courses.title')}</span>
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {isStudent 
                      ? 'Browse and enroll in available courses'
                      : 'Manage courses and track student enrollment'
                    }
                  </p>
                </div>
                {(isAdmin || isTeacher) && (
                  <Button onClick={handleCreateCourse} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Course
                  </Button>
                )}
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
                  placeholder={`${t('common.search')} ${t('courses.title').toLowerCase()}...`}
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
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  <span className="ml-2 text-gray-600">{t('common.loading')}</span>
                </div>
              )}

              {/* Courses Grid */}
              {!isLoading && (
                <>
                  {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCourses.map((course, index) => (
                        <motion.div
                          key={course.course_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="p-2 rounded-lg bg-green-100">
                                    <BookOpen className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                                      {course.name}
                                    </CardTitle>
                                  </div>
                                </div>
                              </div>
                              {course.description && (
                                <CardDescription className="text-sm text-gray-600 line-clamp-2 mt-2">
                                  {course.description}
                                </CardDescription>
                              )}
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                              {/* Course Details */}
                              <div className="space-y-2">
                                {course.teacher && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <User className="h-4 w-4 mr-2 text-blue-500" />
                                    <span>{t('courses.teacher')}: {course.teacher.first_name} {course.teacher.last_name}</span>
                                  </div>
                                )}
                                {course.start_date && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2 text-green-500" />
                                    <span>Start: {formatDate(course.start_date)}</span>
                                  </div>
                                )}
                                {course.end_date && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2 text-red-500" />
                                    <span>End: {formatDate(course.end_date)}</span>
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                {isStudent && (
                                  <Button
                                    onClick={() => handleEnrollCourse(course.course_id)}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    size="sm"
                                  >
                                    <Users className="h-4 w-4 mr-2" />
                                    {t('courses.enroll')}
                                  </Button>
                                )}
                                
                                <Button
                                  variant="outline"
                                  className="flex-1"
                                  size="sm"
                                >
                                  {t('common.view')} Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Card>
                        <CardHeader className="text-center">
                          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <CardTitle className="text-gray-600">
                            {searchTerm ? 'No courses found' : 'No courses available'}
                          </CardTitle>
                          <CardDescription>
                            {searchTerm 
                              ? `No courses match "${searchTerm}". Try a different search term.`
                              : isAdmin || isTeacher
                              ? 'Create your first course to get started.'
                              : 'No courses are currently available.'
                            }
                          </CardDescription>
                        </CardHeader>
                        {!searchTerm && (isAdmin || isTeacher) && (
                          <CardContent className="text-center">
                            <Button onClick={handleCreateCourse} className="bg-green-600 hover:bg-green-700">
                              <Plus className="h-4 w-4 mr-2" />
                              Create Course
                            </Button>
                          </CardContent>
                        )}
                      </Card>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
