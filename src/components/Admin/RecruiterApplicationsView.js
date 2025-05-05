import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, User, Calendar, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const RecruiterApplicationsView = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [recruiter, setRecruiter] = useState(null);
  const navigate = useNavigate();
  const { recruiterId } = useParams();

  useEffect(() => {
    if (recruiterId) {
      fetchRecruiterApplications();
    }
  }, [recruiterId]);

  const fetchRecruiterApplications = async () => {
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

      // Then get applications for jobs posted by this recruiter
      const applicationsResponse = await axios.get(`https://auriter-backen.onrender.com/api/admin/recruiters/${recruiterId}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (applicationsResponse.data.success) {
        setApplications(applicationsResponse.data.applications);
      }
    } catch (error) {
      console.error('Error fetching recruiter applications:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        Cookies.remove('admintoken');
        Cookies.remove('adminUser');
        navigate('/admin/login');
        return;
      }
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'reviewing':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'interview':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'interview':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const viewApplicationDetail = (applicationId) => {
    navigate(`/admin/applications/${applicationId}`);
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
          Applications for {recruiter?.name || 'Recruiter'}
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
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/admin/recruiter/${recruiterId}/jobs`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Jobs
              </button>
              <button
                onClick={() => navigate(`/admin/recruiters`)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applications List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : applications.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Job</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Applied On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {applications.map((application) => (
                <tr key={application._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => viewApplicationDetail(application._id)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{application.applicant?.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{application.applicant?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{application.job?.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{application.job?.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(application.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1 capitalize">{application.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        viewApplicationDetail(application._id);
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No applications found for this recruiter's jobs</p>
        </div>
      )}
    </div>
  );
};

export default RecruiterApplicationsView;