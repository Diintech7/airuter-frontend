import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LogOut, Bell, User, HelpCircle, Settings, Mic, Sun, Moon } from 'lucide-react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import Airuter from '../assets/airuter_logo.png';
import SidebarMenu from './SidebarMenu';
import RecruiterMenu from './Recruiter/RecruiterMenu';
import AdminMenu from './Admin/AdminMenu';  // New admin menu
import Cookies from "js-cookie";
import { useTheme } from '../context/ThemeContext';

const SidebarLayout = ({ onLogout, userRole }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [profileComplete, setProfileComplete] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState('');
  const [companyName, setCompanyName] = useState('');
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();

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
    if (userRole === 'recruiter') {
      fetchCompanyProfile();
    }
  }, [userRole]);

  const fetchCompanyProfile = async () => {
    try {
      const response = await fetch('https://auriter-backen.onrender.com/api/company/profile', {
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

  const fetchUserData = async () => {
    try {
      const response = await fetch('https://auriter-backen.onrender.com/api/auth/validate', {
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
      const response = await fetch('https://auriter-backen.onrender.com/api/profile/status', {
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
    } else if (userRole === 'recruiter') {
      navigate('/company-profile');
    } else {
      navigate('/profile');
    }
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  // Get page title from current path
  const getPageTitle = () => {
    if (currentPath === '/dashboard' || currentPath === '/admin/dashboard') return 'Dashboard';
    
    // Handle admin paths
    if (currentPath.startsWith('/admin/')) {
      return currentPath.slice(7).split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    
    // Remove leading slash and convert to title case
    return currentPath.slice(1).split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Common theme classes
  const sidebarClass = isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200';
  const headerClass = isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200';
  const contentClass = isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900';
  const hoverClass = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const userBadgeClass = isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800';
  const textLight = isDark ? 'text-gray-400' : 'text-gray-500';
  
  return (
    <div className={`flex h-screen ${contentClass}`}>
      {/* Sidebar */}
      <div className={`${sidebarClass} shadow-lg transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'} relative`}>
        {/* Logo */}
        <div className={`flex items-center  p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div 
            className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden"
            onClick={() => navigate(userRole === 'admin' ? '/admin/dashboard' : '/dashboard')}
            style={{ cursor: 'pointer' }}
          >
            <img src={Airuter} alt="Logo" className="w-full h-full object-cover" />
          </div>
          {isExpanded && (
            <span className={`ml-5 font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-700'} animate-fade-in`}>
              {'Airuter'}
            </span>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute -right-3 top-8 rounded-full p-2 shadow-md transition-colors ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-800'
          }`}
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Navigation items based on role */}
        {userRole === 'admin' ? (
          <AdminMenu
            isExpanded={isExpanded}
            currentPath={currentPath}
            handleNavigate={handleNavigate}
            isDark={isDark}
          />
        ) : userRole === 'recruiter' ? (
          <RecruiterMenu
            isExpanded={isExpanded}
            currentPath={currentPath}
            handleNavigate={handleNavigate}
            isDark={isDark}
          />
        ) : (
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
            {(currentPath !== '/dashboard' && currentPath !== '/admin/dashboard') && (
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
                onClick={() => handleNavigate('/voice-assistant')}
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
                <div className={`w-10 h-10 rounded-full ${userRole === 'admin' ? 'bg-red-600' : 'bg-purple-600'} flex items-center justify-center text-white font-medium overflow-hidden mr-3`}>
                  {userRole === 'admin' ? 'A' : (userRole === 'recruiter' && companyName ? 
                    companyName.charAt(0).toUpperCase() : 
                    (username ? username.charAt(0).toUpperCase() : <User size={16} />)
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={`${textLight} text-xs`}>Welcome</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {userRole === 'admin' ? 'Administrator' : (userRole === 'recruiter' && companyName ? companyName : (username || 'User'))}
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