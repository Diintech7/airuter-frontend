import React from 'react';
import { Home, Users, Phone, Video, BookOpen, MessageSquare, FileText, UserPlus } from 'lucide-react';

const SidebarMenu = ({ isExpanded, currentPath, handleNavigate, isDark }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Jobs', path: '/jobs' },
    { icon: FileText, label: 'Jobs Applied', path: '/jobs-applied' },
    { icon: FileText, label: 'Resume Analyzer', path: '/resume-analyzer' },
    { icon: Phone, label: 'AI Telephonic', path: '/ai-telephonic' },
    { icon: Video, label: 'AI Video f2f', path: '/ai-video' },
    { icon: Video, label: 'Expert Video f2f', path: '/expert-video' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' }
  ];

  return (
    <nav className="mt-6">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;

        // Theme-aware styles
        const activeClass = isDark
          ? 'bg-gray-700 border-r-4 border-purple-500 text-purple-400'
          : 'bg-purple-50 border-r-4 border-purple-600 text-purple-600';
          
        const inactiveClass = isDark
          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';

        return (
          <div
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={`
              flex items-center px-4 py-3 cursor-pointer
              transition-colors duration-200
              ${isActive ? activeClass : inactiveClass}
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

export default SidebarMenu;