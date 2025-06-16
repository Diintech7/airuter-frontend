import React from 'react';
import { Home, Users, FileText, BookOpen, MessageSquare, Phone, Video, User, Award, Calendar } from 'lucide-react';

const CandidateMenu = ({ isExpanded, currentPath, handleNavigate, isDark, themeColor = 'yellow' }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard',path: '/candidate/dashboard' },
    { icon: Users, label: 'Jobs',path: '/candidate/jobs' },
    { icon: FileText, label: 'Jobs Applied',path: '/candidate/jobs-applied' },
    { icon: FileText, label: 'Resume Analyzer',path: '/candidate/resume-analyzer' },
    { icon: Phone, label: 'AI Telephonic',path: '/candidate/ai-telephonic' },
    { icon: Video, label: 'AI Video f2f',path: '/candidate/ai-video' },
    { icon: Video, label: 'Expert Video f2f',path: '/candidate/expert-video' },
    { icon: BookOpen, label: 'Courses',path: '/candidate/courses' },
    { icon: MessageSquare, label: 'Chat',path: '/candidate/chat' }
  ];

  // Theme-specific colors for yellow theme
  const getThemeClasses = () => {
    switch (themeColor) {
      case 'yellow':
        return {
          active: isDark
            ? 'bg-gray-700 border-r-4 border-yellow-500 text-yellow-400'
            : 'bg-yellow-50 border-r-4 border-yellow-600 text-yellow-600',
          inactive: isDark
            ? 'text-gray-300 hover:bg-gray-700 hover:text-yellow-400'
            : 'text-gray-600 hover:bg-yellow-50 hover:text-yellow-600',
          primaryText: isDark ? 'text-yellow-400' : 'text-yellow-600'
        };
      case 'blue':
        return {
          active: isDark
            ? 'bg-gray-700 border-r-4 border-blue-500 text-blue-400'
            : 'bg-blue-50 border-r-4 border-blue-600 text-blue-600',
          inactive: isDark
            ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400'
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600',
          primaryText: isDark ? 'text-blue-400' : 'text-blue-600'
        };
      default:
        return {
          active: isDark
            ? 'bg-gray-700 border-r-4 border-purple-500 text-purple-400'
            : 'bg-purple-50 border-r-4 border-purple-600 text-purple-600',
          inactive: isDark
            ? 'text-gray-300 hover:bg-gray-700 hover:text-purple-400'
            : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600',
          primaryText: isDark ? 'text-purple-400' : 'text-purple-600'
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <nav className="mt-6">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;

        return (
          <div
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={`
              flex items-center px-4 py-3 cursor-pointer
              transition-colors duration-200
              ${isActive ? themeClasses.active : themeClasses.inactive}
            `}
          >
            <Icon size={20} />
            {isExpanded && (
              <span className="ml-4 transition-opacity duration-200">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default CandidateMenu;