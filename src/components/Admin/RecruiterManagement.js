import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Pencil, Trash2, Eye, X, Mail, LogIn } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import RecruiterDetailView from './RecruiterDetailView';

const RecruiterManagement = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRecruiter, setCurrentRecruiter] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const navigate = useNavigate();
  const [impersonating, setImpersonating] = useState(false);

  // New filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    industry: '',
    dateJoined: ''
  });
  const [availableIndustries, setAvailableIndustries] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: {
      name: '',
      position: '',
      website: ''
    }
  });

  // Fetch recruiters on component mount
  useEffect(() => {
    fetchRecruiters();
  }, []);
  
  // Extract unique industries for filter options
  useEffect(() => {
    if (recruiters.length > 0) {
      const industries = [...new Set(
        recruiters
          .filter(r => r.company?.industry)
          .map(r => r.company.industry)
      )];
      setAvailableIndustries(industries);
    }
  }, [recruiters]);

  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      // Get token from cookies instead of localStorage
      const token = Cookies.get('admintoken');
      
      if (!token) {
        // Redirect to login if no token
        toast.error('Authentication required');
        navigate('/admin/login');
        return;
      }

      const response = await axios.get('https://auriter-backen.onrender.com/api/admin/recruiters', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setRecruiters(response.data.recruiters);
      } else {
        toast.error('Failed to fetch recruiters');
      }
    } catch (error) {
      console.error('Error fetching recruiters:', error);
      // Handle unauthorized access
      if (error.response?.status === 401 || error.response?.status === 403) {
        Cookies.remove('admintoken');
        Cookies.remove('adminUser');
        navigate('/admin/login');
        return;
      }
      toast.error(error.response?.data?.message || 'Error fetching recruiters');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLoginAsUser = async (userId) => {
    try {
      setImpersonating(true);
      const adminToken = Cookies.get('admintoken');
      
      console.log("Before impersonation - existing token:", Cookies.get('usertoken'));
      
      const response = await axios.post(
        `https://auriter-backen.onrender.com/api/admin/users/${userId}/impersonate`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      
      if (response.data.success) {
        const token = response.data.token;
        const userData = response.data.user;
        
        
        // Remove existing cookies with various configurations to ensure clean state
        Cookies.remove('token');
        Cookies.remove('token', { path: '/' });
        Cookies.remove('user');
        Cookies.remove('user', { path: '/' });
        
        // Set cookies with various options to ensure compatibility
        Cookies.set('usertoken', token, { 
          path: '/',
          sameSite: 'lax',  // Try 'lax' instead of 'strict'
          expires: 1        // 1 day
        });
        
        Cookies.set('user', JSON.stringify(userData), { 
          path: '/',
          sameSite: 'lax',
          expires: 1
        });
        
        // Double-check cookie was set
        console.log("After setting - token cookie:", Cookies.get('token1'));
        console.log("After setting - user cookie:", Cookies.get('user'));
        
        // Open a new window with special handling
        const newWindow = window.open('/dashboard', '_blank');      
        
        toast.success(`Successfully logged in as ${userData.name}`);
      }
    } catch (error) {
      console.error('Error during user impersonation:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to login as user');
    } finally {
      setImpersonating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('admintoken');
      
      if (!token) {
        toast.error('Authentication required');
        navigate('/admin/login');
        return;
      }
      
      let response;
      
      if (editMode) {
        // Update existing recruiter
        response = await axios.put(
          `https://auriter-backen.onrender.com/api/admin/recruiters/${currentRecruiter._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Recruiter updated successfully');
      } else {
        // Create new recruiter
        response = await axios.post(
          'https://auriter-backen.onrender.com/api/admin/recruiters',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Recruiter added successfully');
      }
      
      if (response.data.success) {
        fetchRecruiters();
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting recruiter:', error);
      // Handle unauthorized access
      if (error.response?.status === 401 || error.response?.status === 403) {
        Cookies.remove('admintoken');
        Cookies.remove('adminUser');
        navigate('/admin/login');
        return;
      }
      toast.error(error.response?.data?.message || 'Error processing request');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recruiter?')) {
      try {
        const token = Cookies.get('admintoken');
        
        if (!token) {
          toast.error('Authentication required');
          navigate('/admin/login');
          return;
        }
        
        const response = await axios.delete(`https://auriter-backen.onrender.com/api/admin/recruiters/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          toast.success('Recruiter deleted successfully');
          fetchRecruiters();
        }
      } catch (error) {
        console.error('Error deleting recruiter:', error);
        // Handle unauthorized access
        if (error.response?.status === 401 || error.response?.status === 403) {
          Cookies.remove('admintoken');
          Cookies.remove('adminUser');
          navigate('/admin/login');
          return;
        }
        toast.error(error.response?.data?.message || 'Error deleting recruiter');
      }
    }
  };

  const handleEdit = (recruiter) => {
    setEditMode(true);
    setCurrentRecruiter(recruiter);
    setFormData({
      name: recruiter.name,
      email: recruiter.email,
      password: '', // Password field will be empty during edit
      company: {
        name: recruiter.company?.name || '',
        position: recruiter.company?.position || '',
        website: recruiter.company?.website || ''
      }
    });
    setShowModal(true);
  };

  const handleViewDetails = (recruiter) => {
    setCurrentRecruiter(recruiter);
    setShowDetailView(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      company: {
        name: '',
        position: '',
        website: ''
      }
    });
    setEditMode(false);
    setCurrentRecruiter(null);
    setShowModal(false);
  };

 


  // Filter logic
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    // Create a list of active filters for display
    const newActiveFilters = [];
    if (filters.status) {
      newActiveFilters.push({
        type: 'status',
        value: filters.status === 'active' ? 'Active' : 'Inactive',
        label: 'Status'
      });
    }
    if (filters.industry) {
      newActiveFilters.push({
        type: 'industry',
        value: filters.industry,
        label: 'Industry'
      });
    }
    if (filters.dateJoined) {
      const dateOptions = {
        last7days: 'Last 7 days',
        last30days: 'Last 30 days',
        last90days: 'Last 90 days'
      };
      newActiveFilters.push({
        type: 'dateJoined',
        value: dateOptions[filters.dateJoined],
        label: 'Date Joined'
      });
    }
    
    setActiveFilters(newActiveFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      industry: '',
      dateJoined: ''
    });
    setActiveFilters([]);
  };

  const removeFilter = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: ''
    }));
    
    setActiveFilters(prev => prev.filter(filter => filter.type !== filterType));
  };

  // Apply filtering to recruiters
  const filterRecruiters = (recruiters) => {
    return recruiters.filter(recruiter => {
      // Filter by status
      if (filters.status && filters.status === 'active' && !recruiter.isActive) {
        return false;
      }
      if (filters.status && filters.status === 'inactive' && recruiter.isActive) {
        return false;
      }
      
      // Filter by industry
      if (filters.industry && recruiter.company?.industry !== filters.industry) {
        return false;
      }
      
      // Filter by date joined
      if (filters.dateJoined) {
        const createdAt = new Date(recruiter.createdAt);
        const now = new Date();
        
        if (filters.dateJoined === 'last7days') {
          const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
          if (createdAt < sevenDaysAgo) return false;
        } else if (filters.dateJoined === 'last30days') {
          const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
          if (createdAt < thirtyDaysAgo) return false;
        } else if (filters.dateJoined === 'last90days') {
          const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
          if (createdAt < ninetyDaysAgo) return false;
        }
      }
      
      return true;
    });
  };

  // Apply search and filters together
  const filteredRecruiters = filterRecruiters(
    recruiters.filter(recruiter => 
      recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Function to get default logo if company logo is not available
  const getDefaultLogo = (companyName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random&color=fff&size=64`;
  };

  return (
    <div className="max-w-full px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruiter Management</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Recruiter
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search recruiters..."
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

      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((filter, index) => (
            <div 
              key={index} 
              className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
            >
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

      {/* Filter panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Industry
              </label>
              <select
                name="industry"
                value={filters.industry}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Industries</option>
                {availableIndustries.map((industry, index) => (
                  <option key={index} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Joined
              </label>
              <select
                name="dateJoined"
                value={filters.dateJoined}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Time</option>
                <option value="last7days">Last 7 days</option>
                <option value="last30days">Last 30 days</option>
                <option value="last90days">Last 90 days</option>
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

      {/* Recruiters Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden w-full">
        {loading ? (
          <div className="p-6 text-center">Loading recruiters...</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">S.No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Position</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Website</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRecruiters.length > 0 ? (
                  filteredRecruiters.map((recruiter, index) => (
                    <tr key={recruiter._id}>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{recruiter.name}</td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{recruiter.company?.name || '-'}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{recruiter.company?.position || '-'}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {recruiter.company?.website ? (
                          <a 
                            href={recruiter.company.website} 
                            target="_blank" 
                            rel="noreferrer"
                            className="block w-10 h-10 rounded-md overflow-hidden"
                          >
                            <img 
                              src={recruiter.company.logo || getDefaultLogo(recruiter.company.name)}
                              alt={`${recruiter.company.name} logo`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = getDefaultLogo(recruiter.company.name);
                              }}
                            />
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          recruiter.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {recruiter.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEdit(recruiter)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(recruiter._id)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                          <button 
                            onClick={() => handleViewDetails(recruiter)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </button>
                          <button 
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-blue-600"
                            onClick={() => handleLoginAsUser(recruiter._id)}
                            title="Login as User"
                            disabled={impersonating}
                          >
                            <LogIn className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No recruiters found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Recruiter Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editMode ? 'Edit Recruiter' : 'Add New Recruiter'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              {!editMode && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input 
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required={!editMode}
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <input 
                  type="text"
                  name="company.name"
                  value={formData.company.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position
                </label>
                <input 
                  type="text"
                  name="company.position"
                  value={formData.company.position}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Website
                </label>
                <input 
                  type="url"
                  name="company.website"
                  value={formData.company.website}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {editMode ? 'Update Recruiter' : 'Add Recruiter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recruiter Detail View */}
      {showDetailView && currentRecruiter && (
        <RecruiterDetailView 
          recruiter={currentRecruiter} 
          onClose={() => setShowDetailView(false)} 
          onEdit={() => {
            setShowDetailView(false);
            handleEdit(currentRecruiter);
          }}
          onDelete={() => {
            setShowDetailView(false);
            handleDelete(currentRecruiter._id);
          }}
        />
      )}
    </div>
  );
};

export default RecruiterManagement;