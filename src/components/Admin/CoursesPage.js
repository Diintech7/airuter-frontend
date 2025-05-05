import React, { useState } from 'react';
import { BookOpen, Search, Filter, MoreHorizontal, Plus, Users, Star, Clock, DollarSign } from 'lucide-react';
import { useThemeStyles } from '../hooks/useThemeStyles';

const CoursesPage = () => {
  const { styles, colors } = useThemeStyles();
  const [activeTab, setActiveTab] = useState('all');
  
  const courses = [
    {
      id: 'CRS-001',
      title: 'Advanced React Development',
      instructor: 'David Mitchell',
      category: 'Web Development',
      enrollments: 238,
      rating: 4.8,
      price: 99.99,
      status: 'active',
      created: '2025-02-15',
      duration: '42 hours',
      thumbnail: 'react-course.jpg',
      description: 'Master modern React including hooks, context API, and advanced state management.'
    },
    {
      id: 'CRS-002',
      title: 'Python for Data Science',
      instructor: 'Emma Roberts',
      category: 'Data Science',
      enrollments: 412,
      rating: 4.9,
      price: 129.99,
      status: 'active',
      created: '2025-01-10',
      duration: '56 hours',
      thumbnail: 'python-course.jpg',
      description: 'Comprehensive Python course for aspiring data scientists with practical projects.'
    },
    {
      id: 'CRS-003',
      title: 'UI/UX Design Fundamentals',
      instructor: 'Sarah Johnson',
      category: 'Design',
      enrollments: 156,
      rating: 4.6,
      price: 79.99,
      status: 'active',
      created: '2025-03-05',
      duration: '38 hours',
      thumbnail: 'uiux-course.jpg',
      description: 'Learn professional UI/UX design principles and create stunning interfaces.'
    },
    {
      id: 'CRS-004',
      title: 'Full Stack JavaScript',
      instructor: 'Robert Lewis',
      category: 'Web Development',
      enrollments: 325,
      rating: 4.7,
      price: 149.99,
      status: 'draft',
      created: '2025-04-15',
      duration: '65 hours',
      thumbnail: 'fullstack-course.jpg',
      description: 'Become a complete full-stack developer with JavaScript, Node.js, and MongoDB.'
    },
    {
      id: 'CRS-005',
      title: 'Machine Learning Basics',
      instructor: 'Jennifer Lee',
      category: 'Data Science',
      enrollments: 198,
      rating: 4.5,
      price: 119.99,
      status: 'active',
      created: '2025-02-28',
      duration: '48 hours',
      thumbnail: 'ml-course.jpg',
      description: 'Introduction to machine learning algorithms and applications with Python.'
    },
    {
      id: 'CRS-006',
      title: 'Digital Marketing Masterclass',
      instructor: 'Michael Brown',
      category: 'Marketing',
      enrollments: 254,
      rating: 4.7,
      price: 89.99,
      status: 'archived',
      created: '2024-12-10',
      duration: '36 hours',
      thumbnail: 'marketing-course.jpg',
      description: 'Comprehensive guide to digital marketing strategies and implementation.'
    }
  ];
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(course => course.status === activeTab);
  
  return (
    <div className={`${styles.pageContainer} pb-12`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${colors.textHeading}`}>Courses Management</h1>
          <p className={colors.textMuted}>View and manage all course content</p>
        </div>
        <div className="flex space-x-2">
          <button className={`px-4 py-2 bg-red-600 text-white rounded-md flex items-center ${styles.buttonHover}`}>
            <Plus size={16} className="mr-2" />
            Add New Course
          </button>
        </div>
      </div>
      
      <div className={`${colors.bgCard} rounded-lg shadow-md mb-6 border ${colors.borderColor}`}>
        <div className="flex flex-wrap p-4 border-b">
          <div className="mr-4 mb-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search courses..." 
                className={`pl-10 pr-4 py-2 border rounded-md w-64 ${colors.inputBg} ${colors.text}`}
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          <div className="mr-4 mb-2">
            <button className={`px-4 py-2 border rounded-md flex items-center ${colors.borderColor} ${colors.text}`}>
              <Filter size={16} className="mr-2" />
              Filter
            </button>
          </div>
          <div className="flex-grow"></div>
          <div className="flex space-x-1">
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-100' : `${colors.bgSection} ${colors.text}`}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'active' ? 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-100' : `${colors.bgSection} ${colors.text}`}`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'draft' ? 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-100' : `${colors.bgSection} ${colors.text}`}`}
              onClick={() => setActiveTab('draft')}
            >
              Draft
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'archived' ? 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-100' : `${colors.bgSection} ${colors.text}`}`}
              onClick={() => setActiveTab('archived')}
            >
              Archived
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className={`${colors.bgCard} border ${colors.borderColor} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200`}>
              <div className="h-36 bg-gray-200 dark:bg-gray-700 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={`/api/placeholder/300/150`} 
                    alt={`${course.title} thumbnail`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(course.status)}`}>
                    {course.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className={`text-lg font-medium ${colors.textHeading} truncate`} title={course.title}>
                    {course.title}
                  </h3>
                  <button className={`${colors.textMuted} hover:${colors.text}`}>
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                
                <p className={`text-sm ${colors.textMuted} mt-1 line-clamp-2`} title={course.description}>
                  {course.description}
                </p>
                
                <div className={`mt-4 flex items-center text-sm ${colors.textMuted}`}>
                  <div className="flex items-center mr-4">
                    <Users size={14} className="mr-1" />
                    {course.enrollments}
                  </div>
                  <div className="flex items-center mr-4">
                    <Star size={14} className="mr-1 text-yellow-500" />
                    {course.rating}
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {course.duration}
                  </div>
                </div>
                
                <div className={`mt-4 pt-4 border-t ${colors.borderColor} flex justify-between items-center`}>
                  <div className={`text-sm font-medium ${colors.text}`}>
                    {course.instructor}
                  </div>
                  <div className="text-lg font-bold text-red-600 dark:text-red-500 flex items-center">
                    <DollarSign size={16} />
                    {course.price}
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-100 rounded-md text-sm font-medium">
                    Edit
                  </button>
                  <button className={`flex-1 px-3 py-2 border ${colors.borderColor} ${colors.text} rounded-md text-sm font-medium`}>
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`px-6 py-4 border-t ${colors.borderColor} flex items-center justify-between`}>
          <div className={`text-sm ${colors.textMuted}`}>
            Showing {filteredCourses.length} courses
          </div>
          <div className="flex space-x-2">
            <button className={`px-3 py-1 border rounded-md ${colors.borderColor} ${colors.text}`}>Previous</button>
            <button className="px-3 py-1 bg-red-600 text-white rounded-md">1</button>
            <button className={`px-3 py-1 border rounded-md ${colors.borderColor} ${colors.text}`}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;