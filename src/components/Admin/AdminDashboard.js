import React, { useState, useEffect } from 'react';
import { useThemeStyles } from '../hooks/useThemeStyles';
import AdminStats from './AdminStats';
import AdminMenu from './AdminMenu';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { styles, colors } = useThemeStyles();
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({ 
    pendingAdmins: 0, 
    totalAdmins: 0, 
    totalUsers: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchDashboardData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Check for admin authentication
      const token = Cookies.get('admintoken');
      
      if (!token) {
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/admin/login') {
          navigate('/admin/login');
        }
        return;
      }

      // Make the request to the admin dashboard endpoint
      const response = await fetch('https://auriter-backen.onrender.com/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      // If unauthorized, redirect to login
      if (response.status === 401 || response.status === 403) {
        Cookies.remove('admintoken');
        Cookies.remove('adminUser');
        navigate('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.recentActivities) {
        setActivities(data.recentActivities);
      }

      if (data.stats) {
        setStats(data.stats);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up refresh interval - refresh data every 30 seconds
    const intervalId = setInterval(() => fetchDashboardData(true), 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [navigate]);

  const handleManualRefresh = () => {
    fetchDashboardData(true);
  };

  if (loading) {
    return (
      <div className={`${styles.pageContainer} flex flex-col items-center justify-center h-screen`}>
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
        <p className={`mt-4 text-lg ${colors.text}`}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.pageContainer} flex items-center justify-center h-screen`}>
        <div className={`p-8 rounded-lg ${colors.bgCard} border-l-4 border-red-500 max-w-md w-full shadow-lg`}>
          <h2 className={`text-xl font-bold mb-2 ${colors.textHeading}`}>Dashboard Error</h2>
          <p className={`${colors.text} font-medium mb-4`}>{error}</p>
          {error.includes('authentication') ? (
            <button 
              onClick={() => {
                Cookies.remove('admintoken');
                Cookies.remove('adminUser');
                navigate('/admin/login');
              }}
              className="w-full mt-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
            >
              Return to Login
            </button>
          ) : (
            <button 
              onClick={handleManualRefresh}
              className="w-full mt-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.pageContainer} pb-12`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Admin Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          <span className={`text-sm ${colors.textMuted} hidden md:inline`}>
            Last updated: {new Date().toLocaleTimeString()}
          </span>
          <button 
            onClick={handleManualRefresh}
            disabled={refreshing}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
              refreshing 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : `${colors.bgButton} ${colors.textButton} hover:bg-opacity-90`
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
      
      <AdminStats stats={stats} />
      
        
        
        <div className={`p-6 rounded-xl shadow-md ${colors.bgCard} border border-gray-100 dark:border-gray-700`}>
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activities
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className={`p-4 rounded-lg ${colors.bgSection} border-l-4 ${
                    activity.type === 'warning' ? 'border-yellow-500' : 
                    activity.type === 'error' ? 'border-red-500' : 
                    'border-green-500'
                  } hover:shadow-md transition-shadow duration-200`}
                >
                  <p className={`${colors.text} font-medium`}>{activity.message}</p>
                  <div className="flex justify-between mt-2 items-center">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className={`text-sm ${colors.textMuted}`}>
                        {new Date(activity.time).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className={`text-sm ${colors.textMuted}`}>{activity.applicant}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`p-6 rounded-lg ${colors.bgSection} text-center border border-dashed`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className={`${colors.text} mb-1`}>No recent activities</p>
                <p className={`text-sm ${colors.textMuted}`}>New activities will appear here</p>
              </div>
            )}
          </div>
        </div>

      {/* Additional dashboard sections could be added here */}
    </div>
  );
};

export default AdminDashboard;