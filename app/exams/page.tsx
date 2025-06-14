
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { ExamCard } from '@/components/exams/exam-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/lib/auth';
import { useLanguageStore } from '@/lib/translations';
import { apiClient } from '@/lib/api';
import { Exam } from '@/lib/types';
import { 
  Plus, 
  Search, 
  FileText, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExamsPage() {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.role?.role_name === 'admin';
  const isTeacher = user?.role?.role_name === 'teacher';
  const isStudent = user?.role?.role_name === 'student';

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    const filtered = exams.filter(exam =>
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exam.description && exam.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredExams(filtered);
  }, [exams, searchTerm]);

  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getExams();
      setExams(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exams');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeExam = async (examId: number) => {
    try {
      const studentExam = await apiClient.startExam(examId);
      router.push(`/exams/${examId}/take?student_exam_id=${studentExam.student_exam_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start exam');
    }
  };

  const handleViewResults = (examId: number) => {
    router.push(`/exams/${examId}/results`);
  };

  const handleCreateExam = () => {
    router.push('/exams/create');
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
                    <FileText className="h-6 w-6 text-blue-600" />
                    <span>{t('exams.title')}</span>
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {isStudent 
                      ? 'Take exams and view your results'
                      : 'Manage exams and monitor student progress'
                    }
                  </p>
                </div>
                {(isAdmin || isTeacher) && (
                  <Button onClick={handleCreateExam} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('exams.createExam')}
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
                  placeholder={`${t('common.search')} ${t('exams.title').toLowerCase()}...`}
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
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">{t('common.loading')}</span>
                </div>
              )}

              {/* Exams Grid */}
              {!isLoading && (
                <>
                  {filteredExams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredExams.map((exam, index) => (
                        <ExamCard
                          key={exam.exam_id}
                          exam={exam}
                          onTakeExam={isStudent ? handleTakeExam : undefined}
                          onViewResults={handleViewResults}
                          index={index}
                        />
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
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <CardTitle className="text-gray-600">
                            {searchTerm ? 'No exams found' : 'No exams available'}
                          </CardTitle>
                          <CardDescription>
                            {searchTerm 
                              ? `No exams match "${searchTerm}". Try a different search term.`
                              : isAdmin || isTeacher
                              ? 'Create your first exam to get started.'
                              : 'No exams are currently available.'
                            }
                          </CardDescription>
                        </CardHeader>
                        {!searchTerm && (isAdmin || isTeacher) && (
                          <CardContent className="text-center">
                            <Button onClick={handleCreateExam} className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="h-4 w-4 mr-2" />
                              {t('exams.createExam')}
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
