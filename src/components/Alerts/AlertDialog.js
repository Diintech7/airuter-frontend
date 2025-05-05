import { useTheme } from '../../context/ThemeContext';

export const AlertDialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-md p-6 rounded-lg shadow-xl">
        {children}
      </div>
    </div>
  );
};

export const AlertDialogContent = ({ children, className = "" }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`space-y-4 ${isDark ? 'bg-gray-800' : 'bg-white'} ${className}`}>
      {children}
    </div>
  );
};

export const AlertDialogHeader = ({ children, className = "" }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const AlertDialogTitle = ({ children, className = "" }) => {
  const { isDark } = useTheme();
  
  return (
    <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : ''} ${className}`}>
      {children}
    </h2>
  );
};

export const AlertDialogDescription = ({ children, className = "" }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'} ${className}`}>
      {children}
    </div>
  );
};

export const AlertDialogFooter = ({ children, className = "" }) => (
  <div className={`flex justify-end space-x-2 mt-4 ${className}`}>
    {children}
  </div>
);

export const AlertDialogAction = ({ children, onClick, className = "" }) => {
  const { isDark } = useTheme();
  
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium text-white ${
        isDark ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'
      } rounded-md ${className}`}
    >
      {children}
    </button>
  );
};

export const AlertDialogCancel = ({ children, onClick, className = "" }) => {
  const { isDark } = useTheme();
  
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium ${
        isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } rounded-md ${className}`}
    >
      {children}
    </button>
  );
};