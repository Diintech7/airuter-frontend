import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  TrendingUp, Users, Briefcase, FileText, Loader, AlertCircle 
} from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const DISTRIBUTION_COLORS = ['#4d72f3', '#10b981', '#f59e0b', '#ef4444'];
const INDUSTRY_COLORS = [
  '#3b82f6', '#4f46e5', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
];

// User Distribution Component
const UserDistributionSection = ({ userRoles }) => {
  // Filter out admin role
  const filteredRoles = userRoles?.filter(role => role.name !== 'Admins') || [];
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Users className="h-5 w-5 mr-2 text-blue-500" />
        User Distribution
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredRoles}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={90}
              innerRadius={60} // Create a donut chart effect
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              animationDuration={1500}
              animationBegin={300}
            >
              {filteredRoles.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length]} 
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => value.toLocaleString()}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '6px',
                padding: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0'
              }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center" 
              wrapperStyle={{paddingTop: '10px'}}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


const DataAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [timeRange, setTimeRange] = useState('last7days');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would pass the timeRange to the API
        const response = await axios.get('https://auriter-backen.onrender.com/api/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${Cookies.get('admintoken')}` }
        });
        setStats(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-700">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        <AlertCircle className="h-8 w-8 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  // Default placeholder data in case stats aren't loaded
  const metrics = stats?.metrics ? [
    { label: 'User Growth Rate', value: stats.metrics.userGrowthRate, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Active Users', value: stats.metrics.activeUsers.toLocaleString(), icon: Users, color: 'text-blue-600' },
    { label: 'Job Applications', value: stats.metrics.totalApplications.toLocaleString(), icon: FileText, color: 'text-purple-600' },
    { label: 'Recruiter Activity', value: stats.metrics.recruiterActivity.toLocaleString(), icon: Briefcase, color: 'text-orange-600' },
  ] : [];

  // Convert monthly data for line chart
  const lineChartData = stats?.charts?.monthlyData?.months.map((month, index) => ({
    name: month,
    users: stats.charts.monthlyData.users[index],
    jobs: stats.charts.monthlyData.jobs[index],
    applications: stats.charts.monthlyData.applications[index],
  })) || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <select 
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="last7days">Last 7 days</option>
          <option value="last30days">Last 30 days</option>
          <option value="last3months">Last 3 months</option>
          <option value="last12months">Last 12 months</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
              <metric.icon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            User & Platform Activity
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                <XAxis 
                  dataKey="name"
                  tick={{fill: '#6b7280'}}
                  axisLine={{stroke: '#d1d5db'}}
                  tickLine={{stroke: '#d1d5db'}}
                />
                <YAxis 
                  tick={{fill: '#6b7280'}}
                  axisLine={{stroke: '#d1d5db'}}
                  tickLine={{stroke: '#d1d5db'}}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '6px',
                    padding: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <Legend 
                  wrapperStyle={{paddingTop: '10px'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  animationDuration={1500}
                  dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4, fill: 'white' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="jobs" 
                  stroke="#82ca9d"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  animationDuration={1500}
                  dot={{ stroke: '#82ca9d', strokeWidth: 2, r: 4, fill: 'white' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#ffc658"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  animationDuration={1500}
                  dot={{ stroke: '#ffc658', strokeWidth: 2, r: 4, fill: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Status Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-purple-500" />
            Application Status Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.charts?.applicationStatuses || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                <XAxis 
                  dataKey="name"
                  tick={{fill: '#6b7280'}}
                  axisLine={{stroke: '#d1d5db'}}
                  tickLine={{stroke: '#d1d5db'}}
                />
                <YAxis 
                  tick={{fill: '#6b7280'}}
                  axisLine={{stroke: '#d1d5db'}}
                  tickLine={{stroke: '#d1d5db'}}
                />
                <Tooltip 
                  formatter={(value) => value.toLocaleString()}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '6px',
                    padding: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Applications" 
                  fill="#8884d8"
                  animationDuration={1500}
                  animationBegin={300}
                  radius={[4, 4, 0, 0]} // Rounded top corners
                >
                  {stats?.charts?.applicationStatuses?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Updated User Role Distribution */}
        <UserDistributionSection userRoles={stats?.charts?.userRoles} />

        {/* Platform Stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Platform Stats
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Interviews</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.platformStats?.totalInterviews?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Successful Hires</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.platformStats?.successfulHires?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Average Time to Hire</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.platformStats?.avgTimeToHire || '0'} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Client Satisfaction</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.platformStats?.clientSatisfaction || '0%'}
              </span>
            </div>
            
            {/* Progress bars for visuals */}
            <div className="pt-4">
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Interview Completion Rate</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {stats?.platformStats?.completedInterviews && stats?.platformStats?.totalInterviews ? 
                      `${Math.round(stats.platformStats.completedInterviews / stats.platformStats.totalInterviews * 100)}%` : 
                      '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-in-out" 
                    style={{ 
                      width: `${stats?.platformStats?.completedInterviews && stats?.platformStats?.totalInterviews ? 
                        Math.round(stats.platformStats.completedInterviews / stats.platformStats.totalInterviews * 100) : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Hire Success Rate</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {Math.round((stats?.platformStats?.successfulHires || 0) / (stats?.totals?.applications || 1) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-1000 ease-in-out" 
                    style={{ 
                      width: `${Math.round((stats?.platformStats?.successfulHires || 0) / (stats?.totals?.applications || 1) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default DataAnalytics;