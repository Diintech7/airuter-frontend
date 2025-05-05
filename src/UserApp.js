import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { HMSRoomProvider } from '@100mslive/react-sdk';
import Cookies from 'js-cookie';
import { useTheme } from './context/ThemeContext';
import LandingPage from './LandingPage';
import AuthFlow from './components/Auth/AuthFlow';
import RoleSelectionPage from './components/Auth/RoleSelectionPage';
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
const UserApp = () => {
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const initializeAuth = async () => {
        const token = Cookies.get('usertoken');
        const userCookie = Cookies.get('user');
        
        if (token) {
          try {
            // If we have user data in cookie, use it initially
            if (userCookie) {
              const userData = JSON.parse(userCookie);
              setIsAuthenticated(true);
              setUserRole(userData.role);
            }
      
            // Validate the token with the server
            const response = await fetch('https://auriter-backen.onrender.com/api/auth/validate', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            const data = await response.json();
            
            if (data.success) {
              // Update with server-validated data
              setIsAuthenticated(true);
              setUserRole(data.role);
              
              // Update user cookie with latest data
              Cookies.set('user', JSON.stringify({
                role: data.role,
                name: data.name || (userCookie ? JSON.parse(userCookie).name : '')
              }), { expires: 7 });
            } else {
              throw new Error('Invalid token');
            }
          } catch (error) {
            console.error('Error validating token:', error);
            clearAuth();
          }
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
        
        setIsLoading(false);
      };
    initializeAuth();
  }, []);
  const clearAuth = () => {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('user', { path: '/' });
    setIsAuthenticated(false);
    setUserRole(null);
    setIsLoading(false);
  };
  const validateToken = async (token) => {
    try {
      const response = await fetch('https://auriter-backen.onrender.com/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        setUserRole(data.role);
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const handleAuthSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    console.log(`Auth success: role=${role}`);
  };
  const handleLogout = () => {
    clearAuth();
    navigate('/auth');
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
      <HMSRoomProvider>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> 
                : <LandingPage />
            } 
          />
          <Route path="/interview/:roomId" element={<InterviewRoom />} />
          <Route 
            path="/auth/callback" 
            element={
              isAuthenticated 
                ? <Navigate to="/dashboard" replace /> 
                : <AuthFlow onAuthSuccess={handleAuthSuccess} />
            } 
          />
          {isAuthenticated ? (
            <>
              <Route element={<SidebarLayout onLogout={handleLogout} userRole={userRole} />}>
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
                {userRole === 'recruiter' && (
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
              </Route>
              <Route 
                path="/role-selection" 
                element={<RoleSelectionPage onAuthSuccess={handleAuthSuccess} />} 
              />
              <Route path="/auth" element={<Navigate to="/dashboard" replace />} />
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