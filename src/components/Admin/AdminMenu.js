// Updated AdminMenu.js
import React, { useState } from 'react';
import { 
  Layout, Users, Database, BarChart3, Settings, FileText, 
  UserCog, CheckSquare, BookOpen, TicketIcon, CreditCard, 
  Video, ChevronDown, ChevronRight, LineChart
} from 'lucide-react';

const AdminMenu = ({ isExpanded, currentPath, handleNavigate, isDark }) => {
  const [expandedMenus, setExpandedMenus] = useState({
    shorts: false
  });

  const menuItems = [
    { icon: Layout, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Recruiter', path: '/admin/clients' },
    { icon: UserCog, label: 'User', path: '/admin/users' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: CheckSquare, label: 'Approvals', path: '/admin/approvals' },
    { icon: TicketIcon, label: 'Tickets', path: '/admin/tickets' },
    { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' }
  ];

  // Expandable menu items with sub-items
  const expandableMenuItems = [
    {
      id: 'shorts',
      icon: Video,
      label: 'Tips (Shorts)',
      subItems: [
        { label: 'Manage Shorts', path: '/admin/shorts' },
        { label: 'Analytics', path: '/admin/shorts/analytics' }
      ]
    }
  ];

  const toggleExpandMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const isSubItemActive = (path) => {
    return currentPath === path;
  };

  const isMenuActive = (menu) => {
    if (menu.path) {
      return currentPath === menu.path;
    }
    if (menu.subItems) {
      return menu.subItems.some(item => currentPath === item.path);
    }
    return false;
  };

  const itemClass = (active) => `
    flex items-center px-4 py-3 mb-1 transition-all duration-200 cursor-pointer
    ${active 
      ? (isDark ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600') 
      : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')}
    ${isExpanded ? 'justify-start' : 'justify-center'}
    rounded-md mx-2
  `;

  const subItemClass = (active) => `
    flex items-center px-4 py-2 ml-8 mb-1 transition-all duration-200 cursor-pointer text-sm
    ${active 
      ? (isDark ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600') 
      : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')}
    rounded-md
  `;

  return (
    <nav className="mt-6">
      {/* Regular menu items */}
      {menuItems.map((item) => (
        <div
          key={item.path}
          onClick={() => handleNavigate(item.path)}
          className={itemClass(isMenuActive(item))}
        >
          <item.icon size={20} />
          {isExpanded && <span className="ml-4">{item.label}</span>}
        </div>
      ))}

      {/* Expandable menu items */}
      {expandableMenuItems.map((menu) => (
        <div key={menu.id}>
          <div
            onClick={() => isExpanded ? toggleExpandMenu(menu.id) : handleNavigate(menu.subItems[0].path)}
            className={itemClass(isMenuActive(menu))}
          >
            <menu.icon size={20} />
            {isExpanded && (
              <>
                <span className="ml-4 flex-grow">{menu.label}</span>
                {expandedMenus[menu.id] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </>
            )}
          </div>

          {/* Sub menu items */}
          {isExpanded && expandedMenus[menu.id] && (
            <div className="mt-1 mb-2">
              {menu.subItems.map((subItem) => (
                <div
                  key={subItem.path}
                  onClick={() => handleNavigate(subItem.path)}
                  className={subItemClass(isSubItemActive(subItem.path))}
                >
                  {subItem.label === 'Analytics' ? (
                    <LineChart size={16} className="mr-2" />
                  ) : (
                    <div className="w-1 h-1 rounded-full bg-current mr-3 ml-1"></div>
                  )}
                  {subItem.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default AdminMenu;