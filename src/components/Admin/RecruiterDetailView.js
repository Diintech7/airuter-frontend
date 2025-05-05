import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, ChevronRight, Mail, Globe, Briefcase, Calendar, Clock, Users } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RecruiterDetailView = ({ recruiter, onClose, onEdit, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalHired: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (recruiter && recruiter._id) {
      fetchRecruiterDetails();
    }
  }, [recruiter]);

  const fetchRecruiterDetails = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('admintoken');
      
      if (!token) {
        toast.error('Authentication required');
        navigate('/admin/login');
        return;
      }

      // Updated API endpoint to match the backend route definition
      const response = await axios.get(`https://auriter-backen.onrender.com/api/admin/recruiters/${recruiter._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Use actual data from the response
        setStats({
          totalJobs: response.data.stats?.totalJobs || 0,
          activeJobs: response.data.stats?.activeJobs || 0,
          totalApplications: response.data.stats?.totalApplications || 0,
          totalHired: response.data.stats?.totalHired || 0
        });
        
        // Set recent jobs from response
        if (response.data.recentJobs) {
          setRecentJobs(response.data.recentJobs);
        }
      }
    } catch (error) {
      console.error('Error fetching recruiter details:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        Cookies.remove('admintoken');
        Cookies.remove('adminUser');
        navigate('/admin/login');
        return;
      }
      toast.error('Failed to load recruiter details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusUpdate = async () => {
    try {
      const token = Cookies.get('admintoken');
      if (!token) {
        toast.error('Authentication required');
        navigate('/admin/login');
        return;
      }
      
      const newStatus = !recruiter.isActive;
      // Updated to match the backend route definition (using status key instead of isActive)
      const response = await axios.put(
        `https://auriter-backen.onrender.com/api/admin/recruiters/${recruiter._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(`Recruiter account ${newStatus ? 'activated' : 'deactivated'}`);
        onClose();
      }
    } catch (error) {
      console.error('Error updating recruiter status:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        Cookies.remove('admintoken');
        Cookies.remove('adminUser');
        navigate('/admin/login');
        return;
      }
      toast.error(error.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recruiter Details</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Info Column */}
              <div className="md:col-span-2 space-y-6">
                {/* Basic Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{recruiter.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {recruiter.company?.position || 'No position'} at {recruiter.company?.name || 'No company'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={onEdit}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={onDelete}
                        className="p-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{recruiter.email}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{recruiter.company?.name || 'No company information'}</span>
                    </div>
                    
                    {recruiter.company?.website && (
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                        <a 
                          href={recruiter.company.website} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-blue-600 hover:underline"
                        >
                          {recruiter.company.website}
                        </a>
                      </div>
                    )}
                    
                    {recruiter.createdAt && (
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                        <span className="text-gray-700 dark:text-gray-300">Joined on {formatDate(recruiter.createdAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Recent Jobs */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Job Postings</h3>
                  
                  {recentJobs.length > 0 ? (
                    <div className="space-y-4">
                      {recentJobs.map(job => (
                        <div key={job._id} className="border-l-2 border-gray-300 dark:border-gray-600 pl-4 py-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white">{job.title}</p>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Status: <span className={`${job.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                                  {job.status}
                                </span>
                              </p>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(job.createdAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No jobs posted yet</p>
                  )}
                </div>
              </div>
              
              {/* Stats Column */}
              <div className="space-y-6">
                {/* Recruiter Stats */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Statistics</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Jobs Posted</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalJobs}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Active Jobs</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeJobs}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Applications</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalApplications}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Candidates Hired</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalHired}</p>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
                  
                  <div className="space-y-2">
                    <button 
                      className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                      onClick={() => {
                        navigate(`/admin/recruiter/${recruiter._id}/jobs`);
                      }}
                    >
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-3" />
                        <span className="text-gray-700 dark:text-gray-200">View All Jobs</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                      onClick={() => {
                        navigate(`/admin/recruiter/${recruiter._id}/applications`);
                      }}
                    >
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-3" />
                        <span className="text-gray-700 dark:text-gray-200">View Applications</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* Account Status */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Account Status</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">Account is {recruiter.isActive ? 'active' : 'inactive'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {recruiter.isActive ? 'Can access all features' : 'Account is disabled'}
                      </p>
                    </div>
                    
                    <button 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        recruiter.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                      onClick={handleStatusUpdate}
                    >
                      {recruiter.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDetailView;