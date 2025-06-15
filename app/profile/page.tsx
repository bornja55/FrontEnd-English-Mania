
'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/lib/auth';
import { useLanguageStore } from '@/lib/translations';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Edit,
  Save,
  X,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { t } = useLanguageStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleColor = (roleName?: string) => {
    switch (roleName) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'teacher':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'student':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-zinc-200';
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      // In a real app, this would call an API to update user profile
      // For now, we'll just update the local state
      const updatedUser = { ...user!, ...formData };
      setUser(updatedUser);
      setIsEditing(false);
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-64 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
              >
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <User className="h-6 w-6 text-blue-600" />
                    <span>{t('nav.profile')}</span>
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your account information and preferences
                  </p>
                </div>
              </motion.div>

              {/* Message Alert */}
              {message && (
                <Alert variant={message.includes('success') ? 'default' : 'destructive'}>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-lg">
                            {getInitials(user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{user?.name || 'User'}</CardTitle>
                          <CardDescription className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={getRoleColor(user?.role?.role_name)}
                            >
                              {user?.role?.role_name || 'Unknown'}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                      {!isEditing && (
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(true)}
                          className="flex items-center space-x-2"
                        >
                          <Edit className="h-4 w-4" />
                          <span>{t('common.edit')}</span>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>Full Name</span>
                        </Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{user?.name || '-'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>Email</span>
                        </Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter your email"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{user?.email || '-'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>User ID</span>
                        </Label>
                        <p className="text-gray-600 text-sm font-mono">{user?.user_id}</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Role</span>
                        </Label>
                        <Badge 
                          variant="outline" 
                          className={getRoleColor(user?.role?.role_name)}
                        >
                          {user?.role?.role_name || 'Unknown'}
                        </Badge>
                      </div>

                      {user?.line_user_id && (
                        <div className="space-y-2 md:col-span-2">
                          <Label className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>LINE User ID</span>
                          </Label>
                          <p className="text-gray-600 text-sm font-mono">{user.line_user_id}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex items-center space-x-3 pt-4 border-t">
                        <Button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? t('common.loading') : t('common.save')}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4 mr-2" />
                          {t('common.cancel')}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Additional Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Additional details about your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Account Type</Label>
                        <p className="text-gray-900">
                          {user?.line_user_id ? 'LINE Account' : 'Admin Account'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
