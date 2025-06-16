import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Briefcase, Plus, Check, X, Building, 
  MapPin, DollarSign, Calendar, Users, Eye, ArrowLeft
} from 'lucide-react';
import Cookies from 'js-cookie';

const PrivateJobsPage = () => {
  const navigate = useNavigate();
  const { partnerId } = useParams();
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [privateJobs, setPrivateJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [assigning, setAssigning] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (partnerId) {
      fetchPartnerInfo();
      fetchPrivateJobs();
      fetchAssignedJobs();
    }
  }, [partnerId]);

  const fetchPartnerInfo = async () => {
    try {
      const token = Cookies.get('admintoken');
      const response = await fetch(`https://airuter-backend.onrender.com/api/partner/partners/${partnerId}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPartnerInfo(data.partner);
      }
    } catch (error) {
      console.error('Error fetching partner info:', error);
    }
  };

  const fetchPrivateJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const token = Cookies.get('admintoken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://airuter-backend.onrender.com/api/partner/job-access/private', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPrivateJobs(data.data);
      } else {
        setError(data.message || 'Failed to fetch private jobs');
      }
    } catch (error) {
      console.error('Error fetching private jobs:', error);
      setError('Failed to load private jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedJobs = async () => {
    try {
      const token = Cookies.get('admintoken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`https://airuter-backend.onrender.com/api/partner/job-access/${partnerId}/assigned-jobs`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAssignedJobs(data.data.map(job => job._id));
      } else {
        console.error('Failed to fetch assigned jobs:', data.message);
      }
    } catch (error) {
      console.error('Error fetching assigned jobs:', error);
    }
  };

  const handleAssignJob = async (jobId) => {
    setAssigning(prev => ({ ...prev, [jobId]: true }));
    
    try {
      const token = Cookies.get('admintoken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://airuter-backend.onrender.com/api/partner/job-access/assign-to-partner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId,
          partnerId,
          access: 'granted'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setAssignedJobs(prev => [...prev, jobId]);
        alert(`Job access granted to ${partnerInfo?.partnerName} candidates!`);
      } else {
        alert(data.message || 'Error assigning job');
      }
    } catch (error) {
      console.error('Error assigning job:', error);
      alert('Error assigning job. Please try again.');
    } finally {
      setAssigning(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const handleRevokeAccess = async (jobId) => {
    if (!window.confirm('Are you sure you want to revoke access to this job?')) return;
    
    setAssigning(prev => ({ ...prev, [jobId]: true }));
    
    try {
      const token = Cookies.get('admintoken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://airuter-backend.onrender.com/api/partner/job-access/revoke-partner-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId,
          partnerId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setAssignedJobs(prev => prev.filter(id => id !== jobId));
        alert('Job access revoked successfully!');
      } else {
        alert(data.message || 'Error revoking access');
      }
    } catch (error) {
      console.error('Error revoking access:', error);
      alert('Error revoking access. Please try again.');
    } finally {
      setAssigning(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const formatSalary = (min, max, currency = 'INR') => {
    const formatAmount = (amount) => {
      if (amount >= 100000) {
        return `${(amount / 100000).toFixed(1)}L`;
      }
      return `${(amount / 1000).toFixed(0)}K`;
    };
    
    return `${formatAmount(min)} - ${formatAmount(max)} ${currency}`;
  };

  const formatExperience = (min, max) => {
    if (min === max) return `${min} year${min !== 1 ? 's' : ''}`;
    return `${min}-${max} years`;
  };

  const handleBack = () => {
    navigate('/admin/partners'); // Adjust this path according to your routing
  };

  return (
    <div className="max-w-full px-4 sm:px-6 py-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Partners
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Private Jobs Access
          </h1>
          {partnerInfo && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Grant access to private jobs for <span className="font-semibold">{partnerInfo.partnerName}</span>
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Candidates: Loading...
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => {
              setError('');
              fetchPrivateJobs();
            }}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : privateJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No private jobs available</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {privateJobs.map((job) => {
                const isAssigned = assignedJobs.includes(job._id);
                const isLoading = assigning[job._id];

                return (
                  <div key={job._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                    {/* Job Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                          <Building className="h-4 w-4 mr-1" />
                          <span className="text-sm">{job.company}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-col">
                        {isAssigned && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                            Access Granted
                          </span>
                        )}
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          Private
                        </span>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                        <span className="mx-2">•</span>
                        <span className="capitalize whitespace-nowrap">{job.type.replace('-', ' ')}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="whitespace-nowrap">{formatSalary(job.salary.min, job.salary.max, job.salary.currency)}</span>
                        <span className="mx-2">•</span>
                        <span className="whitespace-nowrap">{formatExperience(job.experience.min, job.experience.max)}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="whitespace-nowrap">Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Required Skills:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {job.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{job.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Job Description Preview */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t">
                      {isAssigned ? (
                        <button
                          onClick={() => handleRevokeAccess(job._id)}
                          disabled={isLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          Revoke
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAssignJob(job._id)}
                          disabled={isLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          Grant Access
                        </button>
                      )}
                      
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateJobsPage;