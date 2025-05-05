import React from 'react';
import { Users, Briefcase, BarChart2, Settings, Shield, Home, Activity, Database } from 'lucide-react';

const AdminSidebarMenu = ({ isExpanded, currentPath, handleNavigate, isDark }) => {
  // Define navigation items for admin
  const menuItems = [
    {
      icon: <Home size={20} />,
      text: 'Dashboard',
      path: '/admin/dashboard',
      active: currentPath === '/admin/dashboard'
    },
    {
      icon: <Briefcase size={20} />,
      text: 'Client Management',
      path: '/admin/clients',
      active: currentPath.includes('/admin/clients')
    },
    {
      icon: <Users size={20} />,
      text: 'Candidate Management',
      path: '/admin/candidates', 
      active: currentPath.includes('/admin/candidates')
    },
    {
      icon: <Activity size={20} />,
      text: 'Platform Performance',
      path: '/admin/performance',
      active: currentPath === '/admin/performance'
    },
    {
      icon: <Database size={20} />,
      text: 'System Settings',
      path: '/admin/settings',
      active: currentPath === '/admin/settings'
    },
    {
      icon: <Shield size={20} />,
      text: 'Access Control',
      path: '/admin/access-control',
      active: currentPath === '/admin/access-control'
    }
  ];

  // Styles based on theme
  const activeClass = isDark 
    ? 'bg-purple-900 text-white' 
    : 'bg-purple-100 text-purple-900';
    
  const inactiveClass = isDark 
    ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';

  return (
    <div className="py-4">
      {menuItems.map((item, index) => (
        <div
          key={index}
          onClick={() => handleNavigate(item.path)}
          className={`flex items-center py-3 px-4 cursor-pointer transition-colors duration-200 ${
            item.active ? activeClass : inactiveClass
          } ${isExpanded ? 'justify-start' : 'justify-center'} rounded-lg mx-2 mb-1`}
        >
          <div className={item.active ? 'text-current' : ''}>
            {item.icon}
          </div>
          {isExpanded && (
            <span className="ml-4 font-medium">{item.text}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminSidebarMenu;