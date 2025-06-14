
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { ExamTaking } from '@/components/exams/exam-taking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguageStore } from '@/lib/translations';
import { apiClient } from '@/lib/api';
import { Exam, StudentExam } from '@/lib/types';
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Trophy,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TakeExamPageProps {
  params: { id: string };
}

export default function TakeExamPage({ params }: TakeExamPageProps) {
  const { t } = useLanguageStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentExamId = searchParams.get('student_exam_id');
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [studentExam, setStudentExam] = useState<StudentExam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  useEffect(() => {
    if (params.id && studentExamId) {
      fetchExamData();
    } else {
      setError('Missing exam or student exam ID');
      setIsLoading(false);
    }
  }, [params.id, studentExamId]);

  const fetchExamData = async () => {
    try {
      setIsLoading(true);
      const [examData, studentExamData] = await Promise.all([
        apiClient.getExam(parseInt(params.id)),
        studentExamId ? apiClient.getExamResults(parseInt(studentExamId)) : null
      ]);

      setExam(examData);
      if (studentExamData) {
        setStudentExam(studentExamData);
        if (studentExamData.status === 'completed') {
          setIsCompleted(true);
          setFinalScore(studentExamData.score || null);
        }
      }
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exam');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExamComplete = (score?: number) => {
    setIsCompleted(true);
    setFinalScore(score || null);
  };

  const handleBackToExams = () => {
    router.push('/exams');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent work!';
    if (score >= 60) return 'Good job!';
    return 'Keep practicing!';
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center py-20">
            <Card className="max-w-md">
              <CardHeader className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-red-600">Error</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={handleBackToExams} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('common.back')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (isCompleted) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-md"
            >
              <Card className="text-center">
                <CardHeader className="space-y-4">
                  <div className="flex justify-center">
                    {finalScore !== null && finalScore >= 60 ? (
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Trophy className="h-8 w-8 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      {t('exams.completed')}!
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {exam?.name}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {finalScore !== null && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{t('exams.score')}</p>
                      <p className={`text-3xl font-bold ${getScoreColor(finalScore)}`}>
                        {finalScore}%
                      </p>
                      <p className="text-sm text-gray-600">
                        {getScoreMessage(finalScore)}
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col space-y-2">
                    <Button onClick={handleBackToExams} className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t('common.back')} to {t('exams.title')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!exam || !studentExam) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center py-20">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Exam data not found. Please try again.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-6 px-4">
          <ExamTaking
            exam={exam}
            studentExam={studentExam}
            onComplete={handleExamComplete}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
