import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { HMSRoomProvider } from '@100mslive/react-sdk';
import Cookies from 'js-cookie';
import { useTheme } from './context/ThemeContext';
import LandingPage from './LandingPage';
import AuthFlow from './components/Auth/AuthFlow';
import RoleSelectionPage from './components/Auth/RoleSelectionPage';
import CandidateLogin from './components/Auth/CandidateLogin';
import SidebarLayout from './components/SidebarLayout';
import DashboardContent from './components/Dashboard/DashboardContent';
import JobsContent from './components/Jobs/JobsContent';
import JobsAppliedContent from './components/Jobs/JobsAppliedContent';
import ResumeAnalyzerPage from './components/Resume/ResumeAnalyzerPage';
import ProfileSetup from './components/Profile/ProfileSetup';
import AiTelephonic from './components/AI/AiTelephonic';
import AiVideo from './components/AI/AiVideo';
import ExpertVideo from './components/AI/ExpertVideo';
import CoursesContent from './components/Courses/CoursesContent';
import ChatContent from './components/Chat/ChatContent';
import ProfileContent from './components/Profile/ProfileContent';
import SettingsContent from './components/Settings/SettingsContent';
import HelpContent from './components/Help/HelpContent';
import NotificationsContent from './components/Notifications/NotificationsContent';
import VoiceInteraction from './components/VoiceInteraction';
import InterviewRoom from './AI/InterviewRoom';
import PostJobsContent from './components/Jobs/PostJobsContent';
import MyListingsContent from './components/Listings/MyListingsContent';
import CandidatesContent from './components/Candidates/CandidatesContent';
import MessagesContent from './components/Messages/MessagesContent';
import InterviewResultsPage from './components/Candidates/InterviewResultsPage';
import InterviewResults from './components/InterviewResults/InterviewResults';
import CandidateProfile from './components/Candidates/CandidateProfile';
import DatastoreContent from './components/DataStore/DatastoreContent';
import JobPreviewPage from './components/Jobs/JobPreviewPage';
import JobDetail from './components/Jobs/JobDetail';
import EditJobContent from './components/Jobs/EditJobContent';
import JobApplicationsContent from './components/Applications/JobApplicationsContent';
import JobCandidatesContent from './components/Candidates/JobCandidatesContent';
import CompanyProfile from './components/Recruiter/CompanyProfile';
import PartnerOverview from './components/Partner/PartnerOverview';
import PartnerJobListings from './components/Partner/PartnerJobListings';
import PartnerCandidateAccess from './components/Partner/PartnerCandidateAccess';
import PartnerInterviews from './components/Partner/PartnerInterviews';
import PartnerCourses from './components/Partner/PartnerCourses';
import PartnerAccount from './components/Partner/PartnerAccount';
import PartnerHelp from './components/Partner/PartnerHelp';
import PartnerSettings from './components/Partner/PartnerSettings';
import CandidateDashboard from './components/Candidates/CandidateDashboard';

const UserApp = () => {
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [dashboardRoute, setDashboardRoute] = useState('/dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isPartner = userRole === 'partner' || userPermissions.includes('partner');
  const isRecruiter = userRole === 'recruiter' || userPermissions.includes('recruiter') || isPartner;
  const isCandidate = userRole === 'candidate';

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if any authentication token exists
      const hasToken = Cookies.get('usertoken') || 
                      Cookies.get('admintoken') || 
                      Cookies.get('candidatetoken');
      
      if (!hasToken) {
        setIsLoading(false);
        return;
      }

      // Use the universal auth check endpoint
      const response = await fetch('https://airuter-backend.onrender.com/api/auth/check', {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
          ...(hasToken && { 'Authorization': `Bearer ${hasToken}` })
        }
      });

      const data = await response.json();

      if (data.success && data.authenticated) {
        // Set authentication state from server response
        setIsAuthenticated(true);
        setUserRole(data.user.role);
        setUserPermissions(data.user.permissions || []);
        setUserData(data.user);
        setDashboardRoute(data.dashboardRoute);

        // Update user cookie with latest validated data
        Cookies.set('user', JSON.stringify({
          ...data.user,
          role: data.user.role,
          permissions: data.user.permissions || []
        }), { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });

        console.log('Authentication successful:', {
          role: data.user.role,
          dashboard: data.dashboardRoute,
          permissions: data.user.permissions
        });

      } else {
        // Authentication failed, clear all auth data
        clearAuth();
        console.log('Authentication failed:', data.message);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = () => {
    // Clear all possible authentication cookies
    Cookies.remove('usertoken', { path: '/' });
    Cookies.remove('admintoken', { path: '/' });
    Cookies.remove('candidatetoken', { path: '/' });
    Cookies.remove('user', { path: '/' });
    Cookies.remove('admin', { path: '/' });
    Cookies.remove('candidate', { path: '/' });
    
    setIsAuthenticated(false);
    setUserRole(null);
    setUserPermissions([]);
    setUserData(null);
    setDashboardRoute('/dashboard');
  };

  const handleAuthSuccess = (role, permissions = [], additionalData = {}) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserPermissions(permissions);
    setUserData(additionalData);
    
    // Set dashboard route based on role
    let route = '/dashboard';
    switch (role) {
      case 'candidate':
        route = '/candidate/dashboard';
        break;
      case 'admin':
        route = '/admin/dashboard';
        break;
      case 'partner':
        route = permissions.includes('partner') ? '/partner/overview' : '/dashboard';
        break;
      default:
        route = '/dashboard';
    }
    setDashboardRoute(route);
    
    console.log('Auth success:', { role, permissions, route });
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/auth');
  };

  // Determine the correct dashboard route based on current auth state
  const getCorrectDashboardRoute = () => {
    if (!isAuthenticated) return '/auth';
    
    switch (userRole) {
      case 'candidate':
        return '/candidate/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'partner':
        return isPartner ? '/partner/overview' : '/dashboard';
      case 'recruiter':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        <div className="ml-3 text-gray-600">Verifying authentication...</div>
      </div>
    );
  }

  return (
    <div className={`app-container ${theme}`}>
      <HMSRoomProvider>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to={getCorrectDashboardRoute()} replace /> 
                : <LandingPage />
            } 
          />
          
          <Route path="/interview/:roomId" element={<InterviewRoom />} />
          
          <Route 
            path="/candidate/login" 
            element={
              isAuthenticated && isCandidate ? 
                <Navigate to="/candidate/dashboard" replace /> 
                : <CandidateLogin onAuthSuccess={handleAuthSuccess} />
            } 
          />
          
          <Route 
            path="/auth/callback" 
            element={
              isAuthenticated 
                ? <Navigate to={getCorrectDashboardRoute()} replace /> 
                : <AuthFlow onAuthSuccess={handleAuthSuccess} />
            } 
          />

          {isAuthenticated ? (
            <>
              <Route element={<SidebarLayout onLogout={handleLogout} userRole={userRole} userPermissions={userPermissions} />}>
                {/* Candidate Routes */}
                {isCandidate && (
                  <>
                    <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
                    <Route path="/candidate/jobs" element={<JobsContent />} />
                    <Route path="/candidate/jobs-applied" element={<JobsAppliedContent />} />
                    <Route path="/candidate/resume-analyzer" element={<ResumeAnalyzerPage />} />
                    <Route path="/candidate/profile-setup" element={<ProfileSetup />} />
                    <Route path="/candidate/ai-telephonic" element={<AiTelephonic />} />
                    <Route path="/candidate/ai-video" element={<AiVideo />} />
                    <Route path="/candidate/expert-video" element={<ExpertVideo />} />
                    <Route path="/candidate/courses" element={<CoursesContent />} />
                    <Route path="/candidate/chat" element={<ChatContent />} />
                    <Route path="/candidate/profile" element={<ProfileContent />} />
                    <Route path="/candidate/settings" element={<SettingsContent />} />
                    <Route path="/candidate/help" element={<HelpContent />} />
                    <Route path="/candidate/notifications" element={<NotificationsContent />} />
                    <Route path="/candidate/voice-assistant" element={<VoiceInteraction />} />
                    <Route path="/jobs/detail/:jobId" element={<JobDetail />} />
                    <Route path="/detail/:jobId" element={<JobDetail />} />
                    <Route path="/edit-job/:jobId" element={<EditJobContent />} />
                    <Route path="/applications/:jobId" element={<JobApplicationsContent />} />
                    <Route path="/interview-results/:applicantId" element={<InterviewResultsPage />} />
                  </>
                )}

                {/* Regular User Routes */}
                {!isCandidate && (
                  <>
                    <Route path="/dashboard" element={<DashboardContent />} />
                    <Route path="/jobs" element={<JobsContent />} />
                    <Route path="/jobs-applied" element={<JobsAppliedContent />} />
                    <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
                    <Route path="/profile-setup" element={<ProfileSetup />} />
                    <Route path="/ai-telephonic" element={<AiTelephonic />} />
                    <Route path="/ai-video" element={<AiVideo />} />
                    <Route path="/expert-video" element={<ExpertVideo />} />
                    <Route path="/courses" element={<CoursesContent />} />
                    <Route path="/chat" element={<ChatContent />} />
                    <Route path="/profile" element={<ProfileContent />} />
                    <Route path="/settings" element={<SettingsContent />} />
                    <Route path="/help" element={<HelpContent />} />
                    <Route path="/notifications" element={<NotificationsContent />} />
                    <Route path="/voice-assistant" element={<VoiceInteraction />} />
                    <Route path="/jobs/detail/:jobId" element={<JobDetail />} />
                    <Route path="/detail/:jobId" element={<JobDetail />} />
                    <Route path="/edit-job/:jobId" element={<EditJobContent />} />
                    <Route path="/applications/:jobId" element={<JobApplicationsContent />} />
                    <Route path="/interview-results/:applicantId" element={<InterviewResultsPage />} />
                  </>
                )}

                {/* Recruiter Routes */}
                {isRecruiter && !isCandidate && (
                  <>
                    <Route path="/post-jobs" element={<PostJobsContent />} />
                    <Route path="/my-listings" element={<MyListingsContent />} />
                    <Route path="/candidates" element={<CandidatesContent />} />
                    <Route path="/candidates/:applicationId" element={<CandidateProfile />} />
                    <Route path="/candidates/:jobId" element={<CandidatesContent />} />
                    <Route path="/messages" element={<MessagesContent />} />
                    <Route path="/interview-resultss/:applicationId" element={<InterviewResults />} />
                    <Route path="/job-candidates/:jobId" element={<JobCandidatesContent />} />
                    <Route path="/company-profile" element={<CompanyProfile />} />
                    <Route path="/datastore" element={<DatastoreContent />} />
                    <Route path="/job-preview/:jobId" element={<JobPreviewPage />} />
                  </>
                )}

                {/* Partner Routes */}
                {isPartner && !isCandidate && (
                  <>
                    <Route path="/partner/overview" element={<PartnerOverview />} />
                    <Route path="/partner/job-listings" element={<PartnerJobListings />} />
                    <Route path="/partner/candidate-access" element={<PartnerCandidateAccess />} />
                    <Route path="/partner/interviews" element={<PartnerInterviews />} />
                    <Route path="/partner/courses" element={<PartnerCourses />} />
                    <Route path="/partner/account" element={<PartnerAccount />} />
                    <Route path="/partner/help" element={<PartnerHelp />} />
                    <Route path="/partner/settings" element={<PartnerSettings />} />
                  </>
                )}
              </Route>
              
              <Route 
                path="/role-selection" 
                element={<RoleSelectionPage onAuthSuccess={handleAuthSuccess} />} 
              />
              <Route path="/auth" element={<Navigate to={isCandidate ? "/candidate/dashboard" : "/dashboard"} replace />} />
            </>
          ) : (
            <>
              <Route path="/auth" element={<AuthFlow onAuthSuccess={handleAuthSuccess} />} />
              <Route path="/role-selection" element={<RoleSelectionPage onAuthSuccess={handleAuthSuccess} />} />
              <Route path="/jobs/detail/:jobId" element={<JobDetail />} />
              <Route path="/detail/:jobId" element={<JobDetail />} />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </>
          )}
          <Route path="/company-profile" element={<CompanyProfile />} />
        </Routes>
      </HMSRoomProvider>
    </div>
  );
};

export default UserApp;