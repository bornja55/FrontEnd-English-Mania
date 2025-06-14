import { 
  User, 
  AuthResponse, 
  LoginRequest, 
  AdminLoginRequest, 
  RefreshTokenRequest,
  Student,
  StudentCreate,
  Course,
  Enrollment,
  EnrollmentCreate,
  Exam,
  ExamCreate,
  StudentExam,
  StudentAnswerCreate,
  StudentAnswer,
  Payment,
  PaymentCreate,
  Invoice
} from './types';

const API_BASE_URL = 'https://api.englishmaniaasia.com';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    // เปลี่ยนจาก HeadersInit เป็น Record<string, string>
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Authentication
  async loginWithLine(idToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/line/login', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    });
  }

  async loginAdmin(credentials: AdminLoginRequest): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      headers: {},
      body: formData,
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/line/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  // User Management
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users/');
  }

  async updateUserRole(userId: number, roleName: string): Promise<User> {
    return this.request<User>(`/users/${userId}/role?role_name=${roleName}`, {
      method: 'PUT',
    });
  }

  // Student Management
  async createStudent(student: StudentCreate): Promise<Student> {
    return this.request<Student>('/students/', {
      method: 'POST',
      body: JSON.stringify(student),
    });
  }

  async getStudents(skip = 0, limit = 100): Promise<Student[]> {
    return this.request<Student[]>(`/students/?skip=${skip}&limit=${limit}`);
  }

  async getStudent(studentId: number): Promise<Student> {
    return this.request<Student>(`/students/${studentId}`);
  }

  async updateStudent(studentId: number, student: StudentCreate): Promise<Student> {
    return this.request<Student>(`/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(student),
    });
  }

  async deleteStudent(studentId: number): Promise<{ detail: string }> {
    return this.request<{ detail: string }>(`/students/${studentId}`, {
      method: 'DELETE',
    });
  }

  // Course Management
  async getCourses(): Promise<Course[]> {
    return this.request<Course[]>('/courses/');
  }

  // Enrollment Management
  async createEnrollment(enrollment: EnrollmentCreate): Promise<Enrollment> {
    return this.request<Enrollment>('/enrollments/', {
      method: 'POST',
      body: JSON.stringify(enrollment),
    });
  }

  async getEnrollments(skip = 0, limit = 100): Promise<Enrollment[]> {
    return this.request<Enrollment[]>(`/enrollments/?skip=${skip}&limit=${limit}`);
  }

  async getEnrollment(enrollmentId: number): Promise<Enrollment> {
    return this.request<Enrollment>(`/enrollments/${enrollmentId}`);
  }

  async updateEnrollment(enrollmentId: number, enrollment: EnrollmentCreate): Promise<Enrollment> {
    return this.request<Enrollment>(`/enrollments/${enrollmentId}`, {
      method: 'PUT',
      body: JSON.stringify(enrollment),
    });
  }

  async deleteEnrollment(enrollmentId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/enrollments/${enrollmentId}`, {
      method: 'DELETE',
    });
  }

  // Exam Management
  async createExam(exam: ExamCreate): Promise<Exam> {
    return this.request<Exam>('/exams/', {
      method: 'POST',
      body: JSON.stringify(exam),
    });
  }

  async getExams(skip = 0, limit = 100): Promise<Exam[]> {
    return this.request<Exam[]>(`/exams/?skip=${skip}&limit=${limit}`);
  }

  async getExam(examId: number): Promise<Exam> {
    return this.request<Exam>(`/exams/${examId}`);
  }

  async startExam(examId: number): Promise<StudentExam> {
    return this.request<StudentExam>(`/exams/${examId}/start`, {
      method: 'POST',
    });
  }

  async submitAnswer(studentExamId: number, answer: StudentAnswerCreate): Promise<StudentAnswer> {
    return this.request<StudentAnswer>(`/student_exams/${studentExamId}/answers`, {
      method: 'POST',
      body: JSON.stringify(answer),
    });
  }

  async getExamResults(studentExamId: number): Promise<StudentExam> {
    return this.request<StudentExam>(`/student_exams/${studentExamId}/results`);
  }

  // Payment Management
  async createPayment(payment: PaymentCreate): Promise<Payment> {
    return this.request<Payment>('/payments/', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  async getPayments(skip = 0, limit = 100): Promise<Payment[]> {
    return this.request<Payment[]>(`/payments/?skip=${skip}&limit=${limit}`);
  }

  async getPayment(paymentId: number): Promise<Payment> {
    return this.request<Payment>(`/payments/${paymentId}`);
  }

  // Invoice Management
  async getInvoices(skip = 0, limit = 100): Promise<Invoice[]> {
    return this.request<Invoice[]>(`/invoices/?skip=${skip}&limit=${limit}`);
  }

  async getInvoice(invoiceId: number): Promise<Invoice> {
    return this.request<Invoice>(`/invoices/${invoiceId}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);