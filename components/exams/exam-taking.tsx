
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Exam, Question, StudentExam, StudentAnswerCreate } from '@/lib/types';
import { useLanguageStore } from '@/lib/translations';
import { apiClient } from '@/lib/api';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  AlertCircle,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExamTakingProps {
  exam: Exam;
  studentExam: StudentExam;
  onComplete: (score?: number) => void;
}

export function ExamTaking({ exam, studentExam, onComplete }: ExamTakingProps) {
  const { t } = useLanguageStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, StudentAnswerCreate>>({});
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour default
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const questions = exam.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, answer: StudentAnswerCreate) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Submit all answers
      for (const [questionId, answer] of Object.entries(answers)) {
        await apiClient.submitAnswer(studentExam.student_exam_id, {
          ...answer,
          question_id: parseInt(questionId)
        });
      }

      // Get results
      const results = await apiClient.getExamResults(studentExam.student_exam_id);
      onComplete(results.score);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit exam');
      setIsSubmitting(false);
    }
  };

  const isAnswered = (questionId: number) => {
    return questionId in answers;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600">No questions available for this exam.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                {exam.name}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {t('exams.questions')} {currentQuestionIndex + 1} / {questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{getAnsweredCount()} / {questions.length}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-red-500" />
                <span className={timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('exams.questions')} {currentQuestionIndex + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Text */}
              <div className="prose max-w-none">
                <p className="text-gray-900 text-base leading-relaxed">
                  {currentQuestion.question_text}
                </p>
              </div>

              {/* Media */}
              {currentQuestion.media_url && (
                <div className="flex justify-center">
                  <div className="relative max-w-md">
                    <img
                      src={currentQuestion.media_url}
                      alt="Question media"
                      className="rounded-lg shadow-md max-w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-4">
                {currentQuestion.question_type === 'multiple_choice' && currentQuestion.choices ? (
                  <RadioGroup
                    value={answers[currentQuestion.question_id]?.choice_id?.toString() || ''}
                    onValueChange={(value) => {
                      handleAnswerChange(currentQuestion.question_id, {
                        question_id: currentQuestion.question_id,
                        choice_id: parseInt(value)
                      });
                    }}
                  >
                    {currentQuestion.choices.map((choice, index) => (
                      <div key={choice.choice_id} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={choice.choice_id.toString()} 
                          id={`choice-${choice.choice_id}`}
                        />
                        <Label 
                          htmlFor={`choice-${choice.choice_id}`}
                          className="flex-1 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-700 mr-2">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {choice.choice_text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="answer-text">Your Answer:</Label>
                    <Input
                      id="answer-text"
                      value={answers[currentQuestion.question_id]?.answer_text || ''}
                      onChange={(e) => {
                        handleAnswerChange(currentQuestion.question_id, {
                          question_id: currentQuestion.question_id,
                          answer_text: e.target.value
                        });
                      }}
                      placeholder="Type your answer here..."
                      className="text-base"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('common.previous')}
            </Button>

            <div className="flex items-center space-x-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : isAnswered(questions[index].question_id)
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? t('common.loading') : t('exams.submit')}
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="w-full sm:w-auto"
              >
                {t('common.next')}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
