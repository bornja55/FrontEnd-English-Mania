
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    // In a real implementation, this would integrate with LINE Login SDK
    // For now, we'll show a placeholder
    setError('LINE Login integration will be implemented with LINE SDK');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 via-yellow-500 to-blue-600 shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              ENGLISH MANIA
            </h1>
            <p className="text-sm text-gray-600">by KruYam</p>
          </div>
          
          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center space-x-2"
          >
            <Globe className="h-4 w-4" />
            <span>{language === 'th' ? 'English' : 'ไทย'}</span>
          </Button>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">
              {t('auth.login')}
            </CardTitle>
            <CardDescription className="text-center">
              {language === 'th' 
                ? 'เลือกวิธีการเข้าสู่ระบบ' 
                : 'Choose your login method'
              }
            </CardDescription>
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
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  size="lg"
                >
                  {t('auth.loginWithLine')}
                </Button>
                <p className="text-xs text-center text-gray-500">
                  {language === 'th' 
                    ? 'สำหรับนักเรียนและผู้สอน' 
                    : 'For students and teachers'
                  }
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
                    className="w-full bg-blue-600 hover:bg-blue-700"
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
        <p className="text-center text-xs text-gray-500">
          {language === 'th' 
            ? '© 2025 English Mania by KruYam. สงวนลิขสิทธิ์.' 
            : '© 2025 English Mania by KruYam. All rights reserved.'
          }
        </p>
      </div>
    </div>
  );
}
