import React, { useState, useEffect } from 'react';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { 
  CheckCircle, 
  XCircle, 
  User, 
  Clock, 
  Mail, 
  Phone, 
  Briefcase, 
  FileText, 
  AlertCircle, 
  Loader 
} from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AdminApprovals = () => {
  const { styles, colors } = useThemeStyles();
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  const fetchPendingAdmins = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('admintoken');
      const response = await axios.get('https://auriter-backen.onrender.com/api/admin/pending', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true // Important for cookies
      });
      setPendingAdmins(response.data.admins);
      setError(null);
    } catch (err) {
      console.error('Error fetching pending admins:', err);
      setError('Failed to fetch pending admin requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (adminId, status) => {
    try {
      setActionLoading(true);
      // Fixed: Use admintoken instead of token
      const token = Cookies.get('admintoken');
      
      const data = {
        status,
        ...(status === 'rejected' && { rejectionReason })
      };

      await axios.patch(`https://auriter-backen.onrender.com/api/admin/approve/${adminId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true // Important for cookies
      });

      // Show success message
      setSuccessMessage(`Admin ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds

      setPendingAdmins(pendingAdmins.filter(admin => admin._id !== adminId));
      setSelectedAdmin(null);
      setRejectionReason('');
    } catch (err) {
      console.error('Error processing admin request:', err);
      setError('Failed to process admin request');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${styles.pageContainer} flex items-center justify-center h-64`}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
          <p className={`mt-4 ${colors.text} font-medium`}>Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.pageContainer}`}>
        <div className={`p-6 rounded-lg ${colors.bgCard} border-l-4 border-red-500 shadow-md`}>
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">Error Occurred</h3>
              <p className={`${colors.text}`}>{error}</p>
              <button 
                onClick={fetchPendingAdmins} 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.pageContainer}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Registration Approvals</h1>
        <button 
          onClick={fetchPendingAdmins}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-lg bg-green-100 border-l-4 border-green-500 text-green-700 flex items-center shadow-md transition-opacity duration-300">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {pendingAdmins.length === 0 ? (
        <div className={`text-center py-16 ${colors.bgCard} rounded-lg shadow-md border border-gray-100 dark:border-gray-700`}>
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <p className={`${colors.text} text-xl font-medium mb-2`}>No pending admin registrations</p>
          <p className={`${colors.textMuted}`}>All admin registration requests have been processed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingAdmins.map((admin) => (
            <div key={admin._id} className={`p-6 rounded-lg ${colors.bgCard} shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200`}>
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${colors.bgSection} text-red-600`}>
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {admin.firstName} {admin.lastName}
                    </h3>
                    <p className={`${colors.textMuted} text-sm`}>@{admin.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  <Clock className={`h-4 w-4 ${colors.textMuted}`} />
                  <span className={`${colors.textMuted} text-sm`}>
                    {new Date(admin.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg ${colors.bgSection}`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Mail className={`h-5 w-5 text-blue-500`} />
                    <span className="font-medium">Email</span>
                  </div>
                  <p className={colors.text}>{admin.email}</p>
                </div>
                <div className={`p-4 rounded-lg ${colors.bgSection}`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Phone className={`h-5 w-5 text-green-500`} />
                    <span className="font-medium">Phone Number</span>
                  </div>
                  <p className={colors.text}>{admin.phoneNumber}</p>
                </div>
                <div className={`p-4 rounded-lg ${colors.bgSection}`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Briefcase className={`h-5 w-5 text-purple-500`} />
                    <span className="font-medium">Department</span>
                  </div>
                  <p className={colors.text}>{admin.department}</p>
                </div>
              </div>

              <div className={`mt-6 p-4 rounded-lg ${colors.bgSection}`}>
                <div className="flex items-start space-x-2 mb-3">
                  <FileText className={`h-5 w-5 text-orange-500 mt-1`} />
                  <span className="font-medium">Reason for Access</span>
                </div>
                <p className={colors.text}>{admin.reason}</p>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedAdmin(admin)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-sm flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Review Request</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Backdrop */}
      {selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          {/* Modal Content */}
          <div className={`${colors.bgCard} rounded-lg max-w-2xl w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <User className="h-6 w-6 mr-2 text-blue-600" />
                Review Admin Registration
              </h2>
              <button 
                onClick={() => {
                  setSelectedAdmin(null);
                  setRejectionReason('');
                }}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                disabled={actionLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 mb-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <h3 className="text-lg font-semibold mb-2">
                {selectedAdmin.firstName} {selectedAdmin.lastName}
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">@{selectedAdmin.username}</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-medium mb-2">Email:</p>
                  <p className={`${colors.textMuted} p-2 rounded bg-gray-50 dark:bg-gray-800`}>{selectedAdmin.email}</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Username:</p>
                  <p className={`${colors.textMuted} p-2 rounded bg-gray-50 dark:bg-gray-800`}>{selectedAdmin.username}</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Department:</p>
                  <p className={`${colors.textMuted} p-2 rounded bg-gray-50 dark:bg-gray-800`}>{selectedAdmin.department}</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Phone Number:</p>
                  <p className={`${colors.textMuted} p-2 rounded bg-gray-50 dark:bg-gray-800`}>{selectedAdmin.phoneNumber}</p>
                </div>
              </div>
              
              <div>
                <p className="font-medium mb-2">Reason for Access:</p>
                <p className={`${colors.textMuted} p-3 rounded bg-gray-50 dark:bg-gray-800`}>{selectedAdmin.reason}</p>
              </div>
              
              <div>
                <label className="block font-medium mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                  <span className="text-sm font-normal ml-2 text-gray-500">(required if rejecting)</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter detailed reason for rejection..."
                  className={`w-full p-3 border rounded-md ${colors.bgSection} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  rows="3"
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setSelectedAdmin(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleApproval(selectedAdmin._id, 'rejected')}
                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2 transition-colors ${
                  !rejectionReason ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={actionLoading || !rejectionReason}
              >
                {actionLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span>Reject Request</span>
              </button>
              <button
                onClick={() => handleApproval(selectedAdmin._id, 'approved')}
                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 transition-colors ${
                  actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5" />
                )}
                <span>Approve Request</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;