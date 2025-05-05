import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-2xl rounded-lg shadow-xl">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className = "" }) => {
  const { isDark } = useTheme();
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const borderColor = isDark ? 'border border-gray-700' : 'border border-gray-200';
  
  return (
    <div className={`p-6 space-y-6 ${bgColor} ${textColor} ${borderColor} rounded-lg transition-colors duration-300 ${className}`}>
      {children}
    </div>
  );
};

export const DialogHeader = ({ children, className = "" }) => {
  const { isDark } = useTheme();
  const borderColor = isDark ? 'border-b border-gray-700' : 'border-b border-gray-200';
  
  return (
    <div className={`pb-4 mb-6 ${borderColor} ${className}`}>
      {children}
    </div>
  );
};

export const DialogTitle = ({ children, className = "" }) => {
  const { isDark } = useTheme();
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  
  return (
    <h2 className={`text-xl font-semibold ${textColor} transition-colors duration-300 ${className}`}>
      {children}
    </h2>
  );
};

export const DialogFooter = ({ children, className = "" }) => {
  const { isDark } = useTheme();
  const borderColor = isDark ? 'border-t border-gray-700' : 'border-t border-gray-200';
  
  return (
    <div className={`flex justify-end space-x-4 mt-6 ${borderColor} pt-6 ${className}`}>
      {children}
    </div>
  );
};