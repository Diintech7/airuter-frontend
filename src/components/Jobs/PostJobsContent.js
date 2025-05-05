import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, AlertCircle, CheckCircle2, Loader2, ArrowRight, Edit2, ArrowLeft } from 'lucide-react';
import Cookies from 'js-cookie';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { Link } from 'react-router-dom';

const PostJobsContent = () => {
  const { isDark, colors, styles } = useThemeStyles();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    logo: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    location: '',
    type: 'full-time',
    experience: { min: 0, max: 0 },
    salary: { min: 0, max: 0, currency: 'USD' },
    skills: [''],
    benefits: [''],
    applicationDeadline: '',
    status: 'active'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const token = Cookies.get('usertoken');
      if (!token) return;

      const response = await fetch('https://auriter-backen.onrender.com/api/company/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCompanyProfile(data.data);
          // Auto-populate company name and logo URL
          setJobForm(prev => ({
            ...prev,
            company: data.data.name,
            logo: data.data.logo // Send the logo URL directly
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    }
  };

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleInputChange = useCallback((field, value) => {
    setJobForm(prev => {
      if (field === 'experience' || field === 'salary') {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            ...value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  }, []);

  const handleTextInputChange = useCallback((field, e) => {
    const value = e.target.value;
    setJobForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleArrayFieldChange = useCallback((field, index, value) => {
    setJobForm(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  }, []);

  const addArrayField = useCallback((field) => {
    setJobForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  }, []);

  const removeArrayField = useCallback((field, index) => {
    setJobForm(prev => {
      const newArray = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: newArray };
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('usertoken');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Send the job data with the logo URL from companyProfile
      const jobData = {
        ...jobForm,
        logo: companyProfile?.logo // Send the logo URL directly
      };

      const response = await fetch('https://auriter-backen.onrender.com/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to post job');
      }

      const data = await response.json();
      setSuccess('Job posted successfully!');
      setError('');
      
      // Reset form including logo
      setJobForm({
        title: '',
        company: '',
        logo: '',
        description: '',
        requirements: [''],
        responsibilities: [''],
        location: '',
        type: 'full-time',
        experience: { min: 0, max: 0 },
        salary: { min: 0, max: 0, currency: 'USD' },
        skills: [''],
        benefits: [''],
        applicationDeadline: '',
        status: 'active'
      });
      setCurrentStep(1);
    } catch (err) {
      setError(err.message || 'Failed to post job');
      setSuccess('');
    }
  };

  const generateJobDetails = async () => {
    try {
      setIsGenerating(true);
      const token = Cookies.get('usertoken');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch('https://auriter-backen.onrender.com/api/jobs/generate-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: jobForm.title,
          company: jobForm.company,
          type: jobForm.type,
          location: jobForm.location,
          currency: jobForm.salary.currency
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to generate job details');
      }

      const data = await response.json();
      
      setJobForm({
        ...jobForm,
        description: data.description || jobForm.description,
        requirements: data.requirements?.length ? data.requirements : jobForm.requirements,
        responsibilities: data.responsibilities?.length ? data.responsibilities : jobForm.responsibilities,
        skills: data.skills?.length ? data.skills : jobForm.skills,
        benefits: data.benefits?.length ? data.benefits : jobForm.benefits,
        experience: data.experience || jobForm.experience,
        salary: {
          ...data.salary,
          currency: jobForm.salary.currency
        }
      });

      setCurrentStep(2);
    } catch (err) {
      setError(err.message || 'Failed to generate job details');
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!jobForm.title || !jobForm.company || !jobForm.type || !jobForm.location) {
        setError('Please fill all required fields');
        return;
      }
      generateJobDetails();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const FormField = ({ label, children, required = false }) => (
    <div className={styles.formGroup}>
      <label className={styles.fieldLabel}>
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );

  const renderStepOne = () => (
    <div className="space-y-6">
      
      {/* Company Logo Display */}
      {companyProfile?.logo && (
        <div className="flex justify-center mb-6">
          <img 
            src={companyProfile.logo} 
            alt="Company Logo" 
            className="h-24 w-24 object-cover rounded-full border-4 border-purple-500"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={`text-sm font-semibold ${colors.textPrimary}`}>Job Title*</label>
          <input
            type="text"
            value={jobForm.title}
            onChange={(e) => handleTextInputChange('title', e)}
            className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${styles.transition}`}
            placeholder="Enter job title"
            required
          />
        </div>
        <div className="space-y-2">
          <label className={`text-sm font-semibold ${colors.textPrimary}`}>Company*</label>
          <input
            type="text"
            value={jobForm.company}
            onChange={(e) => handleTextInputChange('company', e)}
            className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${styles.transition}`}
            placeholder="Enter company name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={`text-sm font-semibold ${colors.textPrimary}`}>Job Type*</label>
          <select
            value={jobForm.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${styles.transition}`}
            required
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className={`text-sm font-semibold ${colors.textPrimary}`}>Location*</label>
          <input
            type="text"
            value={jobForm.location}
            onChange={(e) => handleTextInputChange('location', e)}
            className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${styles.transition}`}
            placeholder="City, State or Remote"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className={`text-sm font-semibold ${colors.textPrimary}`}>Currency*</label>
        <select
          value={jobForm.salary.currency}
          onChange={(e) => handleInputChange('salary', { ...jobForm.salary, currency: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${styles.transition}`}
          required
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="INR">INR (₹)</option>
          <option value="JPY">JPY (¥)</option>
          <option value="AUD">AUD (A$)</option>
          <option value="CAD">CAD (C$)</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={nextStep}
          disabled={isGenerating}
          className={`inline-flex items-center justify-center px-6 py-3 ${isDark ? 'bg-gradient-to-r from-purple-700 to-indigo-800' : 'bg-gradient-to-r from-purple-600 to-indigo-600'} text-white text-sm font-semibold rounded-lg ${colors.shadow} hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${styles.transition} disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Generating Details...
            </>
          ) : (
            <>
              Next <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className={`text-sm font-semibold ${colors.textPrimary}`}>Description</label>
          <span className="text-xs text-purple-600">AI Generated</span>
        </div>
        <textarea
          value={jobForm.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={8}
          className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${styles.transition}`}
          required
        />
      </div>

      {['requirements', 'responsibilities', 'skills', 'benefits'].map((field) => (
        <div key={field} className={`${colors.bgSection} p-6 rounded-xl`}>
          <div className="flex justify-between items-center mb-4">
            <label className={`block text-sm font-semibold ${colors.textPrimary} capitalize`}>
              {field}
            </label>
            <span className="text-xs text-purple-600">AI Generated</span>
          </div>
          <div className="space-y-3">
            {jobForm[field].map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayFieldChange(field, index, e.target.value)}
                  className={`flex-1 px-4 py-2 rounded-lg border ${colors.border} ${isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${styles.transition}`}
                  required
                />
                {jobForm[field].length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField(field, index)}
                    className={`p-2 text-red-500 hover:text-red-700 ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-50'} rounded-lg ${styles.transition}`}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField(field)}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium ${isDark ? 'text-purple-400 bg-purple-900/30 hover:bg-purple-900/50' : 'text-purple-600 bg-purple-50 hover:bg-purple-100'} rounded-lg ${styles.transition}`}
            >
              <Plus size={16} className="mr-2" />
              Add {field.slice(0, -1)}
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          className={`px-6 py-3 text-sm ${isDark ? 'text-purple-400 bg-gray-800 border border-gray-700 hover:bg-gray-700' : 'text-purple-600 bg-white border border-purple-300 hover:bg-purple-50'} rounded-lg ${styles.transition}`}
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className={`px-6 py-3 text-sm ${isDark ? 'bg-gradient-to-r from-purple-700 to-indigo-800' : 'bg-gradient-to-r from-purple-600 to-indigo-600'} text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 ${styles.transition}`}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="space-y-6">
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${colors.bgSection} p-6 rounded-xl`}>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-sm font-semibold ${colors.textPrimary}`}>Experience Range</h3>
            <span className="text-xs text-purple-600">AI Generated</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={`text-sm ${colors.textSecondary}`}>Minimum (years)</label>
              <input
                type="number"
                value={jobForm.experience.min}
                onChange={(e) => handleInputChange('experience', { min: parseInt(e.target.value) })}
                className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${styles.transition}`}
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm ${colors.textSecondary}`}>Maximum (years)</label>
              <input
                type="number"
                value={jobForm.experience.max}
                onChange={(e) => handleInputChange('experience', { max: parseInt(e.target.value) })}
                className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${styles.transition}`}
                min="0"
                required
              />
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-sm font-semibold ${colors.textPrimary}`}>Salary Range</h3>
            <span className="text-xs text-purple-600">AI Generated</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={`text-sm ${colors.textSecondary}`}>Minimum</label>
              <input
                type="number"
                value={jobForm.salary.min}
                onChange={(e) => handleInputChange('salary', { min: parseInt(e.target.value) })}
                className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${styles.transition}`}
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm ${colors.textSecondary}`}>Maximum</label>
              <input
                type="number"
                value={jobForm.salary.max}
                onChange={(e) => handleInputChange('salary', { max: parseInt(e.target.value) })}
                className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${styles.transition}`}
                min="0"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className={`text-sm font-semibold ${colors.textPrimary}`}>Application Deadline</label>
        <input
          type="date"
          value={jobForm.applicationDeadline}
          onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${styles.transition}`}
          required
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          className={`px-6 py-3 text-sm ${isDark ? 'text-purple-400 bg-gray-800 border border-gray-700 hover:bg-gray-700' : 'text-purple-600 bg-white border border-purple-300 hover:bg-purple-50'} rounded-lg ${styles.transition}`}
        >
          Back
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className={`px-6 py-3 text-sm ${isDark ? 'bg-gradient-to-r from-purple-700 to-indigo-800' : 'bg-gradient-to-r from-purple-600 to-indigo-600'} text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 ${styles.transition}`}
        >
          Post Job
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back to Job Listings Link */}
      <div className="mb-6">
        <Link 
          to="/my-listings" 
          className={`inline-flex items-center text-sm font-medium ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} ${styles.transition}`}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Job Listings
        </Link>
      </div>

      <div className={`bg-gradient-to-r ${isDark ? 'from-purple-800 to-indigo-900' : 'from-purple-600 to-indigo-600'} rounded-t-xl p-8`}>
        <h2 className="text-3xl font-bold text-white">Post a New Job</h2>
        <p className={`${isDark ? 'text-purple-200' : 'text-purple-100'} mt-2`}>Create an attractive job listing to find the perfect candidate</p>
      </div>
      
      <div className={`${colors.bgCard} rounded-b-xl ${colors.shadow} p-8`}>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="w-full flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? (isDark ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white') : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600')}`}>
                1
              </div>
              <div className={`h-1 flex-1 ${currentStep > 1 ? (isDark ? 'bg-purple-700' : 'bg-purple-600') : (isDark ? 'bg-gray-700' : 'bg-gray-200')}`}></div>
            </div>
            <div className="w-full flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? (isDark ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white') : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600')}`}>
                2
              </div>
              <div className={`h-1 flex-1 ${currentStep > 2 ? (isDark ? 'bg-purple-700' : 'bg-purple-600') : (isDark ? 'bg-gray-700' : 'bg-gray-200')}`}></div>
            </div>
            <div className="w-full flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? (isDark ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white') : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600')}`}>
                3
              </div>
            </div>
          </div>
          <div className={`flex justify-between mt-2 text-sm font-medium ${colors.textSecondary}`}>
            <div className="w-full text-center">Basic Info</div>
            <div className="w-full text-center">Job Details</div>
            <div className="w-full text-center">Final Details</div>
          </div>
        </div>

        {error && (
          <div className={`flex items-center p-4 mb-6 border-l-4 border-red-500 rounded-r-lg ${isDark ? 'bg-red-900/20' : 'bg-red-50'} ${isDark ? 'text-red-300' : 'text-red-800'} animate-fadeIn shadow-sm`}>
            <AlertCircle size={20} className={`${isDark ? 'text-red-400' : 'text-red-500'} mr-3 flex-shrink-0`} />
            <div className="flex-1">
              <p className="font-medium">{error}</p>
            </div>
            <button 
              onClick={() => setError('')} 
              className={`ml-3 p-1 rounded-full ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-100'} ${styles.transition}`}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className={`flex items-center p-5 mb-6 rounded-lg shadow-md ${isDark ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-700' : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'} animate-fadeIn animate-pulse`}>
            <div className={`mr-4 p-2 rounded-full ${isDark ? 'bg-green-800' : 'bg-green-100'}`}>
              <CheckCircle2 size={24} className={`${isDark ? 'text-green-400' : 'text-green-500'}`} />
            </div>
            <div className="flex-1">
              <h4 className={`font-medium text-base ${isDark ? 'text-green-300' : 'text-green-700'}`}>Success!</h4>
              <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>{success}</p>
            </div>
            <button 
              onClick={() => setSuccess('')} 
              className={`ml-3 p-1.5 rounded-full ${isDark ? 'bg-green-800/50 hover:bg-green-800' : 'bg-green-100 hover:bg-green-200'} ${styles.transition}`}
            >
              <X size={16} className={isDark ? 'text-green-300' : 'text-green-500'} />
            </button>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          {currentStep === 1 && renderStepOne()}
          {currentStep === 2 && renderStepTwo()}
          {currentStep === 3 && renderStepThree()}
        </form>
      </div>
    </div>
  );
};

export default PostJobsContent;