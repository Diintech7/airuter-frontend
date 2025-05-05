import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, MapPin, Briefcase, Clock, Tag, Eye, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const RecruiterJobsView = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [recruiter, setRecruiter] = useState(null);
  const navigate = useNavigate();
  const { recruiterId } = useParams();

  useEffect(() => {
    if (recruiterId) {
      fetchRecruiterJobs();
    }
  }, [recruiterId]);

  const fetchRecruiterJobs = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('admintoken');
      
      if (!token) {
        toast.error('Authentication required');
        navigate('/admin/login');
        return;
      }

      // First get recruiter details
      const recruiterResponse = await axios.get(`https://auriter-backen.onrender.com/api/admin/recruiters/${recruiterId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (recruiterResponse.data.success) {
        setRecruiter(recruiterResponse.data.recruiter);
      }

      // Then get jobs posted by this recruiter
      const jobsResponse = await axios.get(`https://auriter-backen.onrender.com/api/admin/recruiters/${recruiterId}/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (jobsResponse.data.success) {
        setJobs(jobsResponse.data.jobs);
      }
    } catch (error) {
      console.error('Error fetching recruiter jobs:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        Cookies.remove('admintoken');
        Cookies.remove('adminUser');
        navigate('/admin/login');
        return;
      }
      toast.error('Failed to load recruiter jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const token = Cookies.get('admintoken');
        
        if (!token) {
          toast.error('Authentication required');
          navigate('/admin/login');
          return;
        }
        
        const response = await axios.delete(`https://auriter-backen.onrender.com/api/admin/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          toast.success('Job deleted successfully');
          // Refresh the job list
          fetchRecruiterJobs();
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          Cookies.remove('admintoken');
          Cookies.remove('adminUser');
          navigate('/admin/login');
          return;
        }
        toast.error(error.response?.data?.message || 'Error deleting job');
      }
    }
  };

  const handleEditJob = (jobId) => {
    navigate(`/admin/jobs/edit/${jobId}`);
  };

  const handleViewJobDetails = (jobId) => {
    navigate(`/admin/jobs/${jobId}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/admin/recruiters')}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Recruiters
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Jobs by {recruiter?.name || 'Recruiter'}
        </h1>
      </div>

      {/* Recruiter Brief Info */}
      {recruiter && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{recruiter.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {recruiter.company?.position} at {recruiter.company?.name}
              </p>
            </div>
            <div>
              <button
                onClick={() => navigate(`/admin/recruiters`)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                View Recruiter Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jobs List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {job.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{job.company}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {job.employmentType}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Tag className="h-4 w-4 mr-2" />
                    {typeof job.salary === 'object' && job.salary !== null
  ? `${job.salary.currency || ''}${job.salary.min || ''} - ${job.salary.currency || ''}${job.salary.max || ''}`
  : job.salary || 'Salary not specified'}
                  </div>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    Posted on {formatDate(job.createdAt)}
                  </div>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <User className="h-4 w-4 mr-2" />
                    {job.applicationsCount || 0} Applications
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleViewJobDetails(job._id)}
                    className="flex-1 flex justify-center items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </button>
                  
                  <button
                    onClick={() => handleEditJob(job._id)}
                    className="flex-1 flex justify-center items-center px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="flex-1 flex justify-center items-center px-3 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No jobs posted by this recruiter yet</p>
        </div>
      )}
    </div>
  );
};

export default RecruiterJobsView;