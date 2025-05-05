// components/admin/ShortsAnalytics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Eye, ThumbsUp, MessageSquare, Share2, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useThemeStyles } from '../hooks/useThemeStyles'; // Import theme hook

const ShortsAnalytics = () => {
  const { styles, colors } = useThemeStyles(); // Use the theme hook
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMetric, setActiveMetric] = useState('views');
  const navigate = useNavigate();

  // Fetch all shorts
  useEffect(() => {
    const fetchShorts = async () => {
      try {
        setLoading(true);
        
        // Get authentication token
        const token = Cookies.get('admintoken');
        
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          navigate('/admin/login');
          return;
        }

        // Set up headers with authentication
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        
        const res = await axios.get('https://auriter-backen.onrender.com/api/shorts', {
          headers,
          credentials: 'include'
        });
        
        setShorts(res.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching shorts data:', err);
        
        // Handle unauthorized error
        if (err.response?.status === 401 || err.response?.status === 403) {
          Cookies.remove('admintoken');
          Cookies.remove('adminUser');
          setError('Your session has expired. Please log in again.');
          navigate('/admin/login');
        } else {
          setError('Error fetching shorts data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShorts();
  }, [navigate]);

  // Handle retry fetching shorts
  const handleRetryFetch = async () => {
    const fetchShorts = async () => {
      try {
        setLoading(true);
        
        // Get authentication token
        const token = Cookies.get('admintoken');
        
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          navigate('/admin/login');
          return;
        }

        // Set up headers with authentication
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        
        const res = await axios.get('https://auriter-backen.onrender.com/api/shorts', {
          headers,
          credentials: 'include'
        });
        
        setShorts(res.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching shorts data:', err);
        
        // Handle unauthorized error
        if (err.response?.status === 401 || err.response?.status === 403) {
          Cookies.remove('admintoken');
          Cookies.remove('adminUser');
          setError('Your session has expired. Please log in again.');
          navigate('/admin/login');
        } else {
          setError('Error fetching shorts data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShorts();
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate('/admin/login');
  };

  // Calculate total metrics
  const totalMetrics = shorts.reduce(
    (acc, short) => {
      return {
        views: acc.views + (short.metrics?.views || 0),
        likes: acc.likes + (short.metrics?.likes || 0),
        comments: acc.comments + (short.metrics?.comments || 0),
        shares: acc.shares + (short.metrics?.shares || 0),
      };
    },
    { views: 0, likes: 0, comments: 0, shares: 0 }
  );

  // Format date
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Prepare chart data
  const chartData = shorts
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(short => ({
      name: short.title.length > 20 ? short.title.substring(0, 20) + '...' : short.title,
      views: short.metrics?.views || 0,
      likes: short.metrics?.likes || 0,
      comments: short.metrics?.comments || 0,
      shares: short.metrics?.shares || 0,
      date: formatDate(short.createdAt),
      ratio: short.metrics?.likes > 0 && short.metrics?.views > 0 
        ? ((short.metrics.likes / short.metrics.views) * 100).toFixed(2)
        : 0
    }));

  // Comparison chart data
  const metricComparisonData = shorts
    .slice()
    .sort((a, b) => (b.metrics?.[activeMetric] || 0) - (a.metrics?.[activeMetric] || 0))
    .slice(0, 5)
    .map(short => ({
      name: short.title.length > 15 ? short.title.substring(0, 15) + '...' : short.title,
      [activeMetric]: short.metrics?.[activeMetric] || 0
    }));

  // Get color for active metric
  const getMetricColor = (metric) => {
    switch (metric) {
      case 'views': return '#3b82f6'; // blue
      case 'likes': return '#10b981'; // green
      case 'comments': return '#8b5cf6'; // purple
      case 'shares': return '#f59e0b'; // amber
      default: return '#3b82f6';
    }
  };

  return (
    <div className={`${styles.pageContainer} p-6`}>
      <h1 className={`text-2xl font-semibold mb-6 ${colors.textHeading}`}>Shorts Analytics</h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
          {error.includes('session') || error.includes('token') ? (
            <button
              onClick={handleLoginRedirect}
              className="mt-2 sm:mt-0 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition-all text-sm"
            >
              Log In
            </button>
          ) : (
            <button
              onClick={handleRetryFetch}
              className="mt-2 sm:mt-0 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition-all text-sm"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className={`mt-3 ${colors.text}`}>Loading analytics...</p>
        </div>
      ) : error ? (
        <></>
      ) : shorts.length === 0 ? (
        <div className={`text-center py-10 ${colors.bgSection} rounded-lg`}>
          <p className={colors.textMuted}>No shorts data available. Add shorts to see analytics.</p>
        </div>
      ) : (
        <>
          {/* Metrics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`${colors.bgCard} rounded-lg p-4 border border-blue-100 bg-opacity-50`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Views</p>
                  <h3 className={`text-2xl font-bold mt-1 ${colors.text}`}>{totalMetrics.views.toLocaleString()}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Eye size={20} className="text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className={`${colors.bgCard} rounded-lg p-4 border border-green-100 bg-opacity-50`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Likes</p>
                  <h3 className={`text-2xl font-bold mt-1 ${colors.text}`}>{totalMetrics.likes.toLocaleString()}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <ThumbsUp size={20} className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className={`${colors.bgCard} rounded-lg p-4 border border-purple-100 bg-opacity-50`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Comments</p>
                  <h3 className={`text-2xl font-bold mt-1 ${colors.text}`}>{totalMetrics.comments.toLocaleString()}</h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <MessageSquare size={20} className="text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className={`${colors.bgCard} rounded-lg p-4 border border-amber-100 bg-opacity-50`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">Total Shares</p>
                  <h3 className={`text-2xl font-bold mt-1 ${colors.text}`}>{totalMetrics.shares.toLocaleString()}</h3>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <Share2 size={20} className="text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className={`${colors.bgCard} rounded-lg shadow-md p-4 mb-6`}>
            <h2 className={`text-lg font-semibold mb-4 ${colors.text}`}>Shorts Performance Trends</h2>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="likes" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="comments" 
                  stroke="#8b5cf6" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="shares" 
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Comparison Chart */}
          <div className={`${colors.bgCard} rounded-lg shadow-md p-4 mb-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${colors.text}`}>Top Performing Shorts</h2>
              
              <div className="flex">
                <button 
                  onClick={() => setActiveMetric('views')}
                  className={`px-3 py-1 text-xs rounded-md mr-1 ${
                    activeMetric === 'views' 
                      ? 'bg-blue-100 text-blue-600' 
                      : `${colors.bgSection} ${colors.text} hover:bg-opacity-80`
                  }`}
                >
                  Views
                </button>
                <button
                  onClick={() => setActiveMetric('likes')}
                  className={`px-3 py-1 text-xs rounded-md mr-1 ${
                    activeMetric === 'likes' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Likes
                </button>
                <button 
                  onClick={() => setActiveMetric('comments')}
                  className={`px-3 py-1 text-xs rounded-md mr-1 ${
                    activeMetric === 'comments'
                      ? 'bg-purple-100 text-purple-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Comments
                </button>
                <button 
                  onClick={() => setActiveMetric('shares')}
                  className={`px-3 py-1 text-xs rounded-md ${
                    activeMetric === 'shares' 
                      ? 'bg-amber-100 text-amber-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Shares
                </button>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metricComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
                <Bar 
                  dataKey={activeMetric} 
                  fill={getMetricColor(activeMetric)} 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Shorts */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Shorts</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Added
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Likes
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comments
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shares
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shorts
                    .slice()
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .map((short) => (
                      <tr key={short._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={`https://img.youtube.com/vi/${short.youtubeId}/default.jpg`} 
                              alt={short.title}
                              className="h-10 w-16 object-cover rounded"
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-xs">
                                {short.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(short.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Eye size={14} className="text-blue-500 mr-1" />
                            {short.metrics?.views?.toLocaleString() || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <ThumbsUp size={14} className="text-green-500 mr-1" />
                            {short.metrics?.likes?.toLocaleString() || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <MessageSquare size={14} className="text-purple-500 mr-1" />
                            {short.metrics?.comments?.toLocaleString() || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Share2 size={14} className="text-amber-500 mr-1" />
                            {short.metrics?.shares?.toLocaleString() || 0}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShortsAnalytics;