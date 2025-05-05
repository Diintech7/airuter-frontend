import React, { useState } from 'react';
import { CreditCard, Search, Filter, MoreHorizontal, Download, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useThemeStyles } from '../hooks/useThemeStyles';

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { styles, colors } = useThemeStyles();
  
  // Chart data for revenue overview
  const revenueData = [
    { name: 'Jan', amount: 12400 },
    { name: 'Feb', amount: 15600 },
    { name: 'Mar', amount: 14200 },
    { name: 'Apr', amount: 18900 },
    { name: 'May', amount: 21400 },
    { name: 'Jun', amount: 19800 },
    { name: 'Jul', amount: 23500 },
  ];
  
  // Payment transactions data
  const payments = [
    {
      id: 'TRX-10045',
      user: 'James Wilson',
      email: 'james.wilson@example.com',
      amount: 99.99,
      date: '2025-04-22',
      method: 'Credit Card',
      status: 'completed',
      course: 'Advanced React Development'
    },
    {
      id: 'TRX-10044',
      user: 'Emily Davis',
      email: 'emily.davis@example.com',
      amount: 129.99,
      date: '2025-04-21',
      method: 'PayPal',
      status: 'completed',
      course: 'Python for Data Science'
    },
    {
      id: 'TRX-10043',
      user: 'Michael Brown',
      email: 'michael.brown@example.com',
      amount: 149.99,
      date: '2025-04-21',
      method: 'Credit Card',
      status: 'pending',
      course: 'Full Stack JavaScript'
    },
    {
      id: 'TRX-10042',
      user: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      amount: 79.99,
      date: '2025-04-20',
      method: 'Credit Card',
      status: 'completed',
      course: 'UI/UX Design Fundamentals'
    },
    {
      id: 'TRX-10041',
      user: 'Robert Lewis',
      email: 'robert.lewis@example.com',
      amount: 119.99,
      date: '2025-04-19',
      method: 'PayPal',
      status: 'failed',
      course: 'Machine Learning Basics'
    },
    {
      id: 'TRX-10040',
      user: 'Jennifer Lee',
      email: 'jennifer.lee@example.com',
      amount: 89.99,
      date: '2025-04-18',
      method: 'Credit Card',
      status: 'refunded',
      course: 'Digital Marketing Masterclass'
    }
  ];
  
  // Summary metrics
  const summaryMetrics = [
    { title: 'Total Revenue', value: '$34,562.80', icon: DollarSign, change: '+12.5%', changeType: 'positive' },
    { title: 'Monthly Revenue', value: '$8,941.25', icon: TrendingUp, change: '+8.2%', changeType: 'positive' },
    { title: 'Paying Users', value: '1,254', icon: Users, change: '+5.3%', changeType: 'positive' },
    { title: 'Avg. Purchase Value', value: '$94.75', icon: CreditCard, change: '-2.1%', changeType: 'negative' }
  ];
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const filteredPayments = activeTab === 'all' 
    ? payments 
    : payments.filter(payment => payment.status === activeTab);
  
  return (
    <div className={`${styles.pageContainer} pb-12`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${colors.textHeading}`}>Payments</h1>
          <p className={colors.textMuted}>Monitor payment transactions and revenue</p>
        </div>
        <div className="flex space-x-2">
          <button className={`px-4 py-2 ${colors.bgButton} ${colors.textButton} rounded-md flex items-center`}>
            <Download size={16} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {summaryMetrics.map((metric, index) => (
          <div key={index} className={`${colors.bgCard} rounded-lg shadow-md p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${colors.bgSection} p-3 rounded-md`}>
                <metric.icon size={20} className={colors.textAccent} />
              </div>
              <span className={`text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className={`text-2xl font-bold ${colors.text}`}>{metric.value}</h3>
            <p className={colors.textMuted}>{metric.title}</p>
          </div>
        ))}
      </div>
      
      {/* Revenue Chart */}
      <div className={`${colors.bgCard} rounded-lg shadow-md mb-6`}>
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-medium ${colors.textHeading}`}>Revenue Overview</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm">
                <Calendar size={16} className={`mr-2 ${colors.textMuted}`} />
                <span className={colors.textMuted}>Last 7 months</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="amount" fill="#F87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className={`${colors.bgCard} rounded-lg shadow-md`}>
        <div className="flex flex-wrap p-4 border-b">
          <div className="mr-4 mb-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className={`pl-10 pr-4 py-2 border rounded-md w-64 ${colors.inputBg}`}
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          <div className="mr-4 mb-2">
            <button className={`px-4 py-2 border rounded-md flex items-center ${colors.buttonAltBg} ${colors.buttonAltText}`}>
              <Filter size={16} className="mr-2" />
              Filter
            </button>
          </div>
          <div className="flex-grow"></div>
          <div className="flex space-x-1">
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'all' ? `${colors.bgHighlight} ${colors.textAccent}` : `${colors.bgSection} ${colors.text}`}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'completed' ? `${colors.bgHighlight} ${colors.textAccent}` : `${colors.bgSection} ${colors.text}`}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'pending' ? `${colors.bgHighlight} ${colors.textAccent}` : `${colors.bgSection} ${colors.text}`}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'failed' ? `${colors.bgHighlight} ${colors.textAccent}` : `${colors.bgSection} ${colors.text}`}`}
              onClick={() => setActiveTab('failed')}
            >
              Failed
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'refunded' ? `${colors.bgHighlight} ${colors.textAccent}` : `${colors.bgSection} ${colors.text}`}`}
              onClick={() => setActiveTab('refunded')}
            >
              Refunded
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={colors.bgSection}>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`${colors.bgCard} divide-y divide-gray-200`}>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className={`hover:${colors.bgHover}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${colors.text}`}>{payment.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${colors.text}`}>{payment.user}</div>
                    <div className={`text-xs ${colors.textMuted}`}>{payment.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm ${colors.text} max-w-xs truncate`} title={payment.course}>
                      {payment.course}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${colors.text}`}>${payment.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${colors.text}`}>{payment.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${colors.text}`}>{payment.method}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(payment.status)}`}>
                      <span className="capitalize">{payment.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className={colors.textAccent}>
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className={`text-sm ${colors.textMuted}`}>
            Showing {filteredPayments.length} transactions
          </div>
          <div className="flex space-x-2">
            <button className={`px-3 py-1 border rounded-md ${colors.text}`}>Previous</button>
            <button className={`px-3 py-1 ${colors.bgButton} ${colors.textButton} rounded-md`}>1</button>
            <button className={`px-3 py-1 border rounded-md ${colors.text}`}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;