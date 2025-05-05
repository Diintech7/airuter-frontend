import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, UserCheck, UserX, TrendingUp, TrendingDown, Filter, Download, Calendar, RefreshCw } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';

const AdminCandidatePerformance = () => {
  const { isDark, colors, styles } = useThemeStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('month');
  const [performanceData, setPerformanceData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockData = generateMockData(timeFrame);
      setPerformanceData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [timeFrame]);

  const generateMockData = (period) => {
    // Different data based on selected time period
    const multiplier = period === 'week' ? 1 : period === 'month' ? 4 : 12;
    
    return {
      totalCandidates: 12500 * multiplier,
      activeCandidates: 8750 * multiplier,
      interviewCompletion: 72 + (Math.random() * 10 - 5),
      avgInterviewScore: 7.4 + (Math.random() * 0.6 - 0.3),
      candidateGrowth: 12.3 + (Math.random() * 8 - 4),
      interviewsCompleted: 5210 * multiplier,
      placementRate: 31 + (Math.random() * 8 - 4),
      
      // Chart data
      interviewTrends: [
        { name: 'Jan', completed: 950, scheduled: 1200 },
        { name: 'Feb', completed: 870, scheduled: 1100 },
        { name: 'Mar', completed: 1100, scheduled: 1350 },
        { name: 'Apr', completed: 1250, scheduled: 1500 },
        { name: 'May', completed: 1400, scheduled: 1650 },
        { name: 'Jun', completed: 1600, scheduled: 1800 },
      ],
      
      candidateSegmentation: [
        { name: 'IT & Development', value: 45 },
        { name: 'Sales & Marketing', value: 25 },
        { name: 'Finance', value: 15 },
        { name: 'Operations', value: 8 },
        { name: 'Others', value: 7 },
      ],
      
      // Top performers
      topPerformingCandidates: [
        { id: 1, name: 'John Doe', score: 9.8, interviews: 7, placement: 'Yes', field: 'Software Development' },
        { id: 2, name: 'Jane Smith', score: 9.6, interviews: 5, placement: 'Yes', field: 'Data Science' },
        { id: 3, name: 'Robert Johnson', score: 9.5, interviews: 6, placement: 'In Progress', field: 'Product Management' },
        { id: 4, name: 'Maria Garcia', score: 9.4, interviews: 4, placement: 'Yes', field: 'UX Design' },
        { id: 5, name: 'David Kim', score: 9.3, interviews: 8, placement: 'No', field: 'Marketing' },
      ]
    };
  };

  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen p-6`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Candidate Performance Analytics</h1>
        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
          Track and analyze candidate metrics and performance indicators
        </p>
      </div>
      
      {/* Filters and Time Range */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className={`flex items-center ${isDark ? 'bg-gray-800' : 'bg-white'} p-2 rounded-lg shadow`}>
          <span className="mr-3 font-medium">Time Range:</span>
          <div className="flex space-x-1">
            <button 
              onClick={() => setTimeFrame('week')}
              className={`px-4 py-1 rounded-md ${timeFrame === 'week' ? 
                (isDark ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white') : 
                (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')}`}
            >
              Week
            </button>
            <button 
              onClick={() => setTimeFrame('month')}
              className={`px-4 py-1 rounded-md ${timeFrame === 'month' ? 
                (isDark ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white') : 
                (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')}`}
            >
              Month
            </button>
            <button 
              onClick={() => setTimeFrame('year')}
              className={`px-4 py-1 rounded-md ${timeFrame === 'year' ? 
                (isDark ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white') : 
                (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')}`}
            >
              Year
            </button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className={`flex items-center px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow`}>
            <Filter size={16} className="mr-2" />
            <span>Filters</span>
          </button>
          <button className={`flex items-center px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow`}>
            <Download size={16} className="mr-2" />
            <span>Export</span>
          </button>
          <button className={`flex items-center px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow`}>
            <RefreshCw size={16} className="mr-2" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>Total Candidates</p>
              <h3 className="text-2xl font-bold mt-1">{performanceData.totalCandidates.toLocaleString()}</h3>
            </div>
            <div className={`p-3 rounded-full ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
              <Users size={24} className={isDark ? 'text-purple-300' : 'text-purple-600'} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className={`flex items-center ${performanceData.candidateGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {performanceData.candidateGrowth >= 0 ? <TrendingUp size={18} className="mr-1" /> : <TrendingDown size={18} className="mr-1" />}
              {Math.abs(performanceData.candidateGrowth).toFixed(1)}%
            </span>
            <span className={isDark ? 'text-gray-400 ml-2' : 'text-gray-500 ml-2'}>vs previous {timeFrame}</span>
          </div>
        </div>
        
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>Active Candidates</p>
              <h3 className="text-2xl font-bold mt-1">{performanceData.activeCandidates.toLocaleString()}</h3>
            </div>
            <div className={`p-3 rounded-full ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
              <UserCheck size={24} className={isDark ? 'text-blue-300' : 'text-blue-600'} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {((performanceData.activeCandidates / performanceData.totalCandidates) * 100).toFixed(1)}% of total
            </span>
          </div>
        </div>
        
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>Interview Completion</p>
              <h3 className="text-2xl font-bold mt-1">{performanceData.interviewCompletion.toFixed(1)}%</h3>
            </div>
            <div className={`p-3 rounded-full ${isDark ? 'bg-green-900' : 'bg-green-100'}`}>
              <Calendar size={24} className={isDark ? 'text-green-300' : 'text-green-600'} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              {performanceData.interviewsCompleted.toLocaleString()} completed
            </span>
          </div>
        </div>
        
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>Placement Rate</p>
              <h3 className="text-2xl font-bold mt-1">{performanceData.placementRate.toFixed(1)}%</h3>
            </div>
            <div className={`p-3 rounded-full ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
              <UserCheck size={24} className={isDark ? 'text-yellow-300' : 'text-yellow-600'} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className={`flex items-center ${performanceData.placementRate > 30 ? 'text-green-500' : 'text-red-500'}`}>
              {performanceData.placementRate > 30 ? <TrendingUp size={18} className="mr-1" /> : <TrendingDown size={18} className="mr-1" />}
              {Math.abs(performanceData.placementRate - 30).toFixed(1)}%
            </span>
            <span className={isDark ? 'text-gray-400 ml-2' : 'text-gray-500 ml-2'}>vs target</span>
          </div>
        </div>
      </div>
      
      {/* Charts - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md`}>
          <h3 className="text-lg font-semibold mb-4">Interview Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData.interviewTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ddd'} />
              <XAxis dataKey="name" stroke={isDark ? '#aaa' : '#666'} />
              <YAxis stroke={isDark ? '#aaa' : '#666'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#333' : '#fff',
                  color: isDark ? '#fff' : '#333',
                  border: `1px solid ${isDark ? '#444' : '#ddd'}`
                }} 
              />
              <Legend />
              <Bar dataKey="scheduled" name="Scheduled" fill="#8884d8" />
              <Bar dataKey="completed" name="Completed" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md`}>
          <h3 className="text-lg font-semibold mb-4">Candidate Segmentation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={performanceData.candidateSegmentation}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {performanceData.candidateSegmentation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#333' : '#fff',
                  color: isDark ? '#fff' : '#333',
                  border: `1px solid ${isDark ? '#444' : '#ddd'}`
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Top Performing Candidates */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md mb-8`}>
        <h3 className="text-lg font-semibold mb-4">Top Performing Candidates</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Field</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Interview Score</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"># of Interviews</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Placement Status</th>
              </tr>
            </thead>
            <tbody className={`${isDark ? 'divide-gray-700' : 'divide-gray-200'} bg-transparent`}>
              {performanceData.topPerformingCandidates.map((candidate, index) => (
                <tr key={candidate.id} className={index % 2 === 0 ? (isDark ? 'bg-gray-800' : 'bg-white') : (isDark ? 'bg-gray-900' : 'bg-gray-50')}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-purple-600 flex items-center justify-center text-white">
                        {candidate.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className={isDark ? 'text-white' : 'text-gray-900'}>{candidate.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={isDark ? 'text-gray-300' : 'text-gray-700'}>{candidate.field}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      candidate.score >= 9.0 ? 
                        (isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') : 
                        (isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800')
                    }`}>
                      {candidate.score}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={isDark ? 'text-gray-300' : 'text-gray-700'}>{candidate.interviews}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      candidate.placement === 'Yes' ? 
                        (isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') : 
                      candidate.placement === 'No' ?
                        (isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800') :
                        (isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800')
                    }`}>
                      {candidate.placement}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCandidatePerformance;