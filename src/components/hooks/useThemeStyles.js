// src/hooks/useThemeStyles.js
import { useTheme } from '../../context/ThemeContext';

/**
 * Custom hook that provides theme-aware styles
 * @returns {Object} Object containing theme variables and utility functions
 */
export const useThemeStyles = () => {
  const { theme, isDark } = useTheme();
  
  // Basic color variables
  const colors = {
    // Text colors
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    textHeading: isDark ? 'text-white' : 'text-gray-900',
    
    // Background colors
    bg: isDark ? 'bg-gray-900' : 'bg-gray-100',
    bgCard: isDark ? 'bg-gray-800' : 'bg-white',
    bgSection: isDark ? 'bg-gray-700' : 'bg-gray-50',
    
    // Input field specific colors
    bgInput: isDark ? 'bg-gray-700' : 'bg-white',
    inputBorder: isDark ? 'border-gray-600' : 'border-gray-300',
    inputPlaceholder: isDark ? 'placeholder-gray-400' : 'placeholder-gray-500',
    inputFocus: isDark ? 'focus:border-purple-400 focus:ring-purple-500/50' : 'focus:border-purple-500 focus:ring-purple-500/50',
    
    // Border colors
    border: isDark ? 'border-gray-600' : 'border-gray-300',
    
    // Brand colors with dark/light variants
    primary: isDark ? 'text-purple-400' : 'text-purple-600',
    primaryBg: isDark ? 'bg-purple-900' : 'bg-purple-100',
    primaryHover: isDark ? 'hover:text-purple-300' : 'hover:text-purple-700',
    
    // Button specific colors with enhanced hover effects
    buttonPrimary: isDark 
      ? 'bg-purple-700 hover:bg-purple-600 active:bg-purple-800 hover:shadow-lg hover:shadow-purple-900/30' 
      : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 hover:shadow-lg',
    buttonSecondary: isDark 
      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-800 hover:text-white' 
      : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 hover:text-gray-900',
    
    // Shadow with enhanced dark mode visibility
    shadow: isDark ? 'shadow-lg shadow-gray-900/30' : 'shadow-md',
    hoverShadow: isDark ? 'hover:shadow-xl hover:shadow-gray-900/40' : 'hover:shadow-lg',
  };
  
  // Combine common styling patterns into reusable objects
  const styles = {
    // Layout containers
    pageContainer: `min-h-screen ${colors.bg} transition-colors duration-300`,
    card: `${colors.bgCard} rounded-xl ${colors.shadow} ${colors.hoverShadow} transition-all duration-300`,
    
    // Text styles
    heading: `font-bold ${colors.text} transition-colors duration-300`,
    paragraph: `${colors.textSecondary} transition-colors duration-300`,
    
    // Form elements - Improved for dark mode
    input: `${colors.bgInput} ${colors.inputBorder} ${colors.text} ${colors.inputPlaceholder}
             rounded-lg ${colors.inputFocus} focus:ring-2 transition-colors duration-300`,
    label: `block text-base font-medium ${colors.text} mb-2 transition-colors duration-300`,
    fieldLabel: `block text-lg font-semibold ${colors.text} mb-2 transition-colors duration-300`,
    sectionLabel: `block text-xl font-bold ${colors.text} mb-3 transition-colors duration-300`,
    
    // Buttons with enhanced hover effects
    buttonPrimary: `px-4 py-2 ${colors.buttonPrimary} text-white rounded-lg transition-all duration-300`,
    buttonSecondary: `px-4 py-2 ${colors.buttonSecondary} border ${colors.border} rounded-lg transition-all duration-300`,
    
    // Status indicators
    error: isDark ? 'bg-red-900 text-red-200 border-red-700' : 'bg-red-50 text-red-800 border-red-200',
    success: isDark ? 'bg-green-900 text-green-200 border-green-700' : 'bg-green-50 text-green-800 border-green-200',
    warning: isDark ? 'bg-yellow-900 text-yellow-200 border-yellow-700' : 'bg-yellow-50 text-yellow-800 border-yellow-200',
    
    // Common utilities
    transition: 'transition-all duration-300',
    
    // Form group styling
    formGroup: `mb-6 space-y-2`,
    
    // Enhanced focus styles
    focusRing: `focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`,
    
    // Input fields specific styling
    formControl: `w-full px-3 py-2 border rounded-md ${colors.bgInput} ${colors.text} ${colors.inputBorder} 
                  ${colors.inputFocus} focus:ring-2 focus:outline-none transition-colors duration-300`,
    
    // Textarea fields
    textarea: `w-full px-3 py-2 border rounded-md ${colors.bgInput} ${colors.text} ${colors.inputBorder}
               ${colors.inputFocus} focus:ring-2 focus:outline-none transition-colors duration-300`,
  };
  
  // Utility function to combine classnames with theme awareness
  const cx = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };
  
  return {
    theme,
    isDark,
    colors,
    styles,
    cx
  };
};

export default useThemeStyles;