import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const StyledCard = ({ children, className = "" }) => {
  const { theme } = useTheme();
  return (
    <div className={`${
      theme === 'dark' 
        ? 'bg-gray-800 text-white hover:shadow-gray-700' 
        : 'bg-white text-gray-800 hover:shadow-gray-200'
    } rounded-lg shadow-md p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}>
      {children}
    </div>
  );
};

const StyledSection = ({ title, children }) => {
  const { theme } = useTheme();
  return (
    <div className="mb-8">
      <h2 className={`text-3xl font-bold mb-6 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>{title}</h2>
      {children}
    </div>
  );
};

const StyledStatCard = ({ title, value, className = "" }) => {
  const { theme } = useTheme();
  return (
    <div className={`${
      theme === 'dark' 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-900'
    } rounded-lg shadow-md p-6 ${className}`}>
      <h3 className={`text-lg font-medium ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
      } mb-2`}>{title}</h3>
      <p className={`text-4xl font-bold ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>{value}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const { theme } = useTheme();
  const statusStyles = theme === 'dark' ? {
    done: "bg-green-900 text-green-200",
    "in-progress": "bg-yellow-900 text-yellow-200",
    "not-attended": "bg-red-900 text-red-200"
  } : {
    done: "bg-green-100 text-green-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    "not-attended": "bg-red-100 text-red-800"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

const InterviewCard = ({ type, data }) => {
  const { theme } = useTheme();
  return (
    <StyledCard>
      <div className="space-y-6">
        <div>
          <h3 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          } mb-2`}>{type}</h3>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{data.instructions}</p>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Duration: {data.duration}</p>
        </div>
        
        <div className="space-y-4">
          {data.previousDone?.length > 0 && (
            <div>
              <h4 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              } mb-2`}>Previous Interviews</h4>
              <div className="space-y-2">
                {data.previousDone.map(item => (
                  <div key={item.id} className={`flex justify-between items-center ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  } p-3 rounded-lg`}>
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{item.date}</span>
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>Score: {item.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </StyledCard>
  );
};

const JobCard = ({ job }) => {
  const { theme } = useTheme();
  return (
    <StyledCard className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 ${
        job.status === 'done' ? 'bg-green-500' :
        job.status === 'in-progress' ? 'bg-yellow-500' : 'bg-red-500'
      }`} />
      <div className="space-y-4">
        <div>
          <h3 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>{job.title}</h3>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{job.company}</p>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{job.location}</p>
        </div>
        <div className="flex justify-between items-center">
          <StatusBadge status={job.status} />
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200">
            Apply
          </button>
        </div>
      </div>
    </StyledCard>
  );
};

const NotificationCard = ({ notification }) => {
  const { theme } = useTheme();
  return (
    <StyledCard className="border-l-4 border-purple-600">
      <div className="space-y-2">
        <h3 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>{notification.title}</h3>
        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{notification.message}</p>
        <p className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>{notification.date}</p>
      </div>
    </StyledCard>
  );
};

const CourseCard = ({ course }) => {
  const { theme } = useTheme();
  return (
    <StyledCard className={`border-l-4 ${
      course.status === 'done' ? 'border-green-500' :
      course.status === 'in-progress' ? 'border-yellow-500' : 'border-red-500'
    }`}>
      <div className="space-y-2">
        <h3 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>{course.title}</h3>
        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Duration: {course.duration}</p>
        <StatusBadge status={course.status} />
      </div>
    </StyledCard>
  );
};

const ProfileSection = ({ profile }) => {
  const { theme } = useTheme();
  return (
    <StyledCard>
      <div className="flex items-center space-x-4">
        <img 
          src={profile.avatar} 
          alt="Profile" 
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h3 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>{profile.name}</h3>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{profile.email}</p>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{profile.phone}</p>
        </div>
      </div>
    </StyledCard>
  );
};

export {
  StyledCard,
  StyledSection,
  StyledStatCard,
  StatusBadge,
  InterviewCard,
  JobCard,
  NotificationCard,
  CourseCard,
  ProfileSection
};