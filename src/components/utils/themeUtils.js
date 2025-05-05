// src/utils/themeUtils.js
import { useTheme } from '../context/ThemeContext';

/**
 * Returns theme-aware class names based on the current theme
 * @param {boolean} isDark - Whether the current theme is dark mode
 * @returns {Object} Object containing theme-specific class names
 */
export const getThemeClasses = (isDark) => {
  return {
    // Text colors
    textColor: isDark ? 'text-white' : 'text-gray-900',
    subTextColor: isDark ? 'text-gray-300' : 'text-gray-600',
    mutedTextColor: isDark ? 'text-gray-400' : 'text-gray-500',
    
    // Background colors
    pageBg: isDark ? 'bg-gray-900' : 'bg-gray-100',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    sectionBg: isDark ? 'bg-gray-700' : 'bg-gray-50',
    
    // Gradient backgrounds
    gradientBg: isDark ? 'from-gray-800 to-gray-900' : 'from-purple-50 to-purple-100',
    headerGradient: isDark ? 'from-purple-800 to-purple-950' : 'from-purple-600 to-purple-800',
    
    // Input fields
    inputBg: isDark ? 'bg-gray-700' : 'bg-white',
    inputBorder: isDark ? 'border-gray-600' : 'border-gray-300',
    inputText: isDark ? 'text-white' : 'text-gray-900',
    inputPlaceholder: isDark ? 'placeholder-gray-400' : 'placeholder-gray-500',
    inputFocus: isDark ? 'focus:border-purple-400 focus:ring-purple-400' : 'focus:border-purple-500 focus:ring-purple-500',
    
    // Form labels - Enhanced sizing and spacing
    label: isDark ? 'text-white font-medium text-base mb-2' : 'text-gray-900 font-medium text-base mb-2',
    labelLarge: isDark ? 'text-white font-semibold text-lg mb-3' : 'text-gray-900 font-semibold text-lg mb-3',
    labelSection: isDark ? 'text-white font-bold text-xl mb-3' : 'text-gray-900 font-bold text-xl mb-3',
    
    // Buttons
    primaryButtonBg: isDark ? 'bg-purple-700 hover:bg-purple-600 active:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800',
    secondaryButtonBg: isDark ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-800' : 'bg-white hover:bg-gray-50 active:bg-gray-100',
    secondaryButtonText: isDark ? 'text-gray-300' : 'text-gray-700',
    secondaryButtonBorder: isDark ? 'border-gray-600' : 'border-gray-200',
    
    // Status and alerts
    errorBg: isDark ? 'bg-red-900' : 'bg-red-50',
    errorBorder: isDark ? 'border-red-700' : 'border-red-200',
    errorText: isDark ? 'text-red-300' : 'text-red-800',
    
    successBg: isDark ? 'bg-green-900' : 'bg-green-50',
    successBorder: isDark ? 'border-green-700' : 'border-green-200',
    successText: isDark ? 'text-green-300' : 'text-green-800',
    
    warningBg: isDark ? 'bg-yellow-900' : 'bg-yellow-50',
    warningBorder: isDark ? 'border-yellow-700' : 'border-yellow-200',
    warningText: isDark ? 'text-yellow-300' : 'text-yellow-800',
    
    // Disabled states
    disabledBg: isDark ? 'disabled:bg-gray-600' : 'disabled:bg-gray-100',
    disabledText: isDark ? 'disabled:text-gray-400' : 'disabled:text-gray-500',
    
    // Hover states - Enhanced for better visibility
    hoverBg: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    hoverText: isDark ? 'hover:text-white' : 'hover:text-gray-900',
    
    // Borders
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    
    // Shadows - Enhanced for better contrast
    shadow: isDark ? 'shadow-lg shadow-gray-900/30' : 'shadow-md',
    hoverShadow: isDark ? 'hover:shadow-xl hover:shadow-gray-900/40' : 'hover:shadow-lg',
    
    // Form group spacing
    formGroup: 'mb-6 space-y-2',
  };
};

/**
 * HOC that injects theme classes into a component
 * @param {React.Component} Component - The component to wrap
 * @returns {React.Component} The wrapped component with theme props
 */
export const withTheme = (Component) => {
  return (props) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const themeClasses = getThemeClasses(isDark);
    
    return <Component {...props} theme={theme} isDark={isDark} themeClasses={themeClasses} />;
  };
};