'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { Suspense } from 'react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken, isAuthenticated } = useAuthStore();
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
          router.replace('/admin/dashboard');
        } catch (error) {
          console.error('Failed to process auth:', error);
          router.replace('/login?error=auth_failed');
        }
      } else if (!token && !isAuthenticated) {
        console.log('No token and not authenticated, redirecting to login');
        router.replace('/login');
      } else if (isAuthenticated && !token) {
        console.log('Already authenticated, redirecting to admin dashboard');
        router.replace('/admin/dashboard');
      }
    };

    processAuth();
  }, [searchParams, router, setToken, isAuthenticated, isProcessing]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
        <p className="mt-4 text-primary font-semibold">กำลังเข้าสู่ระบบ...</p>
        <p className="mt-2 text-sm text-accent">โปรดรอสักครู่</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}