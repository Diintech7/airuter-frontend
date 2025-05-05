import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useThemeStyles } from '../hooks/useThemeStyles';

export const Card = ({ children, className = "" }) => {
  const { isDark } = useTheme();
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  // Enhanced shadow for dark mode
  const shadowClass = isDark ? 'shadow-lg shadow-gray-900/30' : 'shadow-md';
  
  return (
    <div className={`${bgColor} rounded-lg ${shadowClass} hover:shadow-xl transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => {
  const { isDark } = useTheme();
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';
  
  return (
    <div className={`p-6 ${borderColor} ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = "" }) => {
  const { isDark } = useTheme();
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  
  return (
    <h2 className={`text-2xl font-semibold ${textColor} transition-colors duration-300 ${className}`}>
      {children}
    </h2>
  );
};

export const CardDescription = ({ children, className = "" }) => {
  const { isDark } = useTheme();
  const textColor = isDark ? 'text-gray-300' : 'text-gray-500';
  
  return (
    <p className={`${textColor} mt-1 transition-colors duration-300 ${className}`}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = "" }) => {
  const { isDark } = useTheme();
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';
  
  return (
    <div className={`p-6 pt-0 border-t ${borderColor} transition-colors duration-300 ${className}`}>
      {children}
    </div>
  );
};