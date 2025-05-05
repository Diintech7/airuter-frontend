// components/admin/ShortForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { extractYoutubeId } from '../utils/YouTubeThumbnai'; 

const ShortForm = ({ currentShort, setShowForm, refreshShorts }) => {
  const { colors, styles } = useThemeStyles();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeLink: '',
    metrics: {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0
    }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // If editing, populate form with current short data
  useEffect(() => {
    if (currentShort) {
      setFormData({
        title: currentShort.title || '',
        description: currentShort.description || '',
        youtubeLink: currentShort.youtubeLink || '',
        metrics: {
          views: currentShort.metrics?.views || 0,
          likes: currentShort.metrics?.likes || 0,
          comments: currentShort.metrics?.comments || 0,
          shares: currentShort.metrics?.shares || 0
        }
      });
      
      // Update preview
      if (currentShort.youtubeLink) {
        updatePreviewImage(currentShort.youtubeLink);
      }
    }
  }, [currentShort]);

  // Extract YouTube ID and set preview image
  const updatePreviewImage = (url) => {
    const youtubeId = extractYoutubeId(url);
    if (youtubeId) {
      setPreviewImage(`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`);
    } else {
      setPreviewImage('');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested metrics fields
    if (name.startsWith('metrics.')) {
      const metricName = name.split('.')[1];
      setFormData({
        ...formData,
        metrics: {
          ...formData.metrics,
          [metricName]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Update preview image when YouTube link changes
      if (name === 'youtubeLink') {
        updatePreviewImage(value);
      }
    }
  };

  // Validate form
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
    
    if (!formData.title.trim()) {
      formErrors.title = 'Title is required';
      isValid = false;
    }
    
    if (!formData.youtubeLink.trim()) {
      formErrors.youtubeLink = 'YouTube link is required';
      isValid = false;
    } else {
      // Validate YouTube link format
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\s]+)/;
      if (!youtubeRegex.test(formData.youtubeLink)) {
        formErrors.youtubeLink = 'Invalid YouTube URL format';
        isValid = false;
      }
    }
    
    setErrors(formErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Get authentication token
      const token = Cookies.get('admintoken');
      
      if (!token) {
        setErrors({
          ...errors,
          submit: 'Authentication token not found. Please log in again.'
        });
        return;
      }

      // Set up headers with authentication
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      // Add the youtubeId to formData for consistency
      const dataToSubmit = {
        ...formData,
        youtubeId: extractYoutubeId(formData.youtubeLink)
      };
      
      if (currentShort) {
        // Update existing short
        await axios.put(`https://auriter-backen.onrender.com/api/shorts/${currentShort._id}`, dataToSubmit, {
          headers,
          credentials: 'include'
        });
      } else {
        // Create new short
        await axios.post('https://auriter-backen.onrender.com/api/shorts', dataToSubmit, {
          headers,
          credentials: 'include'
        });
      }
      
      refreshShorts();
      setShowForm(false);
      
    } catch (err) {
      console.error('Error saving short:', err);
      
      // Handle unauthorized error
      if (err.response?.status === 401 || err.response?.status === 403) {
        setErrors({
          ...errors,
          submit: 'Your session has expired. Please log in again.'
        });
      } else {
        setErrors({
          ...errors,
          submit: err.response?.data?.message || 'Error saving short. Please try again.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${colors.bgCard} rounded-lg shadow-md p-6 mb-6 ${styles.transition}`}>
      <h2 className={`text-xl font-semibold mb-4 ${colors.textHeading}`}>
        {currentShort ? 'Edit Short' : 'Add New Short'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className={`block text-sm font-medium ${colors.textMuted} mb-1`}>
                Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.title ? 'border-red-500' : colors.inputBorder
                } ${colors.bgInput} ${colors.text} ${colors.inputFocus} focus:ring-2 focus:outline-none`}
                placeholder="Enter short title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
              )}
            </div>
            
            {/* YouTube Link */}
            <div>
              <label className={`block text-sm font-medium ${colors.textMuted} mb-1`}>
                YouTube Short Link*
              </label>
              <input
                type="text"
                name="youtubeLink"
                value={formData.youtubeLink}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.youtubeLink ? 'border-red-500' : colors.inputBorder
                } ${colors.bgInput} ${colors.text} ${colors.inputFocus} focus:ring-2 focus:outline-none`}
                placeholder="https://youtube.com/shorts/VIDEO_ID"
              />
              {errors.youtubeLink && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.youtubeLink}</p>
              )}
              <p className={`mt-1 text-xs ${colors.textMuted}`}>
                Accepts YouTube shorts, watch, or shortened links
              </p>
            </div>
            
            {/* Description */}
            <div>
              <label className={`block text-sm font-medium ${colors.textMuted} mb-1`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full px-3 py-2 border rounded-md ${colors.inputBorder} ${colors.bgInput} ${colors.text} ${colors.inputFocus} focus:ring-2 focus:outline-none`}
                placeholder="Enter short description"
              ></textarea>
            </div>
            
            {/* Metrics */}
            {currentShort && (
              <div className={`border ${colors.border} rounded-md p-4 ${colors.bgSection}`}>
                <h3 className={`text-sm font-medium mb-3 ${colors.textHeading}`}>Initial Metrics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs ${colors.textMuted} mb-1`}>
                      Views
                    </label>
                    <input
                      type="number"
                      name="metrics.views"
                      value={formData.metrics.views}
                      onChange={handleChange}
                      className={`w-full px-3 py-1 border rounded-md text-sm ${colors.inputBorder} ${colors.bgInput} ${colors.text} ${colors.inputFocus} focus:ring-2 focus:outline-none`}
                      min="0"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs ${colors.textMuted} mb-1`}>
                      Likes
                    </label>
                    <input
                      type="number"
                      name="metrics.likes"
                      value={formData.metrics.likes}
                      onChange={handleChange}
                      className={`w-full px-3 py-1 border rounded-md text-sm ${colors.inputBorder} ${colors.bgInput} ${colors.text} ${colors.inputFocus} focus:ring-2 focus:outline-none`}
                      min="0"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs ${colors.textMuted} mb-1`}>
                      Comments
                    </label>
                    <input
                      type="number"
                      name="metrics.comments"
                      value={formData.metrics.comments}
                      onChange={handleChange}
                      className={`w-full px-3 py-1 border rounded-md text-sm ${colors.inputBorder} ${colors.bgInput} ${colors.text} ${colors.inputFocus} focus:ring-2 focus:outline-none`}
                      min="0"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs ${colors.textMuted} mb-1`}>
                      Shares
                    </label>
                    <input
                      type="number"
                      name="metrics.shares"
                      value={formData.metrics.shares}
                      onChange={handleChange}
                      className={`w-full px-3 py-1 border rounded-md text-sm ${colors.inputBorder} ${colors.bgInput} ${colors.text} ${colors.inputFocus} focus:ring-2 focus:outline-none`}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Form error */}
            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md p-3 flex items-start">
                <AlertCircle size={16} className="text-red-500 dark:text-red-400 mr-2 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}
          </div>
          
          {/* Preview column */}
          <div>
            <label className={`block text-sm font-medium ${colors.textMuted} mb-3`}>
              Preview
            </label>
            
            {previewImage ? (
              <div className={`border ${colors.border} rounded-md overflow-hidden ${colors.bgSection}`}>
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={previewImage} 
                    alt="YouTube Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className={`font-medium text-sm mb-1 truncate ${colors.textHeading}`}>
                    {formData.title || 'Title will appear here'}
                  </h3>
                  <p className={`text-xs ${colors.textMuted} line-clamp-2`}>
                    {formData.description || 'Description will appear here'}
                  </p>
                </div>
              </div>
            ) : (
              <div className={`${colors.bgSection} border ${colors.border} rounded-md p-8 flex flex-col items-center justify-center text-center`}>
                <p className={`text-sm ${colors.textMuted} mb-2`}>
                  No preview available
                </p>
                <p className={`text-xs ${colors.textMuted}`}>
                  Enter a valid YouTube link to see preview
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Form buttons */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className={`px-4 py-2 border ${colors.border} rounded-md ${colors.text} mr-3 ${colors.bgSection} hover:bg-gray-50 dark:hover:bg-gray-700 ${styles.transition}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${styles.transition} ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                {currentShort ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              <span>{currentShort ? 'Update Short' : 'Add Short'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShortForm;