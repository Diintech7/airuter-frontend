import React from 'react';
import { Home, Briefcase, Users, Calendar, BookOpen, User, HelpCircle, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PartnerMenu = ({ isExpanded, currentPath, handleNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const menuItems = [
    { icon: Home, label: 'Overview', path: '/partner/overview' },
    { icon: Briefcase, label: 'Job Listings', path: '/partner/job-listings' },
    { icon: Users, label: 'Candidate Access', path: '/partner/candidate-access' },
    { icon: Calendar, label: 'Interviews', path: '/partner/interviews' },
    { icon: BookOpen, label: 'Courses', path: '/partner/courses' },
    { icon: User, label: 'Account', path: '/partner/account' },
    { icon: HelpCircle, label: 'Help', path: '/partner/help' },
    { icon: Settings, label: 'Settings', path: '/partner/settings' },
  ];

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
              ${isActive
                ? isDark 
                  ? 'bg-blue-900/20 border-r-4 border-blue-500 text-blue-400'
                  : 'bg-blue-50 border-r-4 border-blue-600 text-blue-600'
                : isDark
                  ? 'text-gray-300 hover:bg-gray-700/50'
                  : 'text-gray-600 hover:bg-gray-50'
              }
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

export default PartnerMenu;