'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { Suspense } from 'react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken, isAuthenticated, isLoading } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const processAuth = async () => {
      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refresh_token');
      
      if (token && !isProcessing) {
        setIsProcessing(true);
        try {
          console.log('Processing token from URL:', token);
          await setToken(token, refreshToken || undefined);
          console.log('Token set successfully, redirecting to admin dashboard');
          // หลังจากเซ็ต token สำเร็จ redirect ไปหน้า admin dashboard
          router.replace('/admin/dashboard');
        } catch (error) {
          console.error('Failed to process auth:', error);
          router.replace('/login?error=auth_failed');
        }
      } else if (!token && !isAuthenticated) {
        // ถ้าไม่มี token และยังไม่ได้ login ให้ redirect กลับ login
        console.log('No token and not authenticated, redirecting to login');
        router.replace('/login');
      } else if (isAuthenticated && !token) {
        // ถ้า login แล้วแต่ไม่มี token ใน URL ให้ไปหน้า admin dashboard
        console.log('Already authenticated, redirecting to admin dashboard');
        router.replace('/admin/dashboard');
      }
    };

    processAuth();
  }, [searchParams, router, setToken, isAuthenticated, isProcessing]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">กำลังเข้าสู่ระบบ...</p>
        <p className="mt-2 text-sm text-gray-500">โปรดรอสักครู่</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}