
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
import { Payment } from '@/lib/types';
import { 
  Search, 
  CreditCard, 
  Loader2,
  AlertCircle,
  Calendar,
  DollarSign,
  Eye,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { th, enUS } from 'date-fns/locale';

export default function PaymentsPage() {
  const { t, language } = useLanguageStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    const filtered = payments.filter(payment =>
      payment.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.toString().includes(searchTerm)
    );
    setFilteredPayments(filtered);
  }, [payments, searchTerm]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getPayments();
      setPayments(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'th' ? 'th-TH' : 'en-US', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-zinc-200';
    }
  };

  const handleViewPayment = (paymentId: number) => {
    // In a real app, this would navigate to payment details
    console.log('View payment:', paymentId);
  };

  const handleDownloadSlip = (slipUrl?: string) => {
    if (slipUrl) {
      window.open(slipUrl, '_blank');
    }
  };

  return (
    <ProtectedRoute>
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
                    <CreditCard className="h-6 w-6 text-red-600" />
                    <span>{t('payments.title')}</span>
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Track payment history and transaction status
                  </p>
                </div>
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
                  placeholder={`${t('common.search')} ${t('payments.title').toLowerCase()}...`}
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
                  <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                  <span className="ml-2 text-gray-600">{t('common.loading')}</span>
                </div>
              )}

              {/* Payments Table */}
              {!isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t('payments.title')} ({filteredPayments.length})
                      </CardTitle>
                      <CardDescription>
                        {searchTerm 
                          ? `Showing results for "${searchTerm}"`
                          : 'All payment transactions'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {filteredPayments.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t('payments.amount')}</TableHead>
                                <TableHead>{t('payments.paymentDate')}</TableHead>
                                <TableHead>{t('payments.paymentMethod')}</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>{t('payments.paymentStatus')}</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredPayments.map((payment, index) => (
                                <motion.tr
                                  key={payment.payment_id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  className="hover:bg-gray-50"
                                >
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <DollarSign className="h-4 w-4 text-green-500" />
                                      <span className="font-medium">
                                        {formatCurrency(payment.amount)}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="h-4 w-4 text-blue-500" />
                                      <span className="text-sm">
                                        {formatDate(payment.payment_date)}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                      {payment.payment_method}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge 
                                      variant="outline" 
                                      className={getStatusColor(payment.status)}
                                    >
                                      {payment.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge 
                                      variant="outline" 
                                      className={getStatusColor(payment.payment_status)}
                                    >
                                      {payment.payment_status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewPayment(payment.payment_id)}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      {payment.slip_url && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDownloadSlip(payment.slip_url)}
                                        >
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </motion.tr>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm ? 'No payments found' : 'No payments yet'}
                          </h3>
                          <p className="text-gray-600">
                            {searchTerm 
                              ? `No payments match "${searchTerm}". Try a different search term.`
                              : 'Payment transactions will appear here once students make payments.'
                            }
                          </p>
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
