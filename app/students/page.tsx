
'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguageStore } from '@/lib/translations';
import { apiClient } from '@/lib/api';
import { Student } from '@/lib/types';
import { 
  Plus, 
  Search, 
  Users, 
  Loader2,
  AlertCircle,
  Edit,
  Trash2,
  Mail,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { th, enUS } from 'date-fns/locale';

export default function StudentsPage() {
  const { t, language } = useLanguageStore();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.phone && student.phone.includes(searchTerm)) ||
      (student.line_id && student.line_id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getStudents();
      setStudents(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy', { 
      locale: language === 'th' ? th : enUS 
    });
  };

  const handleCreateStudent = () => {
    // In a real app, this would open a modal or navigate to a form
    console.log('Create student');
  };

  const handleEditStudent = (studentId: number) => {
    // In a real app, this would open an edit modal or navigate to edit form
    console.log('Edit student:', studentId);
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await apiClient.deleteStudent(studentId);
        await fetchStudents(); // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete student');
      }
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-64 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
              >
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    <span>{t('students.title')}</span>
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage student information and enrollment
                  </p>
                </div>
                <Button onClick={handleCreateStudent} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('students.addStudent')}
                </Button>
              </motion.div>

              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`${t('common.search')} ${t('students.title').toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </motion.div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Loading */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">{t('common.loading')}</span>
                </div>
              )}

              {/* Students Table */}
              {!isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t('students.title')} ({filteredStudents.length})
                      </CardTitle>
                      <CardDescription>
                        {searchTerm 
                          ? `Showing results for "${searchTerm}"`
                          : 'All registered students'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {filteredStudents.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t('students.firstName')}</TableHead>
                                <TableHead>{t('students.lastName')}</TableHead>
                                <TableHead>{t('students.email')}</TableHead>
                                <TableHead>{t('students.phone')}</TableHead>
                                <TableHead>{t('students.lineId')}</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredStudents.map((student, index) => (
                                <motion.tr
                                  key={student.student_id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  className="hover:bg-gray-50"
                                >
                                  <TableCell className="font-medium">
                                    {student.first_name}
                                  </TableCell>
                                  <TableCell>{student.last_name}</TableCell>
                                  <TableCell>
                                    {student.email ? (
                                      <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{student.email}</span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 text-sm">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {student.phone ? (
                                      <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{student.phone}</span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 text-sm">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {student.line_id ? (
                                      <Badge variant="outline" className="bg-green-50 text-green-700">
                                        {student.line_id}
                                      </Badge>
                                    ) : (
                                      <span className="text-gray-400 text-sm">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-sm text-gray-600">
                                    {formatDate(student.created_at)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditStudent(student.student_id)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteStudent(student.student_id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </motion.tr>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm ? 'No students found' : 'No students yet'}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {searchTerm 
                              ? `No students match "${searchTerm}". Try a different search term.`
                              : 'Add your first student to get started.'
                            }
                          </p>
                          {!searchTerm && (
                            <Button onClick={handleCreateStudent} className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="h-4 w-4 mr-2" />
                              {t('students.addStudent')}
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
