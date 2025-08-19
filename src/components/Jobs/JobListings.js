import React, { useState, useEffect } from 'react';
import { Search, MapPin, BriefcaseIcon, Filter, LayoutGrid, List, Clock, Crown, Globe } from 'lucide-react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useTheme } from '../../context/ThemeContext';
import { useThemeStyles } from '../hooks/useThemeStyles';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('card'); // card or table
  const [accessInfo, setAccessInfo] = useState(null); // Store access information
  const [filters, setFilters] = useState({
    jobType: '',
    experience: '',
    location: ''
  });
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { colors, styles, cx } = useThemeStyles();
  const [appliedByJobId, setAppliedByJobId] = useState({});

  // Enhanced job type color mapping with improved contrast
  const getJobTypeColor = (jobType) => {
    const colorMap = {
      'Full-time': isDark ? 'bg-emerald-600 text-emerald-100' : 'bg-emerald-500 text-white',
      'Part-time': isDark ? 'bg-blue-600 text-blue-100' : 'bg-blue-500 text-white',
      'Contract': isDark ? 'bg-violet-600 text-violet-100' : 'bg-violet-500 text-white',
      'Freelance': isDark ? 'bg-amber-600 text-amber-100' : 'bg-amber-500 text-white',
      'Internship': isDark ? 'bg-rose-600 text-rose-100' : 'bg-rose-500 text-white',
      'Remote': isDark ? 'bg-indigo-600 text-indigo-100' : 'bg-indigo-500 text-white'
    };
    
    return colorMap[jobType] || (isDark ? 'bg-gray-600 text-gray-100' : 'bg-gray-500 text-white');
  };

  // Enhanced fetch jobs function with better error handling and authentication
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('usertoken');
      console.log(token)
      
      // Prepare headers - always include token if available
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Making authenticated request with token');
      } else {
        console.log('Making unauthenticated request');
      }

      const response = await fetch('https://airuter-backend.onrender.com/api/jobs', {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Extract jobs array and access info from response
      setJobs(data.jobs || []);
      setAccessInfo(data.accessInfo || null);
      
      // Log access information for debugging
      if (data.accessInfo) {
        console.log('Access Info:', {
          isAuthenticated: data.accessInfo.isAuthenticated,
          userType: data.accessInfo.userType,
          isCandidate: data.accessInfo.isCandidate,
          hasPartnerAccess: data.accessInfo.hasPartnerAccess,
          partnerName: data.accessInfo.partnerName,
          jobsShown: data.accessInfo.jobsShown,
          totalAvailable: data.accessInfo.totalAvailable
        });
      }
      
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch applied jobs to mark listings
  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const token = Cookies.get('candidatetoken') || Cookies.get('usertoken');
        if (!token) return;
        const res = await fetch('https://airuter-backend.onrender.com/api/jobs-applied/my-applications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        const map = {};
        (data.applications || []).forEach(app => {
          const jobId = app.jobId || app.job?._id || app.job?.id || (typeof app.job === 'string' ? app.job : null);
          if (jobId) map[jobId] = app.createdAt;
        });
        setAppliedByJobId(map);
      } catch (e) {
        // ignore
      }
    };
    fetchApplied();
  }, []);

  const handleJobClick = (jobId) => {
    navigate(`/detail/${jobId}`);
  };

  // Filter jobs based on search and filter criteria
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filters.jobType || job.type === filters.jobType;
    const matchesLocation = !filters.location || job.location === filters.location;
    const matchesExperience = !filters.experience || (
      job.experience.min <= parseInt(filters.experience) &&
      job.experience.max >= parseInt(filters.experience)
    );

    return matchesSearch && matchesType && matchesLocation && matchesExperience;
  });

  // Extract unique values for filters
  const uniqueLocations = [...new Set(jobs.map(job => job.location))];
  const jobTypes = [...new Set(jobs.map(job => job.type))];
  
  // Get company logo color - generate consistent color based on company name
  const getCompanyLogoColor = (company) => {
    const colorOptions = [
      isDark ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-600',
      isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600',
      isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-600',
      isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-600',
      isDark ? 'bg-cyan-900 text-cyan-200' : 'bg-cyan-100 text-cyan-600',
      isDark ? 'bg-rose-900 text-rose-200' : 'bg-rose-100 text-rose-600',
    ];
    
    // Simple hash function to get consistent color for same company
    const hash = company.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorOptions[hash % colorOptions.length];
  };

  // Render company logo or fallback
  const renderCompanyLogo = (job) => {
    // Check if logo exists in job data
    if (job.logo) {
      return (
        <img 
          src={job.logo} 
          alt={`${job.company} logo`}
          className="w-12 h-12 rounded-lg object-cover"
          onError={(e) => {
            // If image fails to load, show fallback
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = `
              <div class="w-12 h-12 ${getCompanyLogoColor(job.company)} rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="text-xl font-bold">${job.company.charAt(0)}</span>
              </div>
            `;
          }}
        />
      );
    }
    
    // Fallback to colored box with first letter
    return (
      <div className={`w-12 h-12 ${getCompanyLogoColor(job.company)} rounded-lg flex items-center justify-center flex-shrink-0`}>
        <span className="text-xl font-bold">
          {job.company.charAt(0)}
        </span>
      </div>
    );
  };

  // Function to render premium indicator for private jobs
  const renderPremiumIndicator = (job) => {
    if (job.visibility === 'private') {
      return (
        <div className="flex items-center">
          <Crown size={12} className="mr-1 text-yellow-500" />
          <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Premium</span>
        </div>
      );
    }
    return null;
  };

  // Enhanced skill badge style based on skill content
  const getSkillBadgeStyle = (skill) => {
    const baseStyle = isDark ? 
      'text-xs font-medium px-2 py-1 rounded-full' : 
      'text-xs font-medium px-2 py-1 rounded-full';
      
    const styleMappings = {
      'React': isDark ? 'bg-sky-800 text-sky-200' : 'bg-sky-100 text-sky-800',
      'Vue': isDark ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-800',
      'Angular': isDark ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800',
      'Node': isDark ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800',
      'Python': isDark ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800',
      'Java': isDark ? 'bg-amber-800 text-amber-200' : 'bg-amber-100 text-amber-800',
      'PHP': isDark ? 'bg-indigo-800 text-indigo-200' : 'bg-indigo-100 text-indigo-800',
      'SQL': isDark ? 'bg-cyan-800 text-cyan-200' : 'bg-cyan-100 text-cyan-800',
      'UI/UX': isDark ? 'bg-fuchsia-800 text-fuchsia-200' : 'bg-fuchsia-100 text-fuchsia-800',
      'AWS': isDark ? 'bg-orange-800 text-orange-200' : 'bg-orange-100 text-orange-800',
      'DevOps': isDark ? 'bg-violet-800 text-violet-200' : 'bg-violet-100 text-violet-800',
    };
    
    // Check if we have a specific mapping, otherwise use default
    for (const key in styleMappings) {
      if (skill.includes(key)) {
        return `${baseStyle} ${styleMappings[key]}`;
      }
    }
    
    // Default style for skills without specific mapping
    return `${baseStyle} ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`;
  };

  // Format time since posting
  const getTimeSincePosting = (createdAt) => {
    const now = new Date();
    const postedDate = new Date(createdAt);
    const diffInHours = Math.floor((now - postedDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-6 ${colors.bg}`}>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${colors.text} mb-2`}>Discover Your Next Career</h1>
            <div className="flex flex-col gap-1">
              <p className={`${colors.textSecondary}`}>
                {filteredJobs.length} opportunities matching your criteria
              </p>
              
              {/* Enhanced Access Information Display */}
              {accessInfo && (
                <div className="flex items-center gap-4 text-sm">
                  <div className={`flex items-center gap-1 ${colors.textMuted}`}>
                    <span>Access Level:</span>
                    {accessInfo.isAuthenticated ? (
                      <span className={`font-medium ${accessInfo.hasPartnerAccess ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {accessInfo.hasPartnerAccess ? `Partner (${accessInfo.partnerName})` : 'Standard'}
                      </span>
                    ) : (
                      <span className="font-medium text-gray-600 dark:text-gray-400">Guest</span>
                    )}
                  </div>
                  
                  {accessInfo.hasPartnerAccess && (
                    <div className={`flex items-center gap-1 ${colors.textMuted}`}>
                      <Crown size={14} className="text-yellow-500" />
                      <span>Including premium jobs</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* View toggle buttons */}
          <div className={`flex rounded-lg p-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} shadow-sm`}>
            <button 
              onClick={() => setViewMode('card')}
              className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${
                viewMode === 'card' 
                  ? (isDark ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30' : 'bg-purple-600 text-white shadow-md') 
                  : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')
              }`}
              aria-label="Card view"
            >
              <LayoutGrid size={18} className="mr-2" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${
                viewMode === 'table' 
                  ? (isDark ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30' : 'bg-purple-600 text-white shadow-md') 
                  : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')
              }`}
              aria-label="Table view"
            >
              <List size={18} className="mr-2" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
        
        {/* Search and filter section */}
        <div className={`p-4 rounded-xl ${colors.bgCard} shadow-md mb-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs or companies..."
                className={`pl-10 w-full h-12 rounded-xl ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} shadow-sm ${isDark ? 'focus:border-purple-400 focus:ring-purple-400' : 'focus:border-purple-500 focus:ring-purple-500'} ${isDark ? 'text-white' : 'text-gray-900'} ${isDark ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={filters.jobType}
                onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
                className={`h-12 rounded-xl px-4 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} shadow-sm ${isDark ? 'focus:border-purple-400 focus:ring-purple-400' : 'focus:border-purple-500 focus:ring-purple-500'} ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                <option value="">Job Type</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className={`h-12 rounded-xl px-4 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} shadow-sm ${isDark ? 'focus:border-purple-400 focus:ring-purple-400' : 'focus:border-purple-500 focus:ring-purple-500'} ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                <option value="">Location</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <select
                value={filters.experience}
                onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                className={`h-12 rounded-xl px-4 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} shadow-sm ${isDark ? 'focus:border-purple-400 focus:ring-purple-400' : 'focus:border-purple-500 focus:ring-purple-500'} ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                <option value="">Experience</option>
                <option value="0">0-2 years</option>
                <option value="3">3-5 years</option>
                <option value="5">5+ years</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className={`${isDark ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-800'} border rounded-xl p-6 shadow-md`}>
          <div className="flex items-center">
            <div className={`rounded-full p-2 mr-3 ${isDark ? 'bg-red-800' : 'bg-red-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Error Loading Jobs</h3>
              <p>{error}</p>
            </div>
          </div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className={`${isDark ? 'bg-blue-900 border-blue-800' : 'bg-blue-50 border-blue-100'} border rounded-xl p-8 text-center shadow-md`}>
          <div className={`rounded-full mx-auto p-4 mb-4 ${isDark ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-600'}`} style={{width: "64px", height: "64px"}}>
            <Search size={32} />
          </div>
          <h3 className={`font-semibold text-xl mb-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>No matching jobs found</h3>
          <p className={`${isDark ? 'text-blue-300' : 'text-blue-600'} mb-4`}>Try adjusting your search criteria or filters</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilters({jobType: '', experience: '', location: ''});
            }}
            className={`px-4 py-2 rounded-lg ${isDark ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} transition-colors`}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Card View */}
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => handleJobClick(job._id)}
                  className={`${colors.bgCard} rounded-xl ${isDark ? 'shadow-md shadow-gray-900/30 hover:shadow-lg hover:shadow-purple-900/20' : 'shadow-md hover:shadow-lg'} transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden group relative`}
                >
                  {/* Premium strip for private jobs */}
                  {job.visibility === 'private' && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                      <Crown size={12} className="inline mr-1" />
                      PREMIUM
                    </div>
                  )}
                  
                  {/* Top colored strip based on job type */}
                  <div className={`h-1.5 w-full ${job.visibility === 'private' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : getJobTypeColor(job.type).split(' ')[0]}`}></div>
                  
                  <div className="p-5">
                    {/* Header with company logo and posting time */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start space-x-3">
                        {renderCompanyLogo(job)}
                        <div className="min-w-0">
                          <h3 className={`text-lg font-semibold ${colors.text} truncate group-hover:text-purple-500 transition-colors`}>{job.title}</h3>
                          <p className={`text-sm ${colors.textSecondary} truncate`}>{job.company}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center mb-1">
                          <Clock size={14} className="mr-1 text-gray-400" />
                          <span className={`text-xs ${colors.textMuted}`}>
                            {getTimeSincePosting(job.createdAt)}
                          </span>
                        </div>
                        {appliedByJobId[job._id] && (
                          <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'}`}>
                            Applied on {new Date(appliedByJobId[job._id]).toLocaleDateString()}
                          </div>
                        )}
                        {renderPremiumIndicator(job)}
                      </div>
                    </div>

                    {/* Job details */}
                    <div className="mt-4 space-y-3">
                      <div className={`flex items-center text-sm ${colors.textSecondary}`}>
                        <MapPin size={16} className="mr-1.5 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className={`flex items-center text-sm ${colors.textSecondary}`}>
                        <BriefcaseIcon size={16} className="mr-1.5 flex-shrink-0" />
                        <span>{job.experience.min}-{job.experience.max} years</span>
                      </div>
                      
                      {/* Job type badge */}
                      <div className="pt-1 flex justify-between items-center">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-md ${getJobTypeColor(job.type)}`}>
                          {job.type}
                        </span>
                        {appliedByJobId[job._id] && (
                          <span className={`inline-block px-2 py-1 text-[11px] font-medium rounded-md ${isDark ? 'bg-green-900 text-green-200' : 'bg-green-50 text-green-700'} border ${isDark ? 'border-green-800' : 'border-green-200'}`}>
                            Already applied
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Skills section with improved styling */}
                    <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
                      <p className={`text-xs font-medium mb-2 ${colors.textMuted}`}>SKILLS</p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className={getSkillBadgeStyle(skill)}
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                            +{job.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Apply now indicator */}
                    <div className="mt-4 pt-3 flex justify-between items-center">
                      <div className={`${isDark ? 'text-purple-400' : 'text-purple-600'} text-sm font-medium group-hover:translate-x-1 transition-transform duration-300 flex items-center`}>
                        View details
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                      
                      <div className={`text-xs ${colors.textMuted}`}>
                        {Math.floor(Math.random() * 30) + 5} applicants
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Table View with Enhanced Styling */}
          {viewMode === 'table' && (
            <div className={`${colors.bgCard} shadow-md rounded-xl overflow-hidden`}>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <tr>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-medium ${colors.text} uppercase tracking-wider`}>Job</th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-medium ${colors.text} uppercase tracking-wider`}>Company</th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-medium ${colors.text} uppercase tracking-wide`}>Location</th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-medium ${colors.text} uppercase tracking-wider hidden md:table-cell`}>Experience</th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-medium ${colors.text} uppercase tracking-wider hidden sm:table-cell`}>Type</th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-medium ${colors.text} uppercase tracking-wider hidden lg:table-cell`}>Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredJobs.map((job, idx) => (
                    <tr 
                      key={job._id} 
                      onClick={() => handleJobClick(job._id)}
                      className={`${idx % 2 === 0 ? (isDark ? 'bg-gray-800' : 'bg-white') : (isDark ? 'bg-gray-750' : 'bg-gray-50')}
                        ${isDark ? 'hover:bg-gray-700' : 'hover:bg-purple-50'} cursor-pointer transition-colors relative`}
                    >
                      {/* Premium indicator strip for table rows */}
                      {job.visibility === 'private' && (
                        <td className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-yellow-500"></td>
                      )}
                      
                      <td className={`px-6 py-4 ${colors.text} ${job.visibility === 'private' ? 'pl-8' : ''}`}>
                        <div className="flex items-center">
                          <div className="font-medium">{job.title}</div>
                          {job.visibility === 'private' && (
                            <Crown size={14} className="ml-2 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getTimeSincePosting(job.createdAt)}
                        </div>
                        {appliedByJobId[job._id] && (
                          <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'}`}>
                            Applied on {new Date(appliedByJobId[job._id]).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className={`px-6 py-4 ${job.visibility === 'private' ? 'pl-8' : ''}`}>
                        <div className="flex items-center">
                          {renderCompanyLogo(job)}
                          <span className={`ml-2 ${colors.textSecondary}`}>{job.company}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${colors.textSecondary} ${job.visibility === 'private' ? 'pl-8' : ''}`}>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-1.5 text-gray-400" />
                          {job.location}
                        </div>
                      </td>
                      <td className={`px-6 py-4 w-1/6 ${colors.textSecondary} hidden md:table-cell ${job.visibility === 'private' ? 'pl-8' : ''}`}>
                        <div className="flex items-center">
                          <BriefcaseIcon size={16} className="mr-1.5 text-gray-400" />
                          {job.experience.min}-{job.experience.max} years
                        </div>
                      </td>
                      <td className={`px-6 py-4 w-1/6 hidden sm:table-cell ${job.visibility === 'private' ? 'pl-8' : ''}`}>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-md ${getJobTypeColor(job.type)}`}>
                          {job.type}
                        </span>
                      </td>
                      <td className={`px-6 py-4 hidden lg:table-cell ${job.visibility === 'private' ? 'pl-8' : ''}`}>
                        {job.visibility === 'private' ? (
                          <div className="flex items-center">
                            <Crown size={14} className="mr-1.5 text-yellow-500" />
                            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Premium</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Globe size={14} className="mr-1.5 text-green-500" />
                            <span className="text-xs text-green-600 dark:text-green-400">Standard</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination controls */}
              <div className={`px-6 py-4 ${isDark ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className={`text-sm ${colors.textSecondary}`}>
                    Showing <span className="font-medium">{filteredJobs.length}</span> of <span className="font-medium">{jobs.length}</span> jobs
                  </div>
                  <div className="flex space-x-2">
                    <button className={`px-3 py-1 rounded-md text-sm ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                      Previous
                    </button>
                    <button className={`px-3 py-1 rounded-md text-sm ${isDark ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-purple-600 text-white hover:bg-purple-700'} transition-colors`}>
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobListings;