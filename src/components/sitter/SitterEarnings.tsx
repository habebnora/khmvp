import { DollarSign, TrendingUp, Calendar, CreditCard, Download } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Language } from '../../App';

interface SitterEarningsProps {
  language: Language;
}

interface Transaction {
  id: number;
  type: 'earning' | 'withdrawal';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending';
}

const translations = {
  ar: {
    earnings: 'أرباحي',
    totalBalance: 'الرصيد الكلي',
    thisMonth: 'هذا الشهر',
    lastMonth: 'الشهر الماضي',
    withdraw: 'سحب الأموال',
    history: 'سجل المعاملات',
    earning: 'إيداع',
    withdrawal: 'سحب',
    completed: 'مكتمل',
    pending: 'قيد المعالجة',
    egp: 'جنيه',
    date: 'التاريخ',
    amount: 'المبلغ',
    status: 'الحالة',
    noTransactions: 'لا توجد معاملات',
    stats: 'الإحصائيات',
    totalEarnings: 'إجمالي الأرباح',
    totalWithdrawals: 'إجمالي السحوبات',
    availableBalance: 'الرصيد المتاح',
    downloadReport: 'تحميل التقرير',
    jobPayment: 'دفعة عن جلسة',
    withdrawalTo: 'سحب إلى'
  },
  en: {
    earnings: 'Earnings',
    totalBalance: 'Total Balance',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    withdraw: 'Withdraw',
    history: 'Transaction History',
    earning: 'Earning',
    withdrawal: 'Withdrawal',
    completed: 'Completed',
    pending: 'Pending',
    egp: 'EGP',
    date: 'Date',
    amount: 'Amount',
    status: 'Status',
    noTransactions: 'No transactions',
    stats: 'Statistics',
    totalEarnings: 'Total Earnings',
    totalWithdrawals: 'Total Withdrawals',
    availableBalance: 'Available Balance',
    downloadReport: 'Download Report',
    jobPayment: 'Payment for job',
    withdrawalTo: 'Withdrawal to'
  }
};

const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: 'earning',
    amount: 240,
    date: '2024-11-21',
    description: 'دفعة عن جلسة مع أمل محمود',
    status: 'completed'
  },
  {
    id: 2,
    type: 'earning',
    amount: 200,
    date: '2024-11-20',
    description: 'دفعة عن جلسة مع هدى سعيد',
    status: 'completed'
  },
  {
    id: 3,
    type: 'withdrawal',
    amount: 1500,
    date: '2024-11-18',
    description: 'سحب إلى البنك الأهلي',
    status: 'completed'
  },
  {
    id: 4,
    type: 'earning',
    amount: 320,
    date: '2024-11-17',
    description: 'دفعة عن جلسة مع ريهام عادل',
    status: 'completed'
  },
  {
    id: 5,
    type: 'earning',
    amount: 160,
    date: '2024-11-15',
    description: 'دفعة عن جلسة مع منى علي',
    status: 'pending'
  }
];

export default function SitterEarnings({ language }: SitterEarningsProps) {
  const t = translations[language];

  const totalBalance = 3240;
  const thisMonthEarnings = 920;
  const lastMonthEarnings = 2800;
  const totalWithdrawals = 1500;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[#FB5E7A]">{t.earnings}</h1>
        <Button className="bg-[#FB5E7A] hover:bg-[#e5536e]">
          <CreditCard className="w-4 h-4 mr-2" />
          {t.withdraw}
        </Button>
      </div>

      {/* Balance Card */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-[#FB5E7A] to-[#e5536e] text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 mb-1">{t.availableBalance}</p>
            <h1 className="text-white text-4xl">{totalBalance} {t.egp}</h1>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-white/80 text-sm mb-1">{t.thisMonth}</p>
            <p className="text-xl">{thisMonthEarnings} {t.egp}</p>
          </div>
          <div>
            <p className="text-white/80 text-sm mb-1">{t.lastMonth}</p>
            <p className="text-xl">{lastMonthEarnings} {t.egp}</p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.totalEarnings}</p>
              <h3 className="text-green-600">+{thisMonthEarnings} {t.egp}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.totalWithdrawals}</p>
              <h3 className="text-red-600">-{totalWithdrawals} {t.egp}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>{t.history}</h3>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {t.downloadReport}
          </Button>
        </div>

        {mockTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t.noTransactions}
          </div>
        ) : (
          <div className="space-y-3">
            {mockTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'earning'
                      ? 'bg-green-100 dark:bg-green-900'
                      : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    {transaction.type === 'earning' ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm mb-1">{transaction.description}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{transaction.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`mb-1 ${
                    transaction.type === 'earning' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'earning' ? '+' : '-'}{transaction.amount} {t.egp}
                  </div>
                  <Badge
                    className={
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }
                  >
                    {t[transaction.status]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
