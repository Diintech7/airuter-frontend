import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LogOut, Bell, User, HelpCircle, Settings, Mic, Sun, Moon, RefreshCw } from 'lucide-react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import Airuter from '../assets/airuter_logo.png';
import SidebarMenu from './SidebarMenu';
import RecruiterMenu from './Recruiter/RecruiterMenu';
import PartnerMenu from './Partner/PartnerMenu';
import AdminMenu from './Admin/AdminMenu';
import CandidateMenu from './Candidate/CandidateMenu';
import Cookies from "js-cookie";
import { useTheme } from '../context/ThemeContext';

const SidebarLayout = ({ onLogout, userRole, userPermissions = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [profileComplete, setProfileComplete] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [currentMode, setCurrentMode] = useState('recruiter'); // 'recruiter' or 'partner'
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();

  // Updated logic: If user is partner, they automatically get recruiter permissions
  const isPartner = userPermissions.includes('partner') || userRole === 'partner';
  const isRecruiter = userPermissions.includes('recruiter') || userRole === 'recruiter' || isPartner; // Partner automatically gets recruiter access
  const isCandidate = userRole === 'candidate';
  const canSwitch = isPartner; // Only partners can switch modes (they have both partner and recruiter access)

  useEffect(() => {
    // Set currentPath based on current location
    setCurrentPath(location.pathname);
  }, [location]);

  useEffect(() => {
    if (userRole === 'admin') {
      setUsername('Administrator');
      return;
    }
    
    checkProfileStatus();
    fetchUserData();
    
    // Fetch company profile if user is a recruiter
    if (userRole === 'recruiter' || (isRecruiter && !isPartner)) {
      fetchCompanyProfile();
    }

    // Fetch partner profile if user is a partner
    if (userRole === 'partner' || isPartner) {
      fetchPartnerProfile();
    }

    // Fetch candidate data if user is a candidate
    if (isCandidate) {
      fetchCandidateData();
    }

    // Set initial mode based on current path
    if (location.pathname.startsWith('/partner/')) {
      setCurrentMode('partner');
    } else {
      setCurrentMode('recruiter');
    }
  }, [userRole, location.pathname]);

  const fetchCandidateData = async () => {
    try {
      const response = await fetch('https://airuter-backend.onrender.com/api/candidate/validate', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('candidatetoken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.candidate) {
          setUsername(data.candidate.name || 'Candidate');
          // Set institute name from partner data
          if (data.candidate.partner && data.candidate.partner.partnerName) {
            setInstituteName(data.candidate.partner.partnerName);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching candidate data:', error);
    }
  };

  const fetchCompanyProfile = async () => {
    try {
      const response = await fetch('https://airuter-backend.onrender.com/api/company/profile', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('usertoken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCompanyName(data.data.name || 'Company');
        }
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    }
  };

  const fetchPartnerProfile = async () => {
    try {
      const response = await fetch('https://airuter-backend.onrender.com/api/partner/profile', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('usertoken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.partner) {
          setPartnerName(data.partner.partnerName || 'Partner');
        }
      }
    } catch (error) {
      console.error('Error fetching partner profile:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('https://airuter-backend.onrender.com/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('usertoken')}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        if (userData && userData.name) {
          setUsername(userData.name);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const checkProfileStatus = async () => {
    try {
      const response = await fetch('https://airuter-backend.onrender.com/api/profile/status', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('usertoken')}`
        }
      });
      const data = await response.json();
      setProfileComplete(data.isComplete);
    } catch (error) {
      console.error('Error checking profile status:', error);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setCurrentPath(path);
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  const handleProfileClick = () => {
    if (userRole === 'admin') {
      navigate('/admin/settings');
    } else if (isCandidate) {
      navigate('/candidate/profile');
    } else if (currentMode === 'partner') {
      navigate('/partner/account');
    } else if (isRecruiter) {
      navigate('/company-profile');
    } else {
      navigate('/profile');
    }
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const handleModeSwitch = () => {
    const newMode = currentMode === 'recruiter' ? 'partner' : 'recruiter';
    setCurrentMode(newMode);
    
    // Navigate to appropriate dashboard
    if (newMode === 'partner') {
      navigate('/partner/overview');
    } else {
      navigate('/dashboard');
    }
  };

  // Get page title from current path
  const getPageTitle = () => {
    if (currentPath === '/dashboard' || currentPath === '/admin/dashboard') return 'Dashboard';
    if (currentPath === '/candidate/dashboard') return 'Dashboard';
    if (currentPath === '/partner/overview') return 'Overview';
    
    // Handle admin paths
    if (currentPath.startsWith('/admin/')) {
      return currentPath.slice(7).split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }

    // Handle partner paths
    if (currentPath.startsWith('/partner/')) {
      return currentPath.slice(9).split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }

    // Handle candidate paths
    if (currentPath.startsWith('/candidate/')) {
      return currentPath.slice(11).split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    
    // Remove leading slash and convert to title case
    return currentPath.slice(1).split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get current mode display name
  const getCurrentModeTitle = () => {
    if (userRole === 'admin') return 'Admin Portal';
    if (isCandidate) return 'Student Portal';
    if (currentMode === 'partner') return 'Partner Portal';
    if (isRecruiter) return 'Recruiter Portal';
    return 'User Portal'; // Default for regular users
  };
  
  // Get display name based on role and mode
  const getDisplayName = () => {
    if (userRole === 'admin') return 'Administrator';
    if (isCandidate) return username || 'Student';
    
    if (currentMode === 'partner' && isPartner) {
      return partnerName || username || 'Partner';
    }
    
    if (isRecruiter) {
      return companyName || username || 'Recruiter';
    }
    
    return username || 'User';
  };

  // Get avatar letter based on role and mode
  const getAvatarLetter = () => {
    if (userRole === 'admin') return 'A';
    if (isCandidate) return 'S';
    
    if (currentMode === 'partner' && isPartner) {
      return partnerName ? partnerName.charAt(0).toUpperCase() : 'P';
    }
    
    if (isRecruiter) {
      return companyName ? companyName.charAt(0).toUpperCase() : 
             (username ? username.charAt(0).toUpperCase() : 'R');
    }
    
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  // Get theme color based on user role
  const getThemeColor = () => {
    if (isCandidate) return 'yellow'; // Yellow theme for candidates
    if (currentMode === 'partner') return 'blue';
    return 'purple'; // Default purple for recruiters
  };

  const themeColor = getThemeColor();

  // Dynamic theme classes based on role
  const sidebarClass = isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200';
  const headerClass = isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200';
  const contentClass = isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900';
  const hoverClass = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const userBadgeClass = isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800';
  const textLight = isDark ? 'text-gray-400' : 'text-gray-500';

  // Theme-specific colors
  const getThemeClasses = () => {
    switch (themeColor) {
      case 'yellow':
        return {
          primary: 'bg-yellow-600',
          primaryHover: 'bg-yellow-700 hover:bg-yellow-600',
          primaryText: 'text-yellow-400',
          primaryTextDark: 'text-yellow-600'
        };
      case 'blue':
        return {
          primary: 'bg-blue-600',
          primaryHover: 'bg-blue-700 hover:bg-blue-600',
          primaryText: 'text-blue-400',
          primaryTextDark: 'text-blue-600'
        };
      default:
        return {
          primary: 'bg-purple-600',
          primaryHover: 'bg-purple-700 hover:bg-purple-600',
          primaryText: 'text-purple-400',
          primaryTextDark: 'text-purple-600'
        };
    }
  };

  const themeClasses = getThemeClasses();
  
  return (
    <div className={`flex h-screen ${contentClass}`}>
      {/* Sidebar */}
      <div className={`${sidebarClass} shadow-lg transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'} relative`}>
        {/* Logo */}
        <div className={`flex items-center p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div 
            className={`w-10 h-10 ${themeClasses.primary} rounded-full flex items-center justify-center overflow-hidden`}
            onClick={() => navigate(
              userRole === 'admin' ? '/admin/dashboard' : 
              isCandidate ? '/candidate/dashboard' :
              (currentMode === 'partner' ? '/partner/overview' : '/dashboard')
            )}
            style={{ cursor: 'pointer' }}
          >
            <img src={Airuter} alt="Logo" className="w-full h-full object-cover" />
          </div>
          {isExpanded && (
            <div className="ml-5">
              <span className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-700'} animate-fade-in block`}>
                {isCandidate && instituteName ? instituteName : 'Airuter'}
              </span>
              <span className={`text-xs ${themeClasses.primaryText} font-medium`}>
                {getCurrentModeTitle()}
              </span>
              
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute -right-3 ${canSwitch || isCandidate ? 'top-20' : 'top-8'} rounded-full p-2 shadow-md transition-colors ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-800'
          }`}
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Navigation items based on role and current mode */}
        {userRole === 'admin' ? (
          <AdminMenu
            isExpanded={isExpanded}
            currentPath={currentPath}
            handleNavigate={handleNavigate}
            isDark={isDark}
          />
        ) : isCandidate ? (
          // Candidates get their own menu with yellow theme
          <CandidateMenu
            isExpanded={isExpanded}
            currentPath={currentPath}
            handleNavigate={handleNavigate}
            isDark={isDark}
            themeColor="yellow"
          />
        ) : isPartner ? (
          // Partners can switch between partner and recruiter modes
          currentMode === 'partner' ? (
            <PartnerMenu
              isExpanded={isExpanded}
              currentPath={currentPath}
              handleNavigate={handleNavigate}
              isDark={isDark}
            />
          ) : (
            <RecruiterMenu
              isExpanded={isExpanded}
              currentPath={currentPath}
              handleNavigate={handleNavigate}
              isDark={isDark}
            />
          )
        ) : isRecruiter ? (
          // Regular recruiters only see recruiter menu
          <RecruiterMenu
            isExpanded={isExpanded}
            currentPath={currentPath}
            handleNavigate={handleNavigate}
            isDark={isDark}
          />
        ) : (
          // Regular users see default menu
          <SidebarMenu
            isExpanded={isExpanded}
            currentPath={currentPath}
            handleNavigate={handleNavigate}
            isDark={isDark}
          />
        )}

        {/* Settings button with dropdown */}
        <div className={`absolute bottom-0 w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} p-4`}>
          <div className="relative">
            <div 
              onClick={handleSettingsClick}
              className={`flex items-center justify-center cursor-pointer ${hoverClass} ${isDark ? 'text-white' : 'text-gray-700'} transition-colors duration-200 p-2 rounded-full`}
            >
              <Settings size={20} />
              {isExpanded && (
                <span className="ml-4">Settings</span>
              )}
            </div>

            {/* Settings Dropdown */}
            {showSettings && (
              <div className={`absolute bottom-full left-0 w-48 mb-2 py-2 rounded-lg shadow-lg ${isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}`}>
                {/* Switch Mode Button in Settings (only for partners) */}
                {canSwitch && (
                  <button
                    onClick={handleModeSwitch}
                    className={`w-full px-4 py-2 text-left flex items-center ${hoverClass} ${
                      currentMode === 'partner' 
                        ? isDark ? 'text-blue-400' : 'text-blue-600' 
                        : isDark ? 'text-purple-400' : 'text-purple-600'
                    }`}
                  >
                    <RefreshCw size={16} className="mr-2" />
                    <span>Switch to {currentMode === 'recruiter' ? 'Partner' : 'Recruiter'}</span>
                  </button>
                )}

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`w-full px-4 py-2 text-left flex items-center ${hoverClass} ${isDark ? 'text-white' : 'text-gray-700'}`}
                >
                  {isDark ? (
                    <>
                      <Sun size={16} className="mr-2" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon size={16} className="mr-2" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className={`w-full px-4 py-2 text-left flex items-center ${hoverClass} ${isDark ? 'text-red-400' : 'text-red-600'}`}
                >
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className={`${headerClass} shadow-md py-4 px-6 flex items-center justify-between`}>
          <div className="flex items-center">
            {(currentPath !== '/dashboard' && currentPath !== '/admin/dashboard' && currentPath !== '/candidate/dashboard' && currentPath !== '/partner/overview') && (
              <div className={`mr-4 cursor-pointer ${hoverClass} ${isDark ? 'text-gray-200' : 'text-gray-600'} transition-colors duration-200 p-2 rounded-full`}>
                <span className="font-semibold">
                  {getPageTitle()}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {userRole !== 'admin' && (
              <div 
                onClick={() => handleNavigate(isCandidate ? '/candidate/voice-assistant' : '/voice-assistant')}
                className={`mr-4 cursor-pointer ${hoverClass} ${isDark ? 'text-gray-200' : 'text-gray-600'} transition-colors duration-200 p-2 rounded-full`}
              >
                <Mic size={20} />
              </div>
            )}
            
            {/* Username/company display with avatar */}
            <div className="flex items-center mr-4">
              <div 
                onClick={handleProfileClick}
                className={`flex items-center cursor-pointer ${hoverClass} rounded-lg py-2 px-4`}
              >
                <div className={`w-10 h-10 rounded-full ${
                  userRole === 'admin' 
                    ? 'bg-red-600' 
                    : isCandidate
                      ? 'bg-yellow-600'
                      : currentMode === 'partner' 
                        ? 'bg-blue-600' 
                        : 'bg-purple-600'
                } flex items-center justify-center text-white font-medium overflow-hidden mr-3`}>
                  {getAvatarLetter()}
                </div>
                <div className="flex flex-col">
                  <span className={`${textLight} text-xs`}>Welcome</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {getDisplayName()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-auto p-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;