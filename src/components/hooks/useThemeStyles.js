// Enhanced useThemeStyles.js with better input field support
import { useTheme } from '../../context/ThemeContext';

export const useThemeStyles = () => {
  const { theme, isDark } = useTheme();
  
  // Enhanced color variables with better input field support
  const colors = {
    // Text colors with improved contrast
    text: isDark ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    textHeading: isDark ? 'text-white' : 'text-gray-900',
    
    // Background colors
    bg: isDark ? 'bg-gray-900' : 'bg-gray-100',
    bgCard: isDark ? 'bg-gray-800' : 'bg-white',
    bgSection: isDark ? 'bg-gray-700' : 'bg-gray-50',
    
    // Enhanced input field colors with better contrast
    bgInput: isDark ? 'bg-gray-700' : 'bg-white',
    inputText: isDark ? 'text-gray-100' : 'text-gray-900',
    inputBorder: isDark ? 'border-gray-500' : 'border-gray-300',
    inputBorderFocus: isDark ? 'border-purple-400' : 'border-purple-500',
    inputPlaceholder: isDark ? 'placeholder-gray-400' : 'placeholder-gray-500',
    inputFocus: isDark ? 'focus:border-purple-400 focus:ring-purple-400/50' : 'focus:border-purple-500 focus:ring-purple-500/50',
    
    // Select and dropdown specific
    selectBg: isDark ? 'bg-gray-700' : 'bg-white',
    selectText: isDark ? 'text-gray-100' : 'text-gray-900',
    selectBorder: isDark ? 'border-gray-500' : 'border-gray-300',
    
    // Textarea specific  
    textareaBg: isDark ? 'bg-gray-700' : 'bg-white',
    textareaText: isDark ? 'text-gray-100' : 'text-gray-900',
    textareaBorder: isDark ? 'border-gray-500' : 'border-gray-300',
    
    // Border colors
    border: isDark ? 'border-gray-600' : 'border-gray-300',
    borderLight: isDark ? 'border-gray-700' : 'border-gray-200',
    
    // Brand colors
    primary: isDark ? 'text-purple-400' : 'text-purple-600',
    primaryBg: isDark ? 'bg-purple-900' : 'bg-purple-100',
    primaryHover: isDark ? 'hover:text-purple-300' : 'hover:text-purple-700',
    
    // Button colors
    buttonPrimary: isDark 
      ? 'bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white hover:shadow-lg hover:shadow-purple-900/30' 
      : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white hover:shadow-lg',
    buttonSecondary: isDark 
      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 active:bg-gray-800 hover:text-white border-gray-600' 
      : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 hover:text-gray-900 border-gray-300',
    
    // Status colors
    success: isDark ? 'text-green-400' : 'text-green-600',
    successBg: isDark ? 'bg-green-900/50' : 'bg-green-50',
    successBorder: isDark ? 'border-green-700' : 'border-green-200',
    
    error: isDark ? 'text-red-400' : 'text-red-600',
    errorBg: isDark ? 'bg-red-900/50' : 'bg-red-50',
    errorBorder: isDark ? 'border-red-700' : 'border-red-200',
    
    warning: isDark ? 'text-yellow-400' : 'text-yellow-600',
    warningBg: isDark ? 'bg-yellow-900/50' : 'bg-yellow-50',
    warningBorder: isDark ? 'border-yellow-700' : 'border-yellow-200',
    
    // Shadows
    shadow: isDark ? 'shadow-lg shadow-gray-900/30' : 'shadow-md',
    hoverShadow: isDark ? 'hover:shadow-xl hover:shadow-gray-900/40' : 'hover:shadow-lg',
  };
  
  // Enhanced component styles
  const styles = {
    // Layout containers
    pageContainer: `min-h-screen ${colors.bg} transition-colors duration-300`,
    card: `${colors.bgCard} rounded-xl ${colors.shadow} ${colors.hoverShadow} transition-all duration-300`,
    
    // Text styles
    heading: `font-bold ${colors.text} transition-colors duration-300`,
    paragraph: `${colors.textSecondary} transition-colors duration-300`,
    
    // Enhanced form elements with proper text visibility
    input: `w-full px-3 py-2 ${colors.bgInput} ${colors.inputText} ${colors.inputBorder} ${colors.inputPlaceholder} 
            rounded-lg border ${colors.inputFocus} focus:ring-2 focus:outline-none 
            transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`,
    
    select: `w-full px-3 py-2 ${colors.selectBg} ${colors.selectText} ${colors.selectBorder} 
             rounded-lg border focus:ring-2 ${colors.inputFocus} focus:outline-none 
             transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`,
    
    textarea: `w-full px-3 py-2 ${colors.textareaBg} ${colors.textareaText} ${colors.textareaBorder} 
               ${colors.inputPlaceholder} rounded-lg border ${colors.inputFocus} focus:ring-2 
               focus:outline-none transition-all duration-300 resize-vertical min-h-[100px]
               disabled:opacity-50 disabled:cursor-not-allowed`,
    
    // Labels with better contrast
    label: `block text-sm font-medium ${colors.text} mb-1 transition-colors duration-300`,
    labelLarge: `block text-base font-semibold ${colors.text} mb-2 transition-colors duration-300`,
    labelSection: `block text-lg font-bold ${colors.text} mb-3 transition-colors duration-300`,
    
    // Buttons with enhanced styling
    buttonPrimary: `px-4 py-2 ${colors.buttonPrimary} rounded-lg font-medium transition-all duration-300 
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                    disabled:opacity-50 disabled:cursor-not-allowed`,
    
    buttonSecondary: `px-4 py-2 ${colors.buttonSecondary} border rounded-lg font-medium 
                      transition-all duration-300 focus:outline-none focus:ring-2 
                      focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 
                      disabled:cursor-not-allowed`,
    
    // Form groups
    formGroup: `mb-6 space-y-2`,
    formRow: `grid grid-cols-1 md:grid-cols-2 gap-4`,
    
    // Status indicators
    error: `p-3 rounded-lg ${colors.errorBg} ${colors.error} ${colors.errorBorder} border`,
    success: `p-3 rounded-lg ${colors.successBg} ${colors.success} ${colors.successBorder} border`,
    warning: `p-3 rounded-lg ${colors.warningBg} ${colors.warning} ${colors.warningBorder} border`,
    
    // Common utilities
    transition: 'transition-all duration-300',
    focusRing: 'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
  };
  
  // Utility function to combine classnames
  const cx = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };
  
  // Helper function to get input styles with custom classes
  const getInputStyles = (customClasses = '') => {
    return cx(styles.input, customClasses);
  };
  
  // Helper function to get select styles with custom classes
  const getSelectStyles = (customClasses = '') => {
    return cx(styles.select, customClasses);
  };
  
  // Helper function to get textarea styles with custom classes
  const getTextareaStyles = (customClasses = '') => {
    return cx(styles.textarea, customClasses);
  };
  
  return {
    theme,
    isDark,
    colors,
    styles,
    cx,
    getInputStyles,
    getSelectStyles,
    getTextareaStyles
  };
};

export default useThemeStyles;