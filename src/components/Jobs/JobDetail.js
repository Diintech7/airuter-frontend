import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, BriefcaseIcon, ArrowLeft, Upload, 
  Building2, Clock, DollarSign, FileText, X, Calendar, 
  CheckCircle, Award, Target, Wand2, Download, Maximize2, Minimize2, Edit
} from 'lucide-react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useTheme } from '../../context/ThemeContext';

const JobDetail = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    additionalNotes: '',
    resume: null
  });
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applicationError, setApplicationError] = useState('');
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [generatingAdditionalNotes, setGeneratingAdditionalNotes] = useState(false);
  const [submissionStage, setSubmissionStage] = useState('idle');
  const [resumeTab, setResumeTab] = useState('upload');
  const [selectedResume, setSelectedResume] = useState(null);
  const [showCoverLetterFullscreen, setShowCoverLetterFullscreen] = useState(false);
  const [extractingCoverLetter, setExtractingCoverLetter] = useState(false);

  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.pathname.split('/').pop();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await fetch(`https://auriter-backen.onrender.com/api/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('usertoken')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch job details');
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('https://auriter-backen.onrender.com/api/profile', {
          headers: {
            'Authorization': `Bearer ${Cookies.get('usertoken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchJobDetail();
    fetchUserProfile();
  }, [jobId]);
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const cardHeaderBg = isDark ? 'from-purple-800 to-purple-950' : 'from-purple-600 to-purple-800';
  const cardHeaderText = 'text-white';
  const baseBg = isDark ? 'from-gray-900 to-gray-800' : 'from-purple-50 to-purple-100';
  const backBtnColor = isDark ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600';
  const inputBg = isDark ? 'bg-gray-700' : 'bg-white';
  const inputBorder = isDark ? 'border-gray-600' : 'border-gray-300';
  const inputText = isDark ? 'text-white' : 'text-gray-900';
  const sectionBg = isDark ? 'bg-gray-700' : 'bg-purple-50';
  const benefitBg = isDark ? 'bg-gray-700' : 'bg-blue-50';
  const gridItemBg = isDark ? 'bg-gray-700' : 'bg-white';
  const salaryBg = isDark ? 'bg-green-900' : 'bg-green-50';
  const salaryText = isDark ? 'text-green-200' : 'text-green-800';
  const uploadBg = isDark ? 'bg-gray-700' : 'bg-purple-50';
  const uploadBorder = isDark ? 'border-gray-600' : 'border-purple-200';
  const uploadHoverBg = isDark ? 'hover:bg-gray-600' : 'hover:bg-purple-100';
  const uploadHoverBorder = isDark ? 'hover:border-gray-500' : 'hover:border-purple-400';
  const uploadText = isDark ? 'text-purple-400' : 'text-purple-600';
  const disabledBg = isDark ? 'disabled:bg-gray-600' : 'disabled:bg-gray-100';
  const disabledText = isDark ? 'disabled:text-gray-400' : 'disabled:text-gray-500';
  const errorBg = isDark ? 'bg-red-900' : 'bg-red-50';
  const errorBorder = isDark ? 'border-red-700' : 'border-red-500';
  const errorText = isDark ? 'text-red-300' : 'text-red-700';
  const tabBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const activeTabBg = isDark ? 'bg-purple-800' : 'bg-purple-600';
  const activeTabText = 'text-white';
  const inactiveTabText = isDark ? 'text-gray-300' : 'text-gray-600';
  const overlayBg = isDark ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-50';
  const modalBg = isDark ? 'bg-gray-800' : 'bg-white';
  const modalHeaderBg = isDark ? 'bg-gray-700' : 'bg-purple-100';

  const removeCoverLetterFile = () => {
    setCoverLetterFile(null);
  };

  const handleCoverLetterFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverLetterFile(file);
      setExtractingCoverLetter(true);
      
      try {
        let extractedText = '';
        
        if (file.type === 'application/pdf' || 
            file.type === 'application/msword' || 
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          // For now, just a placeholder as we'd need PDF.js or mammoth.js for actual extraction
          // In a real implementation, you'd use the appropriate library
          extractedText = "Content extraction in progress. In production, this would contain the actual text from your document.";
          
        } else if (file.type === 'text/plain') {
          // For text files, we can extract directly
          const reader = new FileReader();
          extractedText = await new Promise((resolve, reject) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
          });
        } else {
          throw new Error('Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files.');
        }

        
        
        // Update cover letter text area with extracted content
        setApplicationData(prev => ({
          ...prev,
          coverLetter: extractedText
        }));
        
      } catch (err) {
        setApplicationError(`Error extracting text from cover letter: ${err.message}`);
      } finally {
        setExtractingCoverLetter(false);
      }
    }
  };

  const generateContent = async (type) => {
    if (!job) {
      console.error('No job data available');
      return;
    }
  
    try {
      console.log('Generating content:', type);
      console.log('Job Data:', JSON.stringify(job, null, 2));
  
      const setGenerating = type === 'coverLetter' 
        ? setGeneratingCoverLetter 
        : setGeneratingAdditionalNotes;
      
      setGenerating(true);
      const requestData = {
        jobTitle: job.title,
        company: job.company,
        skills: job.skills || [],
        requirements: job.requirements || [],
        type: 'coverLetter'
      };
      
      const response = await fetch(`https://auriter-backen.onrender.com/api/applications/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('usertoken')}`
        },
        body: JSON.stringify(requestData)
      });
  
      console.log('Response Status:', response.status);
      
      const responseData = await response.json();
      console.log('Response Data:', responseData);
  
      if (!response.ok) {
        throw new Error(responseData.message || `Failed to generate ${type}`);
      }
      
      setApplicationData(prev => ({
        ...prev,
        [type]: responseData.generatedText
      }));

      // Open fullscreen cover letter editor automatically when generated
      if (type === 'coverLetter') {
        setShowCoverLetterFullscreen(true);
      }
    } catch (err) {
      console.error('Full Error:', err);
      setApplicationError(`Error generating ${type}: ${err.message}`);
    } finally {
      const setGenerating = type === 'coverLetter' 
        ? setGeneratingCoverLetter 
        : setGeneratingAdditionalNotes;
      setGenerating(false);
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApplicationError('');
    setSubmissionStage('idle');
    if (resumeTab === 'upload' && !applicationData.resume) {
      setApplicationError('Please upload a resume or use your existing resume');
      setSubmitting(false);
      return;
    }

    if (resumeTab === 'existing' && !selectedResume) {
      setApplicationError('Please select a resume');
      setSubmitting(false);
      return;
    }

    if (!applicationData.coverLetter.trim()) {
      setApplicationError('Please provide a cover letter');
      setSubmitting(false);
      return;
    }

    try {
      setSubmissionStage('analyzing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmissionStage('uploading');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const formData = new FormData();
      
      if (resumeTab === 'upload') {
        formData.append('resume', applicationData.resume);
      } else if (resumeTab === 'existing' && userProfile && userProfile.resumePath) {
        const response = await fetch(`https://auriter-backen.onrender.com/api/profile${userProfile.resumePath}`);
        const blob = await response.blob();
        const filename = userProfile.resumePath.split('/').pop();
        formData.append('resume', blob, filename);
      }
      
      formData.append('coverLetter', applicationData.coverLetter);
      formData.append('additionalNotes', applicationData.additionalNotes);
      setSubmissionStage('processing');
      
      const response = await fetch(`https://auriter-backen.onrender.com/api/applications/${jobId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('usertoken')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit application');
      }
      setSubmissionStage('saving');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmissionStage('complete');
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowApplicationForm(false);
      alert('Application submitted successfully!');
      navigate('/jobs');
    } catch (err) {
      setApplicationError(err.message);
      setSubmissionStage('idle');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setApplicationData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const removeResume = () => {
    setApplicationData(prev => ({
      ...prev,
      resume: null
    }));
  };

  const toggleApplicationForm = () => {
    setShowApplicationForm(prev => !prev);
  };

  const toggleCoverLetterFullscreen = () => {
    setShowCoverLetterFullscreen(prev => !prev);
  };

  const viewResume = () => {
    if (userProfile && userProfile.resumePath) {
      window.open(`https://auriter-backen.onrender.com/api/profile${userProfile.resumePath}`, '_blank');
    }
  };

  const handleResumeTabChange = (tab) => {
    setResumeTab(tab);
  };

  const CoverLetterFullscreenModal = () => {
    if (!showCoverLetterFullscreen) return null;
    
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${overlayBg}`}>
        <div className={`w-full max-w-5xl h-4/5 ${modalBg} rounded-xl shadow-2xl flex flex-col`}>
          <div className={`${modalHeaderBg} p-4 rounded-t-xl flex items-center justify-between`}>
            <h3 className={`font-bold ${textColor} flex items-center`}>
              <Edit size={20} className="mr-2" />
              Edit Cover Letter
            </h3>
            <button 
              onClick={toggleCoverLetterFullscreen}
              className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors duration-200`}
            >
              <Minimize2 size={20} className={textColor} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-hidden">
            <textarea
              value={applicationData.coverLetter}
              onChange={(e) => setApplicationData(prev => ({
                ...prev,
                coverLetter: e.target.value
              }))}
              disabled={submitting}
              className={`w-full h-full rounded-xl p-4 ${inputBg} ${inputBorder} focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200 ${disabledBg} ${disabledText} ${inputText} resize-none`}
              placeholder="Write your cover letter here..."
            />
          </div>
          <div className="p-4 flex justify-end space-x-4">
            <button
              onClick={toggleCoverLetterFullscreen}
              className={`py-2 px-6 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg font-medium transition-colors duration-200`}
            >
              Close
            </button>
            <button
              onClick={toggleCoverLetterFullscreen}
              className={`py-2 px-6 bg-gradient-to-r ${isDark ? 'from-purple-700 to-purple-900' : 'from-purple-600 to-purple-800'} text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-200`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen bg-gradient-to-br ${baseBg}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent shadow-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className={`${errorBg} border-l-4 ${errorBorder} p-6 rounded-xl shadow-xl`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className={`h-8 w-8 ${errorText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className={`text-lg font-bold ${errorText}`}>Error Loading Job Details</h3>
              <p className={`mt-1 ${errorText}`}>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${baseBg} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/jobs')}
          className={`group flex items-center ${backBtnColor} mb-8 transition-all duration-300 hover:transform hover:translate-x-[-5px]`}
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium">Back to Jobs</span>
        </button>
        {job && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className={`${cardBg} rounded-2xl shadow-xl overflow-hidden`}>
                <div className={`bg-gradient-to-r ${cardHeaderBg} p-6`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className={cardHeaderText}>
                      <h1 className="text-3xl font-bold">{job.title}</h1>
                      <div className="flex items-center mt-3">
                        <Building2 size={20} className="mr-2" />
                        <p className="text-xl text-purple-100">{job.company}</p>
                      </div>
                    </div>
                    <span className={`mt-4 md:mt-0 inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${isDark ? 'bg-gray-700 text-purple-400' : 'bg-white text-purple-700'}`}>
                      {job.type}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${sectionBg} p-4 rounded-xl`}>
                    {[
                      { icon: MapPin, label: 'Location', value: job.location },
                      { icon: BriefcaseIcon, label: 'Experience', value: `${job.experience.min}-${job.experience.max} years` },
                      { icon: Calendar, label: 'Application Deadline', value: new Date(job.applicationDeadline).toLocaleDateString() }
                    ].map(({ icon: Icon, label, value }, index) => (
                      <div key={index} className={`flex items-center space-x-3 ${gridItemBg} p-3 rounded-lg shadow-sm`}>
                        <Icon size={24} className="text-purple-600" />
                        <div>
                          <p className={`text-xs ${subTextColor}`}>{label}</p>
                          <p className={`font-medium ${textColor}`}>{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`mt-6 ${salaryBg} p-4 rounded-xl flex items-center space-x-4`}>
                    <DollarSign size={24} className={isDark ? "text-green-300" : "text-green-600"} />
                    <div>
                      <p className={`text-sm ${isDark ? "text-green-100" : "text-gray-600"}`}>Salary Range</p>
                      <p className={`text-lg font-bold ${salaryText}`}>
                        {job.salary.currency} {job.salary.min} - {job.salary.max} per year
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h2 className={`text-xl font-bold ${textColor} mb-4`}>Job Description</h2>
                    <div className={`${subTextColor} leading-relaxed`}>
                      {job.description}
                    </div>
                  </div>
                  <div className="mt-6">
                    <h2 className={`text-xl font-bold ${textColor} mb-4`}>Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${isDark ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'} transition-colors duration-200`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className={`text-xl font-bold ${textColor} mb-4 flex items-center`}>
                      <Target size={24} className="mr-2 text-purple-600" />
                      Job Requirements
                    </h2>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle size={18} className="mr-2 mt-1 text-green-500" />
                          <span className={subTextColor}>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${textColor} mb-4 flex items-center`}>
                      <Award size={24} className="mr-2 text-purple-600" />
                      Job Responsibilities
                    </h2>
                    <ul className="space-y-2">
                      {job.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle size={18} className="mr-2 mt-1 text-green-500" />
                          <span className={subTextColor}>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
                <h2 className={`text-xl font-bold ${textColor} mb-4 flex items-center`}>
                  <DollarSign size={24} className="mr-2 text-purple-600" />
                  Benefits
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className={`flex items-center ${benefitBg} p-3 rounded-lg`}>
                      <CheckCircle size={20} className="mr-2 text-blue-500" />
                      <span className={subTextColor}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="md:col-span-1 space-y-6">
              <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
                <h3 className={`text-xl font-bold ${textColor} mb-4`}>Recruiter Contact</h3>
                <div className="space-y-2">
                  <p className={subTextColor}><strong className={textColor}>Name:</strong> {job.recruiter.name}</p>
                  <p className={subTextColor}><strong className={textColor}>Email:</strong> {job.recruiter.email}</p>
                </div>
              </div>
              <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
                {!showApplicationForm ? (
                  <button
                    onClick={toggleApplicationForm}
                    className={`w-full py-4 bg-gradient-to-r ${isDark ? 'from-purple-700 to-purple-900' : 'from-purple-600 to-purple-800'} text-white rounded-xl font-medium ${isDark ? 'hover:from-purple-800 hover:to-purple-950' : 'hover:from-purple-700 hover:to-purple-900'} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]`}
                  >
                    Apply for this position
                  </button>
                ) : (
                  <form onSubmit={handleApplicationSubmit} className="space-y-6">
                    {submitting && (
                      <div className="mb-4">
                        <div className={`w-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2.5`}>
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                            style={{ 
                              width: submissionStage === 'analyzing' ? '20%' : 
                                     submissionStage === 'uploading' ? '40%' : 
                                     submissionStage === 'processing' ? '60%' : 
                                     submissionStage === 'saving' ? '80%' : 
                                     submissionStage === 'complete' ? '100%' : '10%' 
                            }}
                          ></div>
                        </div>
                        <p className={`text-sm text-center ${subTextColor} mt-2`}>
                          {submissionStage === 'analyzing' && 'Step 1/5: Analyzing resume...'}
                          {submissionStage === 'uploading' && 'Step 2/5: Uploading resume...'}
                          {submissionStage === 'processing' && 'Step 3/5: Processing application...'}
                          {submissionStage === 'saving' && 'Step 4/5: Saving application...'}
                          {submissionStage === 'complete' && 'Step 5/5: Application submitted!'}
                          {submissionStage === 'idle' && 'Preparing submission...'}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                        Resume
                      </label>
                      {userProfile && userProfile.resumePath && (
                        <div className={`flex mb-4 ${tabBg} rounded-xl overflow-hidden`}>
                          <button
                            type="button"
                            className={`flex-1 py-2 text-center ${resumeTab === 'upload' ? activeTabBg + ' ' + activeTabText : inactiveTabText} transition-colors duration-200`}
                            onClick={() => handleResumeTabChange('upload')}
                            disabled={submitting}
                          >
                            Upload New
                          </button>
                          <button
                            type="button"
                            className={`flex-1 py-2 text-center ${resumeTab === 'existing' ? activeTabBg + ' ' + activeTabText : inactiveTabText} transition-colors duration-200`}
                            onClick={() => handleResumeTabChange('existing')}
                            disabled={submitting}
                          >
                            Use Profile
                          </button>
                        </div>
                      )}
                      {resumeTab === 'upload' && (
                        !applicationData.resume ? (
                          <div className="flex items-center justify-center w-full">
                            <label className={`w-full flex flex-col items-center px-4 py-6 ${uploadBg} ${uploadText} rounded-xl shadow-sm ${uploadBorder} border-2 border-dashed cursor-pointer ${uploadHoverBorder} ${uploadHoverBg} transition-all duration-200`}>
                              <Upload size={24} />
                              <span className="mt-2 text-sm text-center">
                                Click to upload your resume
                              </span>
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                disabled={submitting}
                              />
                            </label>
                          </div>
                        ) : (
                          <div className={`flex items-center justify-between ${uploadBg} p-3 rounded-xl`}>
                            <div className="flex items-center space-x-2">
                              <FileText size={24} className={uploadText} />
                              <span className={`text-sm truncate max-w-[200px] ${textColor}`}>
                                {applicationData.resume.name}
                              </span>
                            </div>
                            <button 
                              type="button"
                              onClick={removeResume}
                              className={`${isDark ? 'text-red-400 hover:bg-red-900' : 'text-red-500 hover:bg-red-50'} p-1 rounded-full`}
                              disabled={submitting}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )
                      )}
                      {resumeTab === 'existing' && userProfile && userProfile.resumePath && (
                        <div className={`flex flex-col space-y-4 ${uploadBg} p-4 rounded-xl`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FileText size={24} className={uploadText} />
                              <span className={`text-sm ${textColor}`}>
                                Your existing resume
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                type="button"
                                onClick={viewResume}
                                className={`${isDark ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-600 hover:bg-blue-50'} p-2 rounded-full flex items-center justify-center`}
                                disabled={submitting}
                                title="View Resume"
                              >
                                <FileText size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="existingResume"
                              name="resumeSelection"
                              checked={selectedResume === userProfile.resumePath}
                              onChange={() => setSelectedResume(userProfile.resumePath)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                              disabled={submitting}
                            />
                                                        <label htmlFor="existingResume" className={`text-sm ${textColor}`}>
                              Use this resume for application
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
  <div className="flex items-center justify-between mb-2">
    <label className={`block text-sm font-semibold ${textColor}`}>
      Cover Letter
    </label>
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={() => generateContent('coverLetter')}
        disabled={generatingCoverLetter || submitting || extractingCoverLetter}
        className={`inline-flex items-center ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'} text-sm`}
      >
        <Wand2 size={16} className="mr-1" />
        {generatingCoverLetter ? 'Generating...' : 'Generate'}
      </button>
      {applicationData.coverLetter && (
        <button
          type="button"
          onClick={toggleCoverLetterFullscreen}
          className={`inline-flex items-center ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} text-sm`}
          disabled={submitting}
        >
          <Maximize2 size={16} className="mr-1" />
          Fullscreen
        </button>
      )}
    </div>
  </div>
  
  {/* Cover letter file upload section */}
  <div className="mb-3">
    {!coverLetterFile ? (
      <div className="flex items-center justify-center w-full mb-3">
        <label className={`w-full flex flex-col items-center px-4 py-3 ${uploadBg} ${uploadText} rounded-xl shadow-sm ${uploadBorder} border-2 border-dashed cursor-pointer ${uploadHoverBorder} ${uploadHoverBg} transition-all duration-200`}>
          <Upload size={20} />
          <span className="mt-2 text-xs text-center">
            Upload cover letter file
          </span>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleCoverLetterFileChange}
            disabled={submitting || extractingCoverLetter}
          />
        </label>
      </div>
    ) : (
      <div className={`flex items-center justify-between ${uploadBg} p-3 rounded-xl mb-3`}>
        <div className="flex items-center space-x-2">
          <FileText size={24} className={uploadText} />
          <span className={`text-sm truncate max-w-[200px] ${textColor}`}>
            {coverLetterFile.name}
          </span>
        </div>
        <button 
          type="button"
          onClick={removeCoverLetterFile}
          className={`${isDark ? 'text-red-400 hover:bg-red-900' : 'text-red-500 hover:bg-red-50'} p-1 rounded-full`}
          disabled={submitting || extractingCoverLetter}
        >
          <X size={16} />
        </button>
      </div>
    )}
    
    {extractingCoverLetter && (
      <div className="flex justify-center items-center py-2">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
        <span className={`ml-2 text-sm ${subTextColor}`}>Extracting text...</span>
      </div>
    )}
  </div>
  
  {/* Cover letter textarea */}
  <textarea
    value={applicationData.coverLetter}
    onChange={(e) => setApplicationData(prev => ({
      ...prev,
      coverLetter: e.target.value
    }))}
    rows={6}
    disabled={submitting || extractingCoverLetter}
    className={`w-full rounded-xl ${inputBg} ${inputBorder} focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200 ${disabledBg} ${disabledText} ${inputText}`}
    placeholder="Write your cover letter here or upload a file above..."
  />
</div>

                    <div>
                      <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                        Additional Notes
                        <button
                          type="button"
                          onClick={() => generateContent('additionalNotes')}
                          disabled={generatingAdditionalNotes || submitting}
                          className={`ml-2 inline-flex items-center ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'} text-sm`}
                        >
                          <Wand2 size={16} className="mr-1" />
                          {generatingAdditionalNotes ? 'Generating...' : 'Generate'}
                        </button>
                      </label>
                      <textarea
                        value={applicationData.additionalNotes}
                        onChange={(e) => setApplicationData(prev => ({
                          ...prev,
                          additionalNotes: e.target.value
                        }))}
                        rows={3}
                        disabled={submitting}
                        className={`w-full rounded-xl ${inputBg} ${inputBorder} focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200 ${disabledBg} ${disabledText} ${inputText}`}
                        placeholder="Any additional information you'd like to share..."
                      />
                    </div>

                    {applicationError && (
                      <div className={`${errorBg} border-l-4 ${errorBorder} p-4 rounded-lg`}>
                        <p className={`text-sm ${errorText}`}>{applicationError}</p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={toggleApplicationForm}
                        disabled={submitting}
                        className={`flex-1 py-3 ${isDark ? 'bg-gray-700 border-2 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'} rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`flex-1 py-3 ${
                          submitting 
                            ? 'bg-purple-400 cursor-wait' 
                            : isDark 
                              ? 'bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-800 hover:to-purple-950 transform hover:scale-[1.02]'
                              : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transform hover:scale-[1.02]'
                        } text-white rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70`}
                      >
                        {submitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {submissionStage === 'analyzing' && 'Analyzing resume...'}
                            {submissionStage === 'uploading' && 'Uploading resume...'}
                            {submissionStage === 'processing' && 'Processing application...'}
                            {submissionStage === 'saving' && 'Saving application...'}
                            {submissionStage === 'complete' && 'Application submitted!'}
                            {submissionStage === 'idle' && 'Submitting...'}
                          </span>
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <CoverLetterFullscreenModal />
    </div>
  );
};
export default JobDetail;