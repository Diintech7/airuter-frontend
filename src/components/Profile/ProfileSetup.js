import React, { useState, useEffect } from 'react';
import { Linkedin, FileText, ClipboardList, ArrowRight, Edit, ArrowLeft } from 'lucide-react';
import LinkedInForm from './LinkedInForm';
import ResumeUpload from './ResumeUpload';
import MultiStepForm from './MultiStepForm';
import Cookies from 'js-cookie';
import { useThemeStyles } from '../hooks/useThemeStyles'; // Adjust the import path if needed

const ProfileSetup = ({ onComplete, onSkip }) => {
  const { colors, styles, cx, isDark } = useThemeStyles();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://auriter-backen.onrender.com/api/profile', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('usertoken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      setError(null);
      
      const response = await fetch('https://auriter-backen.onrender.com/api/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('usertoken')}`
        },
        body: JSON.stringify({ 
          isComplete: false
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to skip profile setup');
      }

      const data = await response.json();
      
      if (data.success) {
        if (onSkip) {
          onSkip();
        }
      }
    } catch (error) {
      setError(error.message);
      console.error('Error skipping profile setup:', error);
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      const response = await fetch('https://auriter-backen.onrender.com/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('usertoken')}`
        },
        body: JSON.stringify({ ...formData, isComplete: true })
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Define method cards with theme-aware colors
  const methods = [
    {
      id: 'linkedin',
      title: 'Import from LinkedIn',
      icon: Linkedin,
      description: 'Quick import using your LinkedIn profile',
      color: isDark ? 'bg-blue-800' : 'bg-blue-500'
    },
    {
      id: 'resume',
      title: 'Upload Resume',
      icon: ClipboardList,
      description: 'Extract details from your resume',
      color: isDark ? 'bg-green-800' : 'bg-green-500'
    },
    {
      id: 'form',
      title: 'Fill Form Manually',
      icon: FileText,
      description: 'Enter your details step by step',
      color: isDark ? 'bg-purple-800' : 'bg-purple-500'
    }
  ];

  const renderSelectedMethod = () => {
    switch (selectedMethod) {
      case 'linkedin':
        return <LinkedInForm onBack={() => setSelectedMethod(null)} onSubmit={handleUpdateProfile} />;
      case 'resume':
        return <ResumeUpload onBack={() => setSelectedMethod(null)} onSubmit={handleUpdateProfile} />;
      case 'form':
        return <MultiStepForm onBack={() => setSelectedMethod(null)} onSubmit={handleUpdateProfile} initialData={profileData} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={cx("text-center p-8", colors.bg)}>
        <div className={cx("animate-spin rounded-full h-12 w-12 border-b-2 mx-auto", 
          isDark ? "border-purple-400" : "border-purple-600")}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cx("p-8", colors.bg)}>
        <div className={cx("text-red-500 p-8", colors.errorText)}>Error: {error}</div>
      </div>
    );
  }

  if (selectedMethod) {
    return renderSelectedMethod();
  }

  return (
    <div className={cx("max-w-4xl mx-auto p-8", colors.bg)}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={cx("text-3xl font-bold", colors.text)}>Complete Your Profile</h1>
          <p className={cx("mt-2", colors.textSecondary)}>
            Choose how you'd like to set up your AI Recruiter profile
          </p>
        </div>
        <button
          onClick={handleSkip}
          className={cx("px-4 py-2 transition-colors", 
            isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800")}
        >
          Skip for now
        </button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={cx("p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200", colors.bgCard)}
          >
            <div className={`${method.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
              <method.icon className="text-white" size={24} />
            </div>
            <h3 className={cx("text-xl font-semibold mb-2", colors.text)}>{method.title}</h3>
            <p className={cx("mb-4", colors.textSecondary)}>{method.description}</p>
            <div className={cx("flex items-center", colors.primary)}>
              <span>Get Started</span>
              <ArrowRight size={16} className="ml-2" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileSetup;