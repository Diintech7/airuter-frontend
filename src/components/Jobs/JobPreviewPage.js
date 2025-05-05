import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Calendar, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { useTheme } from '../../context/ThemeContext';
import { useThemeStyles } from '../hooks/useThemeStyles';

const StatusBadge = ({ status }) => {
  const { isDark } = useTheme();
  
  const statusStyles = {
    active: isDark ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800',
    draft: isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800',
    closed: isDark ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800',
    hidden: isDark ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
    expired: isDark ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || (isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800')}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const JobPreviewPage = () => {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { colors, styles } = useThemeStyles();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://auriter-backen.onrender.com/api/jobs/${jobId}`);
        
        if (!response.ok) throw new Error('Failed to fetch job details');
        
        const data = await response.json();
        setJobData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-lg ${isDark ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-800'}`}>
        <h3 className="text-xl font-bold mb-2">Error</h3>
        <p>{error}</p>
        <button 
          onClick={handleGoBack}
          className={`mt-4 px-4 py-2 rounded-md ${
            isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!jobData) return null;

  const formattedDate = new Date(jobData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <button 
        onClick={handleGoBack}
        className={`flex items-center mb-6 px-4 py-2 rounded-md ${
          isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        } transition-colors`}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Listings
      </button>
      
      <Card className={`overflow-hidden border-0 shadow-xl ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <CardHeader className={`pb-4 ${isDark ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <StatusBadge status={jobData.status} />
                <span className={`text-xs ${colors.textMuted}`}>
                  Published: {formattedDate}
                </span>
              </div>
              <CardTitle className={`text-3xl font-bold ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
                {jobData.title}
              </CardTitle>
              <p className={`mt-2 text-lg ${colors.textMuted}`}>{jobData.company}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className={`flex items-center p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <MapPin className={`h-5 w-5 mr-3 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <div>
                <p className={`text-xs ${colors.textMuted}`}>Location</p>
                <p className="font-medium">{jobData.location}</p>
              </div>
            </div>
            
            <div className={`flex items-center p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <Clock className={`h-5 w-5 mr-3 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <div>
                <p className={`text-xs ${colors.textMuted}`}>Job Type</p>
                <p className="font-medium">{jobData.type}</p>
              </div>
            </div>
            
            <div className={`flex items-center p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <Award className={`h-5 w-5 mr-3 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <div>
                <p className={`text-xs ${colors.textMuted}`}>Experience</p>
                <p className="font-medium">{jobData.experience.min} - {jobData.experience.max} years</p>
              </div>
            </div>
            
            <div className={`flex items-center p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <DollarSign className={`h-5 w-5 mr-3 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <div>
                <p className={`text-xs ${colors.textMuted}`}>Salary</p>
                <p className="font-medium">
                  {jobData.salary.currency} {jobData.salary.min.toLocaleString()} - {jobData.salary.max.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
              Skills Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {jobData.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1.5 rounded-full ${
                    isDark ? 'bg-purple-900/50 text-purple-200' : 'bg-purple-100 text-purple-800'
                  } text-sm`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
              Job Description
            </h3>
            <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <p className="whitespace-pre-line leading-relaxed">{jobData.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                Requirements
              </h3>
              <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <ul className="space-y-3">
                  {jobData.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className={`inline-block w-2 h-2 mt-1.5 mr-3 rounded-full ${isDark ? 'bg-purple-400' : 'bg-purple-600'}`}></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                Responsibilities
              </h3>
              <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <ul className="space-y-3">
                  {jobData.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start">
                      <span className={`inline-block w-2 h-2 mt-1.5 mr-3 rounded-full ${isDark ? 'bg-purple-400' : 'bg-purple-600'}`}></span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {jobData.benefits && jobData.benefits.length > 0 && (
            <div>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                Benefits
              </h3>
              <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${isDark ? 'bg-purple-900' : 'bg-purple-100'} flex items-center justify-center mr-3`}>
                        <Briefcase className={`h-4 w-4 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
                      </div>
                      <p>{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobPreviewPage;