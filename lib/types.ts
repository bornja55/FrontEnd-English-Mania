
// API Response Types
export interface User {
  user_id: number;
  username?: string;
  email?: string;
  name?: string;
  line_user_id?: string;
  role_id: number;
  role?: Role;
  student_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  role_id: number;
  role_name: string;
}

export interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  line_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  course_id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  teacher_id?: number;
  teacher?: Teacher;
}

export interface Teacher {
  teacher_id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}

export interface Enrollment {
  enrollment_id: number;
  student_id: number;
  course_id: number;
  enroll_date: string;
  expire_date?: string;
  status: string;
  student?: Student;
  course?: Course;
}

export interface Exam {
  exam_id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: string;
  questions?: Question[];
}

export interface Question {
  question_id: number;
  exam_id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'fill_in_blank';
  media_url?: string;
  choices?: Choice[];
}

export interface Choice {
  choice_id: number;
  question_id: number;
  choice_text: string;
  is_correct: boolean;
}

export interface StudentExam {
  student_exam_id: number;
  student_id: number;
  exam_id: number;
  started_at: string;
  finished_at?: string;
  status: 'in_progress' | 'completed';
  score?: number;
  exam?: Exam;
}

export interface StudentAnswer {
  student_answer_id: number;
  student_exam_id: number;
  question_id: number;
  choice_id?: number;
  answer_text?: string;
  is_correct?: boolean;
}

export interface Payment {
  payment_id: number;
  enrollment_id: number;
  invoice_id?: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  slip_url?: string;
  status: string;
  payment_status: string;
}

export interface Invoice {
  invoice_id: number;
  student_id: number;
  enrollment_id: number;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  description?: string;
  status: string;
}

// API Request Types
export interface LoginRequest {
  id_token: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}

export interface StudentCreate {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  line_id?: string;
}

export interface EnrollmentCreate {
  student_id: number;
  course_id: number;
}

export interface ExamCreate {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: string;
}

export interface StudentAnswerCreate {
  question_id: number;
  choice_id?: number;
  answer_text?: string;
}

export interface PaymentCreate {
  enrollment_id: number;
  invoice_id?: number;
  amount: number;
  payment_method: string;
  slip_url?: string;
}

// UI State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ExamState {
  currentExam: Exam | null;
  currentStudentExam: StudentExam | null;
  currentQuestionIndex: number;
  answers: Record<number, StudentAnswerCreate>;
  timeRemaining: number;
  isSubmitting: boolean;
}

// Language Types
export type Language = 'th' | 'en';

export interface Translations {
  [key: string]: {
    th: string;
    en: string;
  };
}
