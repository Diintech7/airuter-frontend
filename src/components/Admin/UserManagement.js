import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Pencil, Trash2, Check, X, Briefcase, FileText, LogIn } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: '',
    applicationRange: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [impersonating, setImpersonating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('admintoken');
      if (!token) {
        toast.error('Authentication required');
        navigate('/admin/login');
        return;
      }
      const response = await axios.get('https://auriter-backen.onrender.com/api/admin/users?role=jobSeeker', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.data.success) {
        throw new Error('Failed to fetch users');
      }
      const usersWithJobData = await Promise.all(response.data.users.map(async (user) => {
        try {
          const jobResponse = await axios.get(`https://auriter-backen.onrender.com/api/admin/users/${user._id}/applications`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.isActive ? 'Active' : 'Suspended',
            totalApplications: jobResponse.data.totalApplications || 0,
            activeApplications: jobResponse.data.activeApplications || 0,
            createdAt: user.createdAt
          };
        } catch (err) {
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.isActive ? 'Active' : 'Suspended',
            totalApplications: 0,
            activeApplications: 0,
            createdAt: user.createdAt
          };
        }
      }));
      setUsers(usersWithJobData);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        Cookies.remove('admintoken');
        navigate('/admin/login');
        return;
      }
      toast.error(error.response?.data?.message || 'Error fetching users');
    } finally {
      setLoading(false);
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
  
  const applyFiltersAndSearch = (userList) => {
    // Your existing implementation
    let filteredUsers = [...userList];
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.status) {
      filteredUsers = filteredUsers.filter(user => {
        if (filters.status === 'active') return user.status === 'Active';
        if (filters.status === 'suspended') return user.status === 'Suspended';
        return true;
      });
    }
    if (filters.applicationRange) {
      filteredUsers = filteredUsers.filter(user => {
        switch (filters.applicationRange) {
          case 'none':
            return user.totalApplications === 0;
          case 'low':
            return user.totalApplications > 0 && user.totalApplications <= 5;
          case 'medium':
            return user.totalApplications > 5 && user.totalApplications <= 15;
          case 'high':
            return user.totalApplications > 15;
          default:
            return true;
        }
      });
    }
    filteredUsers.sort((a, b) => {
      let compareValue = 0;
      switch (filters.sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'applications':
          compareValue = a.totalApplications - b.totalApplications;
          break;
        case 'createdAt':
        default:
          compareValue = new Date(a.createdAt) - new Date(b.createdAt);
          break;
      }
      return filters.sortOrder === 'asc' ? compareValue : -compareValue;
    });
    return filteredUsers;
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const isActive = currentStatus === 'Active' ? false : true;
      const token = Cookies.get('admintoken');
      const response = await axios.patch(
        `https://auriter-backen.onrender.com/api/admin/users/${userId}/status`,
        { isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: isActive ? 'Active' : 'Suspended' } : user
        ));
        toast.success(`User ${isActive ? 'activated' : 'suspended'} successfully`);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        Cookies.remove('admintoken');
        navigate('/admin/login');
        return;
      }
      toast.error(error.response?.data?.message || 'Error updating user status');
    }
  };

  const viewUserResume = async (userId) => {
    try {
      const token = Cookies.get('admintoken');
      
      const response = await axios.get(`https://auriter-backen.onrender.com/api/admin/users/${userId}/resume`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Resume not found');
      }
      const profile = response.data.profile;
      if (profile && profile.resumePath) {
        if (profile.resumePath.startsWith('/uploads/')) {
          window.open(`https://auriter-backen.onrender.com${profile.resumePath}`, '_blank');
        } else if (profile.resumePath.startsWith('http')) {
          window.open(profile.resumePath, '_blank');
        } else {
          toast.info('Resume content available but not in previewable format');
        }
      } else {
        throw new Error('Resume path not found');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching resume');
    }
  };

  const handleEditUser = (user) => {
    setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowEditUserModal(true);
  };

  const handleDeleteUser = (user) => {
    setCurrentUser({
      id: user.id,
      name: user.name
    });
    setShowDeleteConfirmModal(true);
  };

  const filteredUsers = applyFiltersAndSearch(users);
  
  return (
    <div className="max-w-full px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden w-full">
        {loading ? (
          <div className="p-6 text-center">Loading Users...</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Applications</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{user.totalApplications} total ({user.activeApplications} active)</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-green-600"
                            onClick={() => viewUserResume(user.id)}
                            title="View Resume"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          
                          {/* Login as User Button */}
                          <button 
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-blue-600"
                            onClick={() => handleLoginAsUser(user.id)}
                            title="Login as User"
                            disabled={impersonating}
                          >
                            <LogIn className="h-4 w-4" />
                          </button>
                          
                          {user.status === 'Active' ? (
                            <button 
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              onClick={() => handleToggleUserStatus(user.id, user.status)}
                              title="Suspend User"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </button>
                          ) : (
                            <button 
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              onClick={() => handleToggleUserStatus(user.id, user.status)}
                              title="Activate User"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </button>
                          )}
                          <button 
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            onClick={() => handleEditUser(user)}
                            title="Edit User"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            onClick={() => handleDeleteUser(user)}
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No Users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;