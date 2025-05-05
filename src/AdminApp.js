import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useTheme } from './context/ThemeContext';
import AdminLoginPage from './components/Auth/AdminLoginPage';
import AdminRegistrationPage from './components/Auth/AdminRegistrationPage';
import SidebarLayout from './components/SidebarLayout';
import AdminDashboard from './components/Admin/AdminDashboard';
import RecruiterManagement from './components/Admin/RecruiterManagement';
import DataAnalytics from './components/Admin/DataAnalytics';
import UserManagement from './components/Admin/UserManagement';
import SystemSettings from './components/Admin/SystemSettings';
import AdminApprovals from './components/Admin/AdminApprovals';
import Tickets from './components/Admin/TicketsPage';
import Courses from './components/Admin/CoursesPage';
import Payments from './components/Admin/PaymentsPage';
import Shorts from './components/Admin/ShortsPage';
import ShortsAnalytics from './components/Admin/ShortsAnalytics';
import RecruiterJobsView from './components/Admin/RecruiterJobsView';
import RecruiterApplicationsView from './components/Admin/RecruiterApplicationsView';
import JobDetail from './components/Jobs/JobDetail';
import JobApplicationsContent from './components/Applications/JobApplicationsContent';
import LandingPage from './LandingPage';
const AdminApp = () => {
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const initializeAuth = async () => {
      const adminToken = Cookies.get('admintoken');
      const adminUser = Cookies.get('adminUser');
      if (adminToken && adminUser) {
        try {
          const userData = JSON.parse(adminUser);
          if (userData.role === 'admin') {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error parsing admin user data:', error);
          clearAuth();
          return;
        }
      }
      setIsLoading(false);
      setIsAuthenticated(false);
    };
    initializeAuth();
  }, []);
  const clearAuth = () => {
    Cookies.remove('admintoken', { path: '/' });
    Cookies.remove('adminUser', { path: '/' });
    setIsAuthenticated(false);
    setIsLoading(false);
  };
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    console.log("Admin authentication successful");
  };
  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login');
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  return (
    <div className={`app-container ${theme}`}>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/admin/dashboard" replace /> : 
              <AdminLoginPage onAuthSuccess={handleAuthSuccess} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
              <Navigate to="/admin/dashboard" replace /> : 
              <AdminRegistrationPage />
          } 
        />
        {isAuthenticated ? (
          <Route element={<SidebarLayout onLogout={handleLogout} userRole="admin" />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/clients" element={<RecruiterManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/analytics" element={<DataAnalytics />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="/approvals" element={<AdminApprovals />} />
            <Route path='/tickets' element={<Tickets />} />
            <Route path='/courses' element={<Courses />} />
            <Route path='/payments' element={<Payments />} />
            <Route path='/shorts' element={<Shorts />} />
            <Route path='/shorts/analytics' element={<ShortsAnalytics />} />
            <Route path="/recruiter/:recruiterId/jobs" element={<RecruiterJobsView />} />
            <Route path="/recruiter/:recruiterId/applications" element={<RecruiterApplicationsView />} />
            <Route path="/jobs/:jobId" element={<JobDetail />} />
            <Route path="/applications/:applicationId" element={<JobApplicationsContent />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        )}
      </Routes>
    </div>
  );
};
export default AdminApp;