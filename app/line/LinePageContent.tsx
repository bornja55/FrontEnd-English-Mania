'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';

export default function LinePageContent() {
  const [status, setStatus] = useState('กำลังประมวลผล...');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus(`เกิดข้อผิดพลาด: ${error}`);
          return;
        }

        if (!code) {
          setStatus('ไม่พบ authorization code');
          return;
        }

        // ตรวจสอบ state (security)
        const savedState = localStorage.getItem('line_login_state');
        if (state !== savedState) {
          setStatus('State ไม่ตรงกัน - อาจมีการโจมตี');
          return;
        }

        // ส่ง code ไปให้ backend แลกเป็น token
        setStatus('กำลังเข้าสู่ระบบ...');
        
        // ใช้ฟังก์ชัน login จาก useAuthStore (ต้องแก้ไขให้รับ code แทน idToken)
        await login(code); // หรือสร้างฟังก์ชันใหม่ loginWithCode
        
        // ลบ state ออกจาก localStorage
        localStorage.removeItem('line_login_state');
        
        // Redirect ไปหน้า dashboard
        router.push('/dashboard');
        
      } catch (err) {
        console.error('LINE login error:', err);
        setStatus(`เกิดข้อผิดพลาด: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    handleCallback();
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">LINE Login</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}