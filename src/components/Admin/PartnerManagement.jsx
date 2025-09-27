import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Pencil, Trash2, Eye, X, UserCheck, ChevronDown, Briefcase, Lock } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import ConvertToPartnerModal from './ConvertToPartnerModal';

const PartnerManagement = () => {
  const [partners, setPartners] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [partnerStats, setPartnerStats] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    verified: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPartners();
    fetchRecruiters();
  }, []);

  useEffect(() => {
    partners.forEach(partner => {
      fetchPartnerStats(partner._id);
    });
  }, [partners]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('admintoken');
      const response = await axios.get('https://test.airuter.com/api/partner/partners', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPartners(response.data.partners);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecruiters = async () => {
    try {
      const token = Cookies.get('admintoken');
      const response = await axios.get('https://test.airuter.com/api/admin/recruiters', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecruiters(response.data.recruiters);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchPartnerStats = async (partnerId) => {
    try {
      const token = Cookies.get('admintoken');
      const response = await axios.get(
        `https://test.airuter.com/api/partner/job-access/${partnerId}/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPartnerStats(prev => ({
        ...prev,
        [partnerId]: response.data.data
      }));
    } catch (error) {
      console.error('Error fetching partner stats:', error);
    }
  };

  const handleApiError = (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      Cookies.remove('admintoken');
      navigate('/admin/login');
      toast.error('Session expired. Please login again.');
    } else {
      toast.error(error.response?.data?.message || 'Error fetching data');
    }
  };

  const handleRowClick = (partner) => {
    // Navigate to partner details page instead of showing modal
    navigate(`/admin/partners/${partner._id}`);
  };

  const handleSubmitConversion = async (formData) => {
    try {
      const token = Cookies.get('admintoken');
      const recruiter = recruiters.find(r => r._id === formData.recruiterId);
      
      const payload = {
        partnerName: recruiter?.adminProfile?.companyName || recruiter?.name || formData.adminContactPerson,
        category: formData.category,
        categoryDescription: formData.categoryDescription,
        adminContactPerson: formData.adminContactPerson,
        contactNumber: formData.contactNumber,
        email: formData.email,
        gstNumber: formData.gstNumber,
        panNumber: formData.panNumber,
        website: recruiter?.adminProfile?.website || recruiter?.company?.website || '',
        establishedYear: formData.establishedYear,
        description: formData.description,
        location: formData.location,
        coursesOffered: formData.coursesOffered,
        reason: formData.reason
      };

      const response = await axios.post(
        `https://test.airuter.com/api/partner/recruiters/${formData.recruiterId}/convert-to-partner`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Recruiter converted to partner successfully');
      fetchPartners();
      fetchRecruiters();
      setShowConvertModal(false);
      setSelectedRecruiter(null);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleUpdateStatus = async (partnerId, status, event) => {
    event.stopPropagation(); // Prevent row click
    try {
      const token = Cookies.get('admintoken');
      await axios.put(
        `https://test.airuter.com/api/partner/partners/${partnerId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Partner ${status ? 'activated' : 'deactivated'}`);
      fetchPartners();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDelete = async (partnerId, event) => {
    if (event) event.stopPropagation(); // Prevent row click
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        const token = Cookies.get('admintoken');
        await axios.delete(`https://test.airuter.com/api/partner/partners/${partnerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Partner deleted successfully');
        fetchPartners();
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const handleOpenPrivateJobs = (partner, event) => {
    event.stopPropagation(); // Prevent row click
    navigate(`/admin/partners/${partner._id}/private-jobs`);
  };

  const applyFilters = () => {
    const newActiveFilters = [];
    if (filters.status) {
      newActiveFilters.push({
        type: 'status',
        value: filters.status === 'active' ? 'Active' : 'Inactive',
        label: 'Status'
      });
    }
    if (filters.category) {
      newActiveFilters.push({
        type: 'category',
        value: filters.category,
        label: 'Category'
      });
    }
    if (filters.verified) {
      newActiveFilters.push({
        type: 'verified',
        value: filters.verified === 'verified' ? 'Verified' : 'Unverified',
        label: 'Verification'
      });
    }
    setActiveFilters(newActiveFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({ status: '', category: '', verified: '' });
    setActiveFilters([]);
  };

  const removeFilter = (filterType) => {
    setFilters(prev => ({ ...prev, [filterType]: '' }));
    setActiveFilters(prev => prev.filter(f => f.type !== filterType));
  };

  const filteredPartners = partners.filter(partner => {
    if (searchTerm && !partner.partnerName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.status && partner.isActive !== (filters.status === 'active')) {
      return false;
    }
    if (filters.category && partner.category !== filters.category) {
      return false;
    }
    if (filters.verified && partner.isVerified !== (filters.verified === 'verified')) {
      return false;
    }
    return true;
  });

  const getCategoryColor = (category) => {
    const colors = {
      'Training Institute': 'bg-blue-100 text-blue-800',
      'Placement Consultancy': 'bg-purple-100 text-purple-800',
      'College / University': 'bg-green-100 text-green-800',
      'NGO / Non-Profit': 'bg-red-100 text-red-800',
      'School': 'bg-yellow-100 text-yellow-800',
      'Government Organization': 'bg-indigo-100 text-indigo-800',
      'Others': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-full px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Partner Management</h1>
        <div className="flex gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowConvertModal(true)}
              className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Add Partner
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center px-4 py-2 border ${showFilters ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800' : 'border-gray-300 dark:border-gray-600'} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700`}
        >
          <Filter className={`h-4 w-4 mr-2 ${showFilters ? 'text-red-500' : ''}`} />
          Filter {activeFilters.length > 0 && `(${activeFilters.length})`}
        </button>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((filter, index) => (
            <div key={index} className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
              <span className="text-gray-500 dark:text-gray-400 mr-1">{filter.label}:</span>
              <span className="text-gray-800 dark:text-gray-200">{filter.value}</span>
              <button 
                onClick={() => removeFilter(filter.type)}
                className="ml-2 text-gray-500 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button 
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            Clear all
          </button>
        </div>
      )}

      {showFilters && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                <option value="Training Institute">Training Institute</option>
                <option value="Placement Consultancy">Placement Consultancy</option>
                <option value="College / University">College / University</option>
                <option value="NGO / Non-Profit">NGO / Non-Profit</option>
                <option value="School">School</option>
                <option value="Government Organization">Government Organization</option>
                <option value="Others">Others</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verification</label>
              <select
                name="verified"
                value={filters.verified}
                onChange={(e) => setFilters({...filters, verified: e.target.value})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Clear
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden w-full">
        {loading ? (
          <div className="p-6 text-center">Loading partners...</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">S.No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Partner Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Candidates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Job Access</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPartners.length > 0 ? (
                  filteredPartners.map((partner, index) => {
                    const stats = partnerStats[partner._id] || {};
                    return (
                      <tr 
                        key={partner._id}
                        onClick={() => handleRowClick(partner)}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            {partner.partnerName}
                            {partner.isVerified && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Verified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(partner.category)}`}>
                            {partner.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div>{partner.adminContactPerson}</div>
                          <div className="text-gray-400 text-xs">{partner.contactNumber}</div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {partner.location?.city}, {partner.location?.state}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <span className="text-lg font-semibold text-blue-600">
                              {stats.candidateCount || 0}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">candidates</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => handleOpenPrivateJobs(partner, e)}
                              className="flex items-center gap-1 px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-xs font-medium transition-colors"
                              title="Manage Private Job Access"
                            >
                              <Lock className="h-3 w-3" />
                              <Briefcase className="h-3 w-3" />
                              {stats.assignedJobsCount || 0}/{stats.totalPrivateJobsCount || 0}
                            </button>
                            {stats.assignedJobsCount > 0 && (
                              <span className="text-xs text-green-600 font-medium">
                                {stats.accessPercentage || 0}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            partner.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {partner.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => handleUpdateStatus(partner._id, !partner.isActive, e)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              title={partner.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {partner.isActive ? (
                                <span className="text-yellow-600">Deactivate</span>
                              ) : (
                                <span className="text-green-600">Activate</span>
                              )}
                            </button>
                            <button 
                              onClick={(e) => handleDelete(partner._id, e)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No partners found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    

      {showConvertModal && (
        <ConvertToPartnerModal
          recruiters={recruiters}
          onClose={() => setShowConvertModal(false)}
          onSubmit={handleSubmitConversion}
          selectedRecruiter={selectedRecruiter}
        />
      )}
    </div>
  );
};

export default PartnerManagement;