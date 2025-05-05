import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Eye, EyeOff, Users, List, Calendar, Tag, Plus, FileText, Briefcase, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../Alerts/AlertDialog';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import Cookies from 'js-cookie';
import { useTheme } from '../../context/ThemeContext';
import { useThemeStyles } from '../hooks/useThemeStyles';

const StatusBadge = ({ status }) => {
  const { isDark } = useTheme();
  
  const getStatusConfig = (status) => {
    switch(status) {
      case 'active':
        return {
          bg: isDark ? 'bg-emerald-900/30' : 'bg-emerald-50',
          text: isDark ? 'text-emerald-300' : 'text-emerald-700',
          border: isDark ? 'border-emerald-700' : 'border-emerald-200',
          icon: <Eye className={`h-3 w-3 mr-1 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
        };
      case 'hidden':
        return {
          bg: isDark ? 'bg-amber-900/30' : 'bg-amber-50',
          text: isDark ? 'text-amber-300' : 'text-amber-700',
          border: isDark ? 'border-amber-700' : 'border-amber-200',
          icon: <EyeOff className={`h-3 w-3 mr-1 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
        };
      case 'closed':
        return {
          bg: isDark ? 'bg-rose-900/30' : 'bg-rose-50',
          text: isDark ? 'text-rose-300' : 'text-rose-700',
          border: isDark ? 'border-rose-700' : 'border-rose-200',
          icon: <AlertTriangle className={`h-3 w-3 mr-1 ${isDark ? 'text-rose-400' : 'text-rose-500'}`} />
        };
      case 'expired':
        return {
          bg: isDark ? 'bg-orange-900/30' : 'bg-orange-50',
          text: isDark ? 'text-orange-300' : 'text-orange-700',
          border: isDark ? 'border-orange-700' : 'border-orange-200',
          icon: <Clock className={`h-3 w-3 mr-1 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
        };
      case 'draft':
      default:
        return {
          bg: isDark ? 'bg-slate-800' : 'bg-slate-100',
          text: isDark ? 'text-slate-300' : 'text-slate-700',
          border: isDark ? 'border-slate-700' : 'border-slate-200',
          icon: <FileText className={`h-3 w-3 mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
        };
    }
  };
  
  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const JobCard = ({ job, onView, onEdit, onDelete, onViewApplications, onPreview, onToggleVisibility }) => {
  const { isDark } = useTheme();
  const { colors, styles } = useThemeStyles();
  
  const date = new Date(job.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const isHidden = job.status === 'hidden';
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return isDark ? 'from-emerald-950 to-emerald-900/50 shadow-emerald-900/20' : 'from-emerald-50 to-white shadow-emerald-200/30';
      case 'hidden': return isDark ? 'from-amber-950 to-amber-900/50 shadow-amber-900/20' : 'from-amber-50 to-white shadow-amber-200/30';
      case 'closed': return isDark ? 'from-rose-950 to-rose-900/50 shadow-rose-900/20' : 'from-rose-50 to-white shadow-rose-200/30';
      case 'expired': return isDark ? 'from-orange-950 to-orange-900/50 shadow-orange-900/20' : 'from-orange-50 to-white shadow-orange-200/30';
      case 'draft': 
      default: return isDark ? 'from-slate-900 to-slate-800 shadow-slate-900/20' : 'from-slate-50 to-white shadow-slate-200/30';
    }
  };
  
  const getBorderColor = (status) => {
    switch(status) {
      case 'active': return isDark ? 'border-emerald-800' : 'border-emerald-200';
      case 'hidden': return isDark ? 'border-amber-800' : 'border-amber-200';
      case 'closed': return isDark ? 'border-rose-800' : 'border-rose-200';
      case 'expired': return isDark ? 'border-orange-800' : 'border-orange-200';
      case 'draft': 
      default: return isDark ? 'border-slate-700' : 'border-slate-200';
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${getStatusColor(job.status)} border ${getBorderColor(job.status)} shadow-lg hover:shadow-xl transition-all duration-300 mb-6`}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{job.title}</h3>
              {/* Move status badge to a clearly visible position */}
             
            </div>
            
            <div className="space-y-2 mb-4">
              <div className={`flex items-center ${colors.textMuted}`}>
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Posted on {date}</span>
              </div>
              
              {/* Add more job information here if available */}
              <div className={`flex items-center ${colors.textMuted}`}>
                <Briefcase className="h-4 w-4 mr-2" />
                <span className="text-sm">{job.applicants?.length || 0} applicants</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-6">
          <button 
            onClick={() => onViewApplications(job._id)} 
            className={`flex items-center px-4 py-2 rounded-lg border ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            } transition-colors flex-1 justify-center`}
          >
            <Users className="h-4 w-4 mr-2" />
            <span>View Applicants</span>
          </button>
          
          <button 
            onClick={() => onPreview(job._id)}
            className={`flex items-center px-4 py-2 rounded-lg border ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            } transition-colors flex-1 justify-center`}
          >
            <Eye className="h-4 w-4 mr-2" />
            <span>Preview</span>
          </button>
        </div>
      </div>
      
      <div className={`absolute top-4 right-4 flex gap-2 z-10`}>
        <button 
          onClick={() => onToggleVisibility(job._id, isHidden ? 'active' : 'hidden')}
          className={`p-2 rounded-full ${
            isDark 
              ? `${isHidden ? 'bg-amber-900/70 text-amber-300' : 'bg-slate-800/70 text-slate-300'} hover:bg-opacity-100` 
              : `${isHidden ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'} hover:bg-opacity-100`
          } backdrop-blur-sm transition-colors`}
        >
          {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
        
        <button 
          onClick={() => onEdit(job._id)}
          className={`p-2 rounded-full ${
            isDark 
              ? 'bg-slate-800/70 text-slate-300 hover:bg-slate-700/90' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/90'
          } backdrop-blur-sm transition-colors`}
        >
          <Edit2 className="h-4 w-4" />
        </button>
        
        <button 
          onClick={() => onDelete(job._id)}
          className={`p-2 rounded-full ${
            isDark 
              ? 'bg-rose-900/30 text-rose-300 hover:bg-rose-800/50' 
              : 'bg-rose-50 text-rose-500 hover:bg-rose-100'
          } backdrop-blur-sm transition-colors`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const EmptyState = ({ onPostJob, isDark, colors }) => (
  <div className={`rounded-2xl bg-gradient-to-br ${
    isDark ? 'from-gray-900 to-gray-800' : 'from-gray-50 to-white'
  } p-10 border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-lg text-center`}>
    <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
      isDark ? 'bg-gray-800' : 'bg-gray-100'
    }`}>
      <Briefcase className={`h-8 w-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
    </div>
    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-3`}>No job listings yet</h3>
    <p className={`${colors.textMuted} mb-6 max-w-md mx-auto`}>
      Start attracting top talent by creating your first job listing. You can post jobs, review applications, and manage your hiring process all in one place.
    </p>
    <button 
      onClick={onPostJob} 
      className={`px-6 py-3 ${colors.buttonPrimary} text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center mx-auto`}
    >
      <Plus className="h-5 w-5 mr-2" />
      Create Your First Job
    </button>
  </div>
);

const StatsCard = ({ title, value, icon, color, isDark }) => {
  // Define color schemes based on the color prop
  const colorSchemes = {
    purple: {
      bg: isDark ? 'bg-violet-900/20' : 'bg-violet-50',
      text: isDark ? 'text-violet-300' : 'text-violet-700',
      iconBg: isDark ? 'bg-violet-800/50' : 'bg-violet-100',
      iconColor: isDark ? 'text-violet-300' : 'text-violet-600',
      border: isDark ? 'border-violet-800/50' : 'border-violet-200'
    },
    green: {
      bg: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50',
      text: isDark ? 'text-emerald-300' : 'text-emerald-700',
      iconBg: isDark ? 'bg-emerald-800/50' : 'bg-emerald-100',
      iconColor: isDark ? 'text-emerald-300' : 'text-emerald-600',
      border: isDark ? 'border-emerald-800/50' : 'border-emerald-200'
    },
    yellow: {
      bg: isDark ? 'bg-amber-900/20' : 'bg-amber-50',
      text: isDark ? 'text-amber-300' : 'text-amber-700',
      iconBg: isDark ? 'bg-amber-800/50' : 'bg-amber-100',
      iconColor: isDark ? 'text-amber-300' : 'text-amber-600',
      border: isDark ? 'border-amber-800/50' : 'border-amber-200'
    },
    red: {
      bg: isDark ? 'bg-rose-900/20' : 'bg-rose-50',
      text: isDark ? 'text-rose-300' : 'text-rose-700',
      iconBg: isDark ? 'bg-rose-800/50' : 'bg-rose-100',
      iconColor: isDark ? 'text-rose-300' : 'text-rose-600',
      border: isDark ? 'border-rose-800/50' : 'border-rose-200'
    },
    blue: {
      bg: isDark ? 'bg-sky-900/20' : 'bg-sky-50',
      text: isDark ? 'text-sky-300' : 'text-sky-700',
      iconBg: isDark ? 'bg-sky-800/50' : 'bg-sky-100',
      iconColor: isDark ? 'text-sky-300' : 'text-sky-600',
      border: isDark ? 'border-sky-800/50' : 'border-sky-200'
    },
    gray: {
      bg: isDark ? 'bg-slate-800/50' : 'bg-slate-100',
      text: isDark ? 'text-slate-300' : 'text-slate-700',
      iconBg: isDark ? 'bg-slate-700' : 'bg-slate-200',
      iconColor: isDark ? 'text-slate-300' : 'text-slate-600',
      border: isDark ? 'border-slate-700' : 'border-slate-200'
    }
  };
  
  const scheme = colorSchemes[color] || colorSchemes.purple;
  
  return (
    <div className={`rounded-xl ${scheme.bg} p-4 border ${scheme.border} relative overflow-hidden`}>
      <div className="flex justify-between">
        <div>
          <p className={`text-sm font-medium ${scheme.text}`}>{title}</p>
          <h4 className={`text-2xl font-bold mt-1 ${scheme.text}`}>{value}</h4>
        </div>
        <div className={`${scheme.iconBg} p-3 rounded-xl ${scheme.iconColor}`}>
          {icon}
        </div>
      </div>
      <div className={`absolute -right-3 -bottom-3 w-24 h-24 rounded-full ${scheme.iconBg} opacity-20`}></div>
    </div>
  );
};

const MyListingsContent = () => {
  const [listings, setListings] = useState([]);
  const [jobStats, setJobStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [viewType, setViewType] = useState('cards');
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { colors, styles } = useThemeStyles();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('usertoken');
      const response = await fetch('https://auriter-backen.onrender.com/api/jobs/my-jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch listings');
      
      const data = await response.json();
      
      if (data && data.jobs) {
        setListings(data.jobs);
        setJobStats(data.stats || {
          active: data.jobs.filter(job => job.status === 'active').length,
          hidden: data.jobs.filter(job => job.status === 'hidden').length,
          draft: data.jobs.filter(job => job.status === 'draft').length,
          closed: data.jobs.filter(job => job.status === 'closed').length,
          expired: data.jobs.filter(job => job.status === 'expired').length,
          total: data.jobs.length
        });
      } else {
        setListings(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteJobId) return;

    try {
      const token = Cookies.get('usertoken');
      const response = await fetch(`https://auriter-backen.onrender.com/api/jobs/${deleteJobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete job');
      
      setListings(listings.filter(job => job._id !== deleteJobId));
      setDeleteJobId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleEditJob = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  const handleViewApplications = (jobId) => {
    navigate(`/job-candidates/${jobId}`);
  };

  const handlePreviewJob = (jobId) => {
    navigate(`/job-preview/${jobId}`);
  };

  const handleToggleVisibility = async (jobId, newStatus) => {
    try {
      const token = Cookies.get('usertoken');
      const response = await fetch(`https://auriter-backen.onrender.com/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update job visibility');
      
      const updatedJob = await response.json();
      
      setListings(listings.map(job => 
        job._id === jobId ? { ...job, status: updatedJob.status } : job
      ));
      
      // Update job stats
      if (jobStats) {
        const prevStatus = listings.find(job => job._id === jobId)?.status;
        
        if (prevStatus && prevStatus !== updatedJob.status) {
          setJobStats({
            ...jobStats,
            [prevStatus]: Math.max(0, (jobStats[prevStatus] || 0) - 1),
            [updatedJob.status]: (jobStats[updatedJob.status] || 0) + 1
          });
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePostJob = () => {
    navigate('/post-jobs');
  };

  // Sort listings to display active jobs first and hidden jobs last
  const sortedListings = [...listings].sort((a, b) => {
    // Priority order: active > draft > expired > closed > hidden
    const statusOrder = {
      'active': 1,
      'draft': 2,
      'expired': 3,
      'closed': 4,
      'hidden': 5
    };
    
    return statusOrder[a.status] - statusOrder[b.status];
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className={`w-16 h-16 rounded-full border-4 border-t-transparent ${isDark ? 'border-purple-600' : 'border-purple-500'} animate-spin mb-4`}></div>
        <p className={isDark ? 'text-white' : 'text-gray-700'}>Loading your job listings...</p>
      </div>
    );
  }

  const renderStats = () => {
    if (!jobStats) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Active Jobs"
          value={jobStats.active || 0}
          icon={<Eye className="h-6 w-6" />}
          color="green"
          isDark={isDark}
        />
        <StatsCard
          title="Hidden Jobs"
          value={jobStats.hidden || 0}
          icon={<EyeOff className="h-6 w-6" />}
          color="yellow"
          isDark={isDark}
        />
        <StatsCard
          title="Draft Jobs"
          value={jobStats.draft || 0}
          icon={<FileText className="h-6 w-6" />}
          color="gray"
          isDark={isDark}
        />
        <StatsCard
          title="Closed Jobs"
          value={jobStats.closed || 0}
          icon={<Briefcase className="h-6 w-6" />}
          color="red"
          isDark={isDark}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      <div className={`rounded-xl bg-gradient-to-br ${
        isDark ? 'from-gray-800 to-gray-900' : 'from-white to-gray-50'
      } border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-lg p-6`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center">
            <div className={`p-3 rounded-xl mr-4 ${
              isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
            }`}>
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                My Job Listings
              </h1>
              <p className={colors.textMuted}>
                Manage your job postings and view applications
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex p-1 rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'}`}>
              <button 
                onClick={() => setViewType('cards')} 
                className={`p-2 rounded-md ${viewType === 'cards' 
                  ? (isDark ? 'bg-purple-900/70 text-purple-300' : 'bg-white text-purple-700 shadow-sm border border-gray-200') 
                  : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200')}`}
                title="Card View"
              >
                <List className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setViewType('table')} 
                className={`p-2 rounded-md ${viewType === 'table' 
                  ? (isDark ? 'bg-purple-900/70 text-purple-300' : 'bg-white text-purple-700 shadow-sm border border-gray-200') 
                  : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200')}`}
                title="Table View"
              >
                <Users className="h-5 w-5" />
              </button>
            </div>
            
            <button 
              onClick={handlePostJob} 
              className={`flex items-center px-4 py-2.5 ${colors.buttonPrimary} text-white rounded-lg shadow-md hover:shadow-lg transition-all`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Post a Job
            </button>
          </div>
        </div>
        
        {jobStats && listings.length > 0 && renderStats()}
        
        {error && (
          <div className={`mb-6 p-4 rounded-lg border ${
            isDark ? 'bg-rose-900/30 border-rose-800 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            <div className="flex items-center">
              <AlertTriangle className={`h-5 w-5 mr-2 ${isDark ? 'text-rose-400' : 'text-rose-500'}`} />
              <p className="font-medium">{error}</p>
            </div>
            <button 
              onClick={() => setError('')} 
              className={`mt-2 text-sm ${isDark ? 'text-rose-400 hover:text-rose-300' : 'text-rose-600 hover:text-rose-800'} underline`}
            >
              Dismiss
            </button>
          </div>
        )}

        {listings.length === 0 ? (
          <EmptyState onPostJob={handlePostJob} isDark={isDark} colors={colors} />
        ) : viewType === 'cards' ? (
          <div className="grid grid-cols-1 gap-6">
            {sortedListings.map((job) => (
              <JobCard 
                key={job._id} 
                job={job} 
                onView={handleViewJob}
                onEdit={handleEditJob}
                onDelete={setDeleteJobId}
                onViewApplications={handleViewApplications}
                onPreview={handlePreviewJob}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border shadow-sm mb-6 overflow-x-auto">
            <table className={`min-w-full divide-y ${isDark ? 'divide-gray-700 border-gray-700' : 'divide-gray-200 border-gray-200'}`}>
              <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3.5 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Job Title</th>
                  <th className={`px-6 py-3.5 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                  <th className={`px-6 py-3.5 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Posted Date</th>
                  <th className={`px-6 py-3.5 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`${isDark ? 'bg-gray-900' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {sortedListings.map((job) => {
                  const getBorderClass = (status) => {
                    switch(status) {
                      case 'active': return isDark ? 'border-l-4 border-emerald-600' : 'border-l-4 border-emerald-500';
                      case 'hidden': return isDark ? 'border-l-4 border-amber-600' : 'border-l-4 border-amber-500';
                      case 'closed': return isDark ? 'border-l-4 border-rose-600' : 'border-l-4 border-rose-500';
                      case 'expired': return isDark ? 'border-l-4 border-orange-600' : 'border-l-4 border-orange-500';
                      case 'draft': return isDark ? 'border-l-4 border-slate-600' : 'border-l-4 border-slate-400';
                      default: return '';
                    }
                  };
                  
                  return (
                    <tr key={job._id} className={`${getBorderClass(job.status)} ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Briefcase className={`h-4 w-4 mr-2 ${
                            job.status === 'active' ? (isDark ? 'text-emerald-400' : 'text-emerald-500') :
                            job.status === 'hidden' ? (isDark ? 'text-amber-400' : 'text-amber-500') :
                            job.status === 'closed' ? (isDark ? 'text-rose-400' : 'text-rose-500') :
                            job.status === 'expired' ? (isDark ? 'text-orange-400' : 'text-orange-500') :
                            (isDark ? 'text-slate-400' : 'text-slate-500')
                          }`} />
                          <span className={`font-medium ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>{job.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className={`px-6 py-4 text-sm ${colors.textMuted}`}>
                        {new Date(job.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleViewApplications(job._id)}
                            className={`flex items-center text-sm px-3 py-1.5 rounded-lg ${
                              isDark 
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            } transition-colors`}
                          >
                            <Users className="h-4 w-4 mr-1.5" />
                            Applicants
                          </button>
                          <button
                            onClick={() => handlePreviewJob(job._id)}
                            className={`flex items-center text-sm px-3 py-1.5 rounded-lg ${
                              isDark 
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            } transition-colors`}
                          >
                            <Eye className="h-4 w-4 mr-1.5" />
                            Preview
                          </button>
                          <div className="flex items-center space-x-2 ml-2">
                            <button
                              onClick={() => handleToggleVisibility(job._id, job.status === 'hidden' ? 'active' : 'hidden')}
                              className={`p-2 rounded-full ${
                                isDark 
                                  ? 'hover:bg-slate-700' 
                                  : 'hover:bg-slate-200'
                              } transition-colors`}
                              title={job.status === 'hidden' ? "Show Job" : "Hide Job"}
                            >
                              {job.status === 'hidden' ? (
                                <Eye className={`h-5 w-5 ${
                                  isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-500 hover:text-emerald-600'
                                }`} />
                              ) : (
                                <EyeOff className={`h-5 w-5 ${
                                  isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-500 hover:text-amber-600'
                                }`} />
                              )}
                            </button>
                            <button
                              onClick={() => handleEditJob(job._id)}
                              className={`p-2 rounded-full ${
                                isDark 
                                  ? 'hover:bg-slate-700' 
                                  : 'hover:bg-slate-200'
                              } transition-colors`}
                              title="Edit Job"
                            >
                              <Edit2 className={`h-5 w-5 ${
                                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
                              }`} />
                            </button>
                            <button
                              onClick={() => setDeleteJobId(job._id)}
                              className={`p-2 rounded-full ${
                                isDark 
                                  ? 'hover:bg-slate-700' 
                                  : 'hover:bg-slate-200'
                              } transition-colors`}
                              title="Delete Job"
                            >
                              <Trash2 className={`h-5 w-5 ${
                                isDark ? 'text-rose-400 hover:text-rose-300' : 'text-rose-500 hover:text-rose-600'
                              }`} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteJobId} onOpenChange={() => setDeleteJobId(null)}>
        <AlertDialogContent className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-xl`}>
          <AlertDialogHeader>
            <AlertDialogTitle className={isDark ? 'text-white' : 'text-gray-900'}>
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              This will permanently delete the job listing and all associated applications. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={`${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'} rounded-lg border`}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
            >
              Delete Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyListingsContent;