// Enhanced themeUtils.js with better input field support
import { useTheme } from '../../context/ThemeContext';

/**
 * Returns comprehensive theme-aware class names with enhanced input field support
 * @param {boolean} isDark - Whether the current theme is dark mode
 * @returns {Object} Object containing theme-specific class names
 */
export const getThemeClasses = (isDark) => {
  return {
    // Text colors with improved contrast
    textColor: isDark ? 'text-gray-100' : 'text-gray-900',
    subTextColor: isDark ? 'text-gray-300' : 'text-gray-600',
    mutedTextColor: isDark ? 'text-gray-400' : 'text-gray-500',
    headingColor: isDark ? 'text-white' : 'text-gray-900',
    
    // Background colors
    pageBg: isDark ? 'bg-gray-900' : 'bg-gray-100',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    sectionBg: isDark ? 'bg-gray-700' : 'bg-gray-50',
    
    // Enhanced input field styles with guaranteed text visibility
    inputBg: isDark ? 'bg-gray-700' : 'bg-white',
    inputText: isDark ? 'text-gray-100' : 'text-gray-900',
    inputBorder: isDark ? 'border-gray-500' : 'border-gray-300',
    inputBorderHover: isDark ? 'hover:border-gray-400' : 'hover:border-gray-400',
    inputBorderFocus: isDark ? 'focus:border-purple-400' : 'focus:border-purple-500',
    inputPlaceholder: isDark ? 'placeholder-gray-400' : 'placeholder-gray-500',
    inputFocus: isDark ? 'focus:border-purple-400 focus:ring-purple-400/50' : 'focus:border-purple-500 focus:ring-purple-500/50',
    
    // Select dropdown specific styles
    selectBg: isDark ? 'bg-gray-700' : 'bg-white',
    selectText: isDark ? 'text-gray-100' : 'text-gray-900',
    selectBorder: isDark ? 'border-gray-500' : 'border-gray-300',
    selectArrow: isDark ? 'text-gray-400' : 'text-gray-500',
    
    // Textarea specific styles
    textareaBg: isDark ? 'bg-gray-700' : 'bg-white',
    textareaText: isDark ? 'text-gray-100' : 'text-gray-900',
    textareaBorder: isDark ? 'border-gray-500' : 'border-gray-300',
    
    // Checkbox and radio styles
    checkboxBg: isDark ? 'bg-gray-700' : 'bg-white',
    checkboxBorder: isDark ? 'border-gray-500' : 'border-gray-300',
    checkboxChecked: isDark ? 'bg-purple-600 border-purple-600' : 'bg-purple-600 border-purple-600',
    
    // Form labels with enhanced sizing and spacing
    label: isDark ? 'text-gray-100 font-medium text-sm mb-1' : 'text-gray-900 font-medium text-sm mb-1',
    labelLarge: isDark ? 'text-gray-100 font-semibold text-base mb-2' : 'text-gray-900 font-semibold text-base mb-2',
    labelSection: isDark ? 'text-white font-bold text-lg mb-3' : 'text-gray-900 font-bold text-lg mb-3',
    
    // Buttons with enhanced hover effects
    primaryButton: isDark 
      ? 'bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white border-transparent' 
      : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white border-transparent',
    
    secondaryButton: isDark 
      ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-gray-200 hover:text-white border-gray-600' 
      : 'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 hover:text-gray-900 border-gray-300',
    
    // Status and validation styles
    errorInput: isDark 
      ? 'border-red-500 bg-red-900/20 text-red-300 focus:border-red-400 focus:ring-red-400/50' 
      : 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500/50',
    
    successInput: isDark 
      ? 'border-green-500 bg-green-900/20 text-green-300 focus:border-green-400 focus:ring-green-400/50' 
      : 'border-green-300 bg-green-50 text-green-900 focus:border-green-500 focus:ring-green-500/50',
    
    // Error messages
    errorText: isDark ? 'text-red-400' : 'text-red-600',
    errorBg: isDark ? 'bg-red-900/50' : 'bg-red-50',
    errorBorder: isDark ? 'border-red-700' : 'border-red-200',
    
    // Success messages
    successText: isDark ? 'text-green-400' : 'text-green-600',
    successBg: isDark ? 'bg-green-900/50' : 'bg-green-50',
    successBorder: isDark ? 'border-green-700' : 'border-green-200',
    
    // Warning messages
    warningText: isDark ? 'text-yellow-400' : 'text-yellow-600',
    warningBg: isDark ? 'bg-yellow-900/50' : 'bg-yellow-50',
    warningBorder: isDark ? 'border-yellow-700' : 'border-yellow-200',
    
    // Disabled states
    disabledBg: isDark ? 'disabled:bg-gray-600' : 'disabled:bg-gray-100',
    disabledText: isDark ? 'disabled:text-gray-500' : 'disabled:text-gray-400',
    disabledBorder: isDark ? 'disabled:border-gray-600' : 'disabled:border-gray-200',
    
    // Hover states
    hoverBg: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    hoverText: isDark ? 'hover:text-white' : 'hover:text-gray-900',
    
    // Borders
    border: isDark ? 'border-gray-600' : 'border-gray-300',
    borderLight: isDark ? 'border-gray-700' : 'border-gray-200',
    
    // Shadows with enhanced dark mode visibility
    shadow: isDark ? 'shadow-lg shadow-gray-900/30' : 'shadow-md',
    hoverShadow: isDark ? 'hover:shadow-xl hover:shadow-gray-900/40' : 'hover:shadow-lg',
    
    // Form group styling
    formGroup: 'mb-6 space-y-2',
    formRow: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    
    // Focus ring for accessibility
    focusRing: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
    focusRingPurple: 'focus:ring-purple-500',
    
    // Transitions
    transition: 'transition-all duration-300',
  };
};

/**
 * Get complete input field class string with proper theming
 * @param {boolean} isDark - Whether the current theme is dark mode
 * @param {Object} options - Additional options for styling
 * @returns {string} Complete class string for input fields
 */
export const getInputFieldClasses = (isDark, options = {}) => {
  const { hasError = false, hasSuccess = false, size = 'default', customClasses = '' } = options;
  const theme = getThemeClasses(isDark);
  
  let baseClasses = `w-full px-3 py-2 border rounded-lg ${theme.transition} ${theme.focusRing} ${theme.focusRingPurple}`;
  
  // Size variations
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    default: 'px-3 py-2',
    large: 'px-4 py-3 text-lg'
  };
  
  // Apply size
  baseClasses += ` ${sizeClasses[size]}`;
  
  // Apply theme colors
  if (hasError) {
    baseClasses += ` ${theme.errorInput}`;
  } else if (hasSuccess) {
    baseClasses += ` ${theme.successInput}`;
  } else {
    baseClasses += ` ${theme.inputBg} ${theme.inputText} ${theme.inputBorder} ${theme.inputPlaceholder} ${theme.inputFocus}`;
  }
  
  // Add disabled states
  baseClasses += ` ${theme.disabledBg} ${theme.disabledText} ${theme.disabledBorder}`;
  
  // Add custom classes
  if (customClasses) {
    baseClasses += ` ${customClasses}`;
  }
  
  return baseClasses;
};

/**
 * Get complete select field class string with proper theming
 * @param {boolean} isDark - Whether the current theme is dark mode
 * @param {Object} options - Additional options for styling
 * @returns {string} Complete class string for select fields
 */
export const getSelectFieldClasses = (isDark, options = {}) => {
  const { hasError = false, customClasses = '' } = options;
  const theme = getThemeClasses(isDark);
  
  let baseClasses = `w-full px-3 py-2 border rounded-lg ${theme.transition} ${theme.focusRing} ${theme.focusRingPurple}`;
  
  if (hasError) {
    baseClasses += ` ${theme.errorInput}`;
  } else {
    baseClasses += ` ${theme.selectBg} ${theme.selectText} ${theme.selectBorder} ${theme.inputFocus}`;
  }
  
  // Add disabled states
  baseClasses += ` ${theme.disabledBg} ${theme.disabledText} ${theme.disabledBorder}`;
  
  if (customClasses) {
    baseClasses += ` ${customClasses}`;
  }
  
  return baseClasses;
};

/**
 * Get complete textarea field class string with proper theming
 * @param {boolean} isDark - Whether the current theme is dark mode
 * @param {Object} options - Additional options for styling
 * @returns {string} Complete class string for textarea fields
 */
export const getTextareaFieldClasses = (isDark, options = {}) => {
  const { hasError = false, customClasses = '' } = options;
  const theme = getThemeClasses(isDark);
  
  let baseClasses = `w-full px-3 py-2 border rounded-lg resize-vertical min-h-[100px] ${theme.transition} ${theme.focusRing} ${theme.focusRingPurple}`;
  
  if (hasError) {
    baseClasses += ` ${theme.errorInput}`;
  } else {
    baseClasses += ` ${theme.textareaBg} ${theme.textareaText} ${theme.textareaBorder} ${theme.inputPlaceholder} ${theme.inputFocus}`;
  }
  
  // Add disabled states
  baseClasses += ` ${theme.disabledBg} ${theme.disabledText} ${theme.disabledBorder}`;
  
  if (customClasses) {
    baseClasses += ` ${customClasses}`;
  }
  
  return baseClasses;
};

/**
 * HOC that injects enhanced theme classes into a component
 * @param {React.Component} Component - The component to wrap
 * @returns {React.Component} The wrapped component with theme props
 */
export const withTheme = (Component) => {
  return (props) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const themeClasses = getThemeClasses(isDark);
    
    return (
      <Component 
        {...props} 
        theme={theme} 
        isDark={isDark} 
        themeClasses={themeClasses}
        getInputFieldClasses={(options) => getInputFieldClasses(isDark, options)}
        getSelectFieldClasses={(options) => getSelectFieldClasses(isDark, options)}
        getTextareaFieldClasses={(options) => getTextareaFieldClasses(isDark, options)}
      />
    );
  };
};

export default {
  getThemeClasses,
  getInputFieldClasses,
  getSelectFieldClasses,
  getTextareaFieldClasses,
  withTheme
};