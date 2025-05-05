import React, { useState } from 'react';
import { ArrowLeft, Upload, Check, Loader } from 'lucide-react';
import Cookies from 'js-cookie';
import { useTheme } from '../../context/ThemeContext';
import { useThemeStyles } from '../hooks/useThemeStyles';

const ResumeUpload = ({ onBack }) => {
  const { theme } = useTheme();
  const { colors, styles } = useThemeStyles();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || 
        selectedFile.type === 'application/msword' || 
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setProgress(0);
    } else {
      setError('Please select a valid PDF or Word document');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
  
    setUploading(true);
    setError(null);
    setProgress(0);
    
    const formData = new FormData();
    formData.append('resume', file);
    
    const token = Cookies.get('usertoken');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      setUploading(false);
      return;
    }
  
    try {
      const response = await fetch('https://auriter-backen.onrender.com/api/profile/resume', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      if (data.success) {
        setProgress(100);
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      setError(error.message || 'Failed to upload resume. Please try again.');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`max-w-md mx-auto p-8 ${colors.bgCard} rounded-xl`}>
      <button
        onClick={onBack}
        className={`flex items-center ${colors.textSecondary} mb-8 hover:${colors.text}`}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to options
      </button>

      <h2 className={`text-2xl font-bold mb-6 ${colors.text}`}>Upload Your Resume</h2>

      {error && (
        <div className={styles.error + " p-4 rounded-lg mb-6"}>
          {error}
        </div>
      )}

      <div className={`border-2 border-dashed ${colors.border} rounded-lg p-8 text-center ${colors.bgCard}`}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
          id="resume-upload"
        />
        
        {!file ? (
          <div>
            <Upload className={`mx-auto ${colors.textMuted} mb-4`} size={48} />
            <label
              htmlFor="resume-upload"
              className={`cursor-pointer ${colors.primary} ${colors.primaryHover}`}
            >
              Click to upload
            </label>
            <p className={`${colors.textMuted} mt-2`}>
              Supported formats: PDF, DOC, DOCX (max 10MB)
            </p>
          </div>
        ) : (
          <div>
            <Check className="mx-auto text-green-500 mb-4" size={48} />
            <p className={`${colors.text} font-medium`}>{file.name}</p>
            <button
              onClick={() => {
                setFile(null);
                setError(null);
                setProgress(0);
              }}
              className="text-red-600 hover:text-red-700 mt-2"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {progress > 0 && progress < 100 && (
        <div className={`w-full ${colors.bgSection} rounded-full h-2.5 mt-4`}>
          <div 
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full mt-6 ${
            uploading ? 'bg-purple-400' : colors.buttonPrimary
          } text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center`}
        >
          {uploading ? (
            <>
              <Loader className="animate-spin mr-2" size={20} />
              Processing...
            </>
          ) : (
            'Upload and Continue'
          )}
        </button>
      )}
    </div>
  );
};

export default ResumeUpload;