import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../UI/Card';
import { 
  Users, Plus, Search, Edit, Trash2, 
  User, Mail, Phone, Key, X, UserX, UserCheck 
} from 'lucide-react';
import Cookies from 'js-cookie';
import { useTheme } from '../../context/ThemeContext';
import { getThemeClasses } from '../utils/themeUtils';
import { toast } from 'react-toastify';

const PartnerCandidateAccess = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const themeClasses = getThemeClasses(isDark);

  // State management
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, active, inactive
  const [stats, setStats] = useState({});

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    registrationNumber: '',
    gender: '',
    enrolledCourse: {
      courseName: '',
      courseType: '',
      status: 'Enrolled'
    },
    notes: ''
  });

  // Fetch candidates data
  useEffect(() => {
    fetchCandidates();
  }, [searchTerm, statusFilter, activeFilter]);

  const fetchCandidates = async () => {
    try {
      const token = Cookies.get('usertoken');
      const queryParams = new URLSearchParams();
      
      if (searchTerm) queryParams.append('search', searchTerm);
      if (statusFilter) queryParams.append('status', statusFilter);
      if (activeFilter !== 'all') queryParams.append('active', activeFilter === 'active');

      const response = await fetch(`https://test.airuter.com/api/candidates?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCandidates(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  // Form handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('usertoken');
      const url = editingCandidate 
        ? `https://test.airuter.com/api/candidates/${editingCandidate._id}` 
        : 'https://test.airuter.com/api/candidates';
      
      const response = await fetch(url, {
        method: editingCandidate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setShowAddForm(false);
        setEditingCandidate(null);
        resetForm();
        fetchCandidates();
        toast.success(editingCandidate ? 'Candidate updated!' : 'Candidate added!');
      } else {
        toast.error(data.message || 'Error saving candidate');
      }
    } catch (error) {
      console.error('Error saving candidate:', error);
      toast.error('Error saving candidate');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobileNumber: '',
      registrationNumber: '',
      gender: '',
      enrolledCourse: {
        courseName: '',
        courseType: '',
        status: 'Enrolled'
      },
      notes: ''
    });
  };

  // Candidate actions
  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      name: candidate.name,
      email: candidate.email,
      mobileNumber: candidate.mobileNumber,
      registrationNumber: candidate.registrationNumber,
      gender: candidate.gender,
      enrolledCourse: {
        courseName: candidate.enrolledCourse.courseName,
        courseType: candidate.enrolledCourse.courseType,
        status: candidate.enrolledCourse.status
      },
      notes: candidate.notes
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    
    try {
      const token = Cookies.get('usertoken');
      const response = await fetch(`https://test.airuter.com/api/candidates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        fetchCandidates();
        toast.success('Candidate deleted!');
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  const handleToggleStatus = async (candidateId, currentStatus) => {
    const action = currentStatus ? 'disable' : 'enable';
    const confirmMessage = `Are you sure you want to ${action} this candidate?`;
    
    if (!window.confirm(confirmMessage)) return;
    
    try {
      const token = Cookies.get('usertoken');
      const response = await fetch(
        `https://test.airuter.com/api/candidates/${candidateId}/toggle-status`,
        {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ isActive: !currentStatus })
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchCandidates();
        toast.success(`Candidate ${action}d successfully!`);
      } else {
        toast.error(data.message || `Failed to ${action} candidate`);
      }
    } catch (error) {
      console.error(`Error ${action}ing candidate:`, error);
      toast.error(`Error ${action}ing candidate`);
    }
  };

  const handleResendCredentials = async (candidateId) => {
    if (!window.confirm('Resend login credentials to this candidate?')) return;
    
    try {
      const token = Cookies.get('usertoken');
      const response = await fetch(
        `https://test.airuter.com/api/candidates/${candidateId}/resend-credentials`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success('Credentials resent successfully!');
      } else {
        toast.error('Failed to resend credentials');
      }
    } catch (error) {
      console.error('Error resending credentials:', error);
      toast.error('Error resending credentials');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${themeClasses.pageBg} transition-colors duration-300`}>
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${themeClasses.textColor}`}>
            Candidate Management
          </h1>
          <p className={`${themeClasses.subTextColor} mt-2`}>
            Manage your institution's candidates
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className={`flex items-center gap-2 ${themeClasses.primaryButtonBg} text-white px-4 py-2 rounded-lg transition-all duration-200 ${themeClasses.hoverShadow}`}
        >
          <Plus className="h-4 w-4" />
          Add Candidate
        </button>
      </div>

      {/* Search and filter section */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.mutedTextColor} h-4 w-4`} />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.inputText} ${themeClasses.inputPlaceholder} border rounded-lg focus:outline-none focus:ring-2 ${themeClasses.inputFocus} transition-colors duration-200`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`px-4 py-2 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.inputText} border rounded-lg focus:outline-none focus:ring-2 ${themeClasses.inputFocus} transition-colors duration-200`}
        >
          <option value="">All Status</option>
          <option value="Enrolled">Enrolled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Dropped">Dropped</option>
        </select>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className={`px-4 py-2 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.inputText} border rounded-lg focus:outline-none focus:ring-2 ${themeClasses.inputFocus} transition-colors duration-200`}
        >
          <option value="all">All Candidates</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Candidates table */}
      <Card className={`${themeClasses.cardBg} ${themeClasses.shadow} transition-colors duration-300`}>
        <CardContent className="p-0">
          {candidates.length === 0 ? (
            <div className="text-center py-12">
              <Users className={`h-12 w-12 ${themeClasses.mutedTextColor} mx-auto mb-4`} />
              <p className={themeClasses.mutedTextColor}>No candidates found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${themeClasses.sectionBg}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.mutedTextColor} uppercase tracking-wider`}>
                      Candidate
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.mutedTextColor} uppercase tracking-wider`}>
                      Course
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.mutedTextColor} uppercase tracking-wider`}>
                      Status
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.mutedTextColor} uppercase tracking-wider`}>
                      Registration
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.mutedTextColor} uppercase tracking-wider`}>
                      Account Status
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.mutedTextColor} uppercase tracking-wider`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`${themeClasses.cardBg} divide-y ${themeClasses.border}`}>
                  {candidates.map((candidate) => (
                    <tr key={candidate._id} className={`${themeClasses.hoverBg} transition-colors duration-200 ${!candidate.isActive ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className={`h-10 w-10 rounded-full ${candidate.isActive ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center`}>
                              <User className={`h-6 w-6 ${candidate.isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-medium ${themeClasses.textColor}`}>
                              {candidate.name}
                            </div>
                            <div className={`text-sm ${themeClasses.mutedTextColor} flex items-center gap-1`}>
                              <Mail className="h-3 w-3" />
                              {candidate.email}
                            </div>
                            <div className={`text-sm ${themeClasses.mutedTextColor} flex items-center gap-1`}>
                              <Phone className="h-3 w-3" />
                              {candidate.mobileNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${themeClasses.textColor}`}>
                          {candidate.enrolledCourse.courseName}
                        </div>
                        <div className={`text-sm ${themeClasses.mutedTextColor}`}>
                          {candidate.enrolledCourse.courseType}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            candidate.enrolledCourse.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : candidate.enrolledCourse.status === 'In Progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : candidate.enrolledCourse.status === 'Enrolled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {candidate.enrolledCourse.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${themeClasses.textColor}`}>
                        {candidate.registrationNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            candidate.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {candidate.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(candidate)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(candidate._id, candidate.isActive)}
                            className={`transition-colors duration-200 ${
                              candidate.isActive 
                                ? 'text-orange-600 hover:text-orange-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={candidate.isActive ? 'Disable Candidate' : 'Enable Candidate'}
                          >
                            {candidate.isActive ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleResendCredentials(candidate._id)}
                            className="text-purple-600 hover:text-purple-900 transition-colors duration-200"
                            title="Resend Credentials"
                            disabled={!candidate.isActive}
                          >
                            <Key className={`h-4 w-4 ${!candidate.isActive ? 'opacity-50' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleDelete(candidate._id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${themeClasses.cardBg} rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${themeClasses.shadow} transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${themeClasses.textColor}`}>
                {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingCandidate(null);
                  resetForm();
                }}
                className={`${themeClasses.mutedTextColor} ${themeClasses.hoverText} transition-colors duration-200`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${themeClasses.label}`}>Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-3 py-2 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.inputText} ${themeClasses.inputPlaceholder} border rounded-lg focus:outline-none focus:ring-2 ${themeClasses.inputFocus} transition-colors duration-200`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${themeClasses.label}`}>Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full px-3 py-2 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.inputText} ${themeClasses.inputPlaceholder} border rounded-lg focus:outline-none focus:ring-2 ${themeClasses.inputFocus} transition-colors duration-200`}
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${themeClasses.label}`}>Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                    className={`w-full px-3 py-2 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.inputText} ${themeClasses.inputPlaceholder} border rounded-lg focus:outline-none focus:ring-2 ${themeClasses.inputFocus} transition-colors duration-200`}
                  />
                </div>

                {/* Registration Number */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${themeClasses.label}`}>Registration Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                    className={`w-full px-3 py-2 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.inputText} ${themeClasses.inputPlaceholder} border rounded-lg focus:outline-none focus:ring-2 ${themeClasses.inputFocus} transition-colors duration-200`}
                  />
                </div>

                {/* Course Name */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${themeClasses.label}`}>Course Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.enrolledCourse.courseName}
                    onChange={(e) => setFormData({
                      ...formData,
                      enrolledCourse: {
                        ...formData.enrolledCourse,
                        courseName: e.target.value
                      }
                    })}
                    className={`w-full px-3 py-2 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.inputText} ${themeClasses.inputPlaceholder} border rounded-lg focus:outline-none focus:ring-2 ${themeClasses.inputFocus} transition-colors duration-200`}
                  />
                </div>

                {/* Course Type */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${themeClasses.label}`}>Course Type</label>
                  <input
                    type="text"
                    value={formData.enrolledCourse.courseType}
                    onChange={(e) => setFormData({
                      ...formData,
                      enrolledCourse: {
                        ...formData.enrolledCourse,
                        courseType: e.target.value
                      }
                    })}
                    className={`w-full px-3 py-2 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.inputText} ${themeClasses.inputPlaceholder} border rounded-lg focus:outline-none focus:ring-2 ${themeClasses.inputFocus} transition-colors duration-200`}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${themeClasses.label}`}>Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className={`w-full px-3 py-2 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.inputText} border rounded-lg focus:outline-none focus:ring-2 ${themeClasses.inputFocus} transition-colors duration-200`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${themeClasses.label}`}>Status</label>
                  <select
                    value={formData.enrolledCourse.status}
                    onChange={(e) => setFormData({
                      ...formData,
                      enrolledCourse: {
                        ...formData.enrolledCourse,
                        status: e.target.value
                      }
                    })}
                    className={`w-full px-3 py-2 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.inputText} border rounded-lg focus:outline-none focus:ring-2 ${themeClasses.inputFocus} transition-colors duration-200`}
                  >
                    <option value="Enrolled">Enrolled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${themeClasses.label}`}>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="3"
                  className={`w-full px-3 py-2 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.inputText} ${themeClasses.inputPlaceholder} border rounded-lg focus:outline-none focus:ring-2 ${themeClasses.inputFocus} transition-colors duration-200`}
                  placeholder="Additional notes about the candidate..."
                />
              </div>

              {/* Form buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCandidate(null);
                    resetForm();
                  }}
                  className={`px-4 py-2 ${themeClasses.secondaryButtonBg} ${themeClasses.secondaryButtonText} border ${themeClasses.secondaryButtonBorder} rounded-lg transition-all duration-200 ${themeClasses.hoverShadow}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${themeClasses.primaryButtonBg} text-white rounded-lg transition-all duration-200 ${themeClasses.hoverShadow}`}
                >
                  {editingCandidate ? 'Update' : 'Add'} Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerCandidateAccess;