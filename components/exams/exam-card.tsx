
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Exam } from '@/lib/types';
import { useLanguageStore } from '@/lib/translations';
import { useAuthStore } from '@/lib/auth';
import { FileText, Clock, Calendar, Play, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { th, enUS } from 'date-fns/locale';

interface ExamCardProps {
  exam: Exam;
  onTakeExam?: (examId: number) => void;
  onViewResults?: (examId: number) => void;
  index: number;
}

export function ExamCard({ exam, onTakeExam, onViewResults, index }: ExamCardProps) {
  const { t, language } = useLanguageStore();
  const { user } = useAuthStore();

  const isStudent = user?.role?.role_name === 'student';
  const isActive = exam.status === 'active';
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy', { 
      locale: language === 'th' ? th : enUS 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-zinc-200';
      default:
        return 'bg-gray-100 text-gray-800 border-zinc-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {exam.name}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(exam.status)}
                >
                  {t(`exams.${exam.status}`)}
                </Badge>
              </div>
            </div>
          </div>
          {exam.description && (
            <CardDescription className="text-sm text-gray-600 line-clamp-2 mt-2">
              {exam.description}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Exam Details */}
          <div className="space-y-2">
            {exam.start_date && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-green-500" />
                <span>{t('exams.startDate')}: {formatDate(exam.start_date)}</span>
              </div>
            )}
            {exam.end_date && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-red-500" />
                <span>{t('exams.endDate')}: {formatDate(exam.end_date)}</span>
              </div>
            )}
            {exam.questions && (
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                <span>{exam.questions.length} {t('exams.questions')}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            {isStudent && isActive && onTakeExam && (
              <Button
                onClick={() => onTakeExam(exam.exam_id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                {t('exams.takeExam')}
              </Button>
            )}
            
            {onViewResults && (
              <Button
                onClick={() => onViewResults(exam.exam_id)}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                {t('exams.viewResults')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
