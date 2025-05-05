import React from 'react';
import { Home, Briefcase, Users, FileText, MessageSquare, Database } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const RecruiterMenu = ({ isExpanded, currentPath, handleNavigate }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'My Job Listings', path: '/my-listings' },
    { icon: Users, label: 'Candidates', path: '/candidates' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: Database, label: 'Datastore', path: '/datastore' },
  
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
                  ? 'bg-purple-900/20 border-r-4 border-purple-500 text-purple-400'
                  : 'bg-purple-50 border-r-4 border-purple-600 text-purple-600'
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

export default RecruiterMenu;