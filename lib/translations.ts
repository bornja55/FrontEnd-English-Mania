
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Translations } from './types';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Translations = {
  // Navigation
  'nav.dashboard': { th: 'แดชบอร์ด', en: 'Dashboard' },
  'nav.exams': { th: 'ข้อสอบ', en: 'Exams' },
  'nav.courses': { th: 'คอร์สเรียน', en: 'Courses' },
  'nav.students': { th: 'นักเรียน', en: 'Students' },
  'nav.enrollments': { th: 'การลงทะเบียน', en: 'Enrollments' },
  'nav.payments': { th: 'การชำระเงิน', en: 'Payments' },
  'nav.profile': { th: 'โปรไฟล์', en: 'Profile' },
  'nav.logout': { th: 'ออกจากระบบ', en: 'Logout' },

  // Authentication
  'auth.login': { th: 'เข้าสู่ระบบ', en: 'Login' },
  'auth.loginWithLine': { th: 'เข้าสู่ระบบด้วย LINE', en: 'Login with LINE' },
  'auth.adminLogin': { th: 'เข้าสู่ระบบผู้ดูแล', en: 'Admin Login' },
  'auth.username': { th: 'ชื่อผู้ใช้', en: 'Username' },
  'auth.password': { th: 'รหัสผ่าน', en: 'Password' },
  'auth.loginButton': { th: 'เข้าสู่ระบบ', en: 'Sign In' },
  'auth.loginError': { th: 'เข้าสู่ระบบไม่สำเร็จ', en: 'Login failed' },

  // Dashboard
  'dashboard.welcome': { th: 'ยินดีต้อนรับ', en: 'Welcome' },
  'dashboard.totalStudents': { th: 'นักเรียนทั้งหมด', en: 'Total Students' },
  'dashboard.totalCourses': { th: 'คอร์สทั้งหมด', en: 'Total Courses' },
  'dashboard.totalExams': { th: 'ข้อสอบทั้งหมด', en: 'Total Exams' },
  'dashboard.recentActivity': { th: 'กิจกรรมล่าสุด', en: 'Recent Activity' },

  // Exams
  'exams.title': { th: 'ข้อสอบ', en: 'Exams' },
  'exams.createExam': { th: 'สร้างข้อสอบ', en: 'Create Exam' },
  'exams.examName': { th: 'ชื่อข้อสอบ', en: 'Exam Name' },
  'exams.description': { th: 'รายละเอียด', en: 'Description' },
  'exams.startDate': { th: 'วันที่เริ่ม', en: 'Start Date' },
  'exams.endDate': { th: 'วันที่สิ้นสุด', en: 'End Date' },
  'exams.status': { th: 'สถานะ', en: 'Status' },
  'exams.active': { th: 'เปิดใช้งาน', en: 'Active' },
  'exams.inactive': { th: 'ปิดใช้งาน', en: 'Inactive' },
  'exams.takeExam': { th: 'ทำข้อสอบ', en: 'Take Exam' },
  'exams.viewResults': { th: 'ดูผลสอบ', en: 'View Results' },
  'exams.questions': { th: 'คำถาม', en: 'Questions' },
  'exams.timeRemaining': { th: 'เวลาที่เหลือ', en: 'Time Remaining' },
  'exams.submit': { th: 'ส่งข้อสอบ', en: 'Submit Exam' },
  'exams.score': { th: 'คะแนน', en: 'Score' },
  'exams.completed': { th: 'เสร็จสิ้น', en: 'Completed' },
  'exams.inProgress': { th: 'กำลังทำ', en: 'In Progress' },

  // Students
  'students.title': { th: 'นักเรียน', en: 'Students' },
  'students.addStudent': { th: 'เพิ่มนักเรียน', en: 'Add Student' },
  'students.firstName': { th: 'ชื่อ', en: 'First Name' },
  'students.lastName': { th: 'นามสกุล', en: 'Last Name' },
  'students.email': { th: 'อีเมล', en: 'Email' },
  'students.phone': { th: 'เบอร์โทร', en: 'Phone' },
  'students.lineId': { th: 'LINE ID', en: 'LINE ID' },

  // Courses
  'courses.title': { th: 'คอร์สเรียน', en: 'Courses' },
  'courses.courseName': { th: 'ชื่อคอร์ส', en: 'Course Name' },
  'courses.teacher': { th: 'ผู้สอน', en: 'Teacher' },
  'courses.enroll': { th: 'ลงทะเบียน', en: 'Enroll' },

  // Enrollments
  'enrollments.title': { th: 'การลงทะเบียน', en: 'Enrollments' },
  'enrollments.student': { th: 'นักเรียน', en: 'Student' },
  'enrollments.course': { th: 'คอร์ส', en: 'Course' },
  'enrollments.enrollDate': { th: 'วันที่ลงทะเบียน', en: 'Enroll Date' },
  'enrollments.expireDate': { th: 'วันหมดอายุ', en: 'Expire Date' },

  // Payments
  'payments.title': { th: 'การชำระเงิน', en: 'Payments' },
  'payments.amount': { th: 'จำนวนเงิน', en: 'Amount' },
  'payments.paymentDate': { th: 'วันที่ชำระ', en: 'Payment Date' },
  'payments.paymentMethod': { th: 'วิธีการชำระ', en: 'Payment Method' },
  'payments.paymentStatus': { th: 'สถานะการชำระ', en: 'Payment Status' },

  // Common
  'common.save': { th: 'บันทึก', en: 'Save' },
  'common.cancel': { th: 'ยกเลิก', en: 'Cancel' },
  'common.edit': { th: 'แก้ไข', en: 'Edit' },
  'common.delete': { th: 'ลบ', en: 'Delete' },
  'common.view': { th: 'ดู', en: 'View' },
  'common.create': { th: 'สร้าง', en: 'Create' },
  'common.update': { th: 'อัปเดต', en: 'Update' },
  'common.loading': { th: 'กำลังโหลด...', en: 'Loading...' },
  'common.error': { th: 'เกิดข้อผิดพลาด', en: 'Error occurred' },
  'common.success': { th: 'สำเร็จ', en: 'Success' },
  'common.confirm': { th: 'ยืนยัน', en: 'Confirm' },
  'common.back': { th: 'กลับ', en: 'Back' },
  'common.next': { th: 'ถัดไป', en: 'Next' },
  'common.previous': { th: 'ก่อนหน้า', en: 'Previous' },
  'common.search': { th: 'ค้นหา', en: 'Search' },
  'common.filter': { th: 'กรอง', en: 'Filter' },
  'common.all': { th: 'ทั้งหมด', en: 'All' },
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'th',
      setLanguage: (lang: Language) => set({ language: lang }),
      t: (key: string) => {
        const { language } = get();
        return translations[key]?.[language] || key;
      },
    }),
    {
      name: 'language-storage',
    }
  )
);
