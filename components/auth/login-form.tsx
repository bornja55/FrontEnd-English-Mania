'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/lib/auth';
import { useLanguageStore } from '@/lib/translations';
import { BookOpen, Globe, AlertCircle } from 'lucide-react';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: '',
  });

  const { loginAdmin } = useAuthStore();
  const { language, setLanguage, t } = useLanguageStore();
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await loginAdmin(adminCredentials.username, adminCredentials.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLineLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID;
    if (!clientId) {
      alert('LINE Channel ID ไม่ถูกต้อง');
      return;
    }
    const redirectUri = process.env.NEXT_PUBLIC_LINE_LOGIN_REDIRECT_URI || 'https://api.englishmaniaasia.com/login/callback';
    const encodedRedirectUri = encodeURIComponent(redirectUri);
    const state = Math.random().toString(36).substring(2, 15);
    const scope = 'profile openid email';

    const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&state=${state}&scope=${scope}`;
    window.location.href = lineAuthUrl;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Illustration */}
        <div className="flex flex-col items-center space-y-2">
          <img
            src="/login-illustration.svg"
            alt="Login Illustration"
            className="w-32 h-32 mb-2"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))' }}
          />
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">ENGLISH MANIA</h1>
          <p className="text-sm text-gray-500">by KruYam</p>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center space-x-2 mt-2"
          >
            <Globe className="h-4 w-4" />
            <span>{language === 'th' ? 'English' : 'ไทย'}</span>
          </Button>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 rounded-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center text-blue-700">
              {t('auth.login')}
            </CardTitle>
            <p className="text-center text-gray-400">
              {language === 'th'
                ? 'เลือกวิธีการเข้าสู่ระบบ'
                : 'Choose your login method'}
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="line" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="line">LINE</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="line" className="space-y-4">
                <Button
                  onClick={handleLineLogin}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-lg font-semibold py-3 rounded-lg shadow transition"
                  size="lg"
                >
                  <img src="/line-logo.png" alt="LINE" className="w-6 h-6 mr-2" />
                  {t('auth.loginWithLine')}
                </Button>
                <p className="text-xs text-center text-gray-500">
                  {language === 'th'
                    ? 'สำหรับนักเรียนและผู้สอน'
                    : 'For students and teachers'}
                </p>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t('auth.username')}</Label>
                    <Input
                      id="username"
                      type="text"
                      value={adminCredentials.username}
                      onChange={(e) =>
                        setAdminCredentials(prev => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={adminCredentials.password}
                      onChange={(e) =>
                        setAdminCredentials(prev => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg font-semibold py-3 rounded-lg shadow transition"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? t('common.loading') : t('auth.loginButton')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-4">
          {language === 'th'
            ? '© 2025 English Mania by KruYam. สงวนลิขสิทธิ์.'
            : '© 2025 English Mania by KruYam. All rights reserved.'}
        </p>
      </div>
    </div>
  );
}