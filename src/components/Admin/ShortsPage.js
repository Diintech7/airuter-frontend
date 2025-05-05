// components/admin/Shorts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Edit, Trash2, Eye, ThumbsUp, 
  MessageSquare, Share2, ExternalLink, X, Save, BarChart3
} from 'lucide-react';
import ShortForm from './ShortForm';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import YouTubeThumbnail, { extractYoutubeId } from '../utils/YouTubeThumbnai';
import { useThemeStyles } from '../hooks/useThemeStyles';

const Shorts = () => {
  const { styles, colors, isDark } = useThemeStyles();
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentShort, setCurrentShort] = useState(null);
  const [editingMetrics, setEditingMetrics] = useState({});
  const navigate = useNavigate();

  // Fetch all shorts
  const fetchShorts = async () => {
    try {
      setLoading(true);
      
      // Get authentication token
      const token = Cookies.get('admintoken');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        navigate('/admin/login');
        return;
      }

      // Set up headers with authentication
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const res = await axios.get('https://auriter-backen.onrender.com/api/shorts', {
        headers,
        credentials: 'include'
      });
      
      setShorts(res.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching shorts:', err);
      
      // Handle unauthorized error
      if (err.response?.status === 401 || err.response?.status === 403) {
        Cookies.remove('admintoken');
        Cookies.remove('adminUser');
        setError('Your session has expired. Please log in again.');
        navigate('/admin/login');
      } else {
        setError('Error fetching shorts. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, [navigate]);

  // Start editing a short
  const handleEdit = (short) => {
    setCurrentShort(short);
    setShowForm(true);
  };

  // Delete a short
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Short?')) {
      try {
        // Get authentication token
        const token = Cookies.get('admintoken');
        
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          navigate('/admin/login');
          return;
        }

        // Set up headers with authentication
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        await axios.delete(`https://auriter-backen.onrender.com/api/shorts/${id}`, {
          headers,
          credentials: 'include'
        });
        
        setShorts(shorts.filter(short => short._id !== id));
      } catch (err) {
        console.error('Error deleting short:', err);
        
        // Handle unauthorized error
        if (err.response?.status === 401 || err.response?.status === 403) {
          Cookies.remove('admintoken');
          Cookies.remove('adminUser');
          setError('Your session has expired. Please log in again.');
          navigate('/admin/login');
        } else {
          setError('Error deleting short. Please try again.');
        }
      }
    }
  };

  // Prepare to edit metrics
  const startEditMetrics = (short) => {
    setEditingMetrics({
      id: short._id,
      views: short.metrics.views,
      likes: short.metrics.likes,
      comments: short.metrics.comments,
      shares: short.metrics.shares
    });
  };

  // Cancel metrics editing
  const cancelEditMetrics = () => {
    setEditingMetrics({});
  };

  // Save updated metrics
  const saveMetrics = async (id) => {
    try {
      // Get authentication token
      const token = Cookies.get('admintoken');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        navigate('/admin/login');
        return;
      }

      // Set up headers with authentication
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const res = await axios.patch(`https://auriter-backen.onrender.com/api/shorts/${id}/metrics`, 
        {
          views: parseInt(editingMetrics.views, 10),
          likes: parseInt(editingMetrics.likes, 10),
          comments: parseInt(editingMetrics.comments, 10),
          shares: parseInt(editingMetrics.shares, 10)
        },
        {
          headers,
          credentials: 'include'
        }
      );
      
      setShorts(shorts.map(short => 
        short._id === id ? res.data.data : short
      ));
      
      setEditingMetrics({});
      
    } catch (err) {
      console.error('Error updating metrics:', err);
      
      // Handle unauthorized error
      if (err.response?.status === 401 || err.response?.status === 403) {
        Cookies.remove('admintoken');
        Cookies.remove('adminUser');
        setError('Your session has expired. Please log in again.');
        navigate('/admin/login');
      } else {
        setError('Error updating metrics. Please try again.');
      }
    }
  };

  // Handle metric input change
  const handleMetricChange = (e) => {
    setEditingMetrics({
      ...editingMetrics,
      [e.target.name]: e.target.value
    });
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate('/admin/login');
  };

  return (
    <div className={`${styles.pageContainer} p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-semibold ${colors.textHeading}`}>YouTube Shorts Management</h1>
        <button
          onClick={() => {
            setCurrentShort(null);
            setShowForm(!showForm);
          }}
          className={`flex items-center ${colors.bgButton} ${colors.textButton} px-4 py-2 rounded-md hover:bg-opacity-90 transition-all`}
        >
          {showForm ? <X size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
          {showForm ? 'Cancel' : 'Add New Short'}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className={`${isDark ? 'bg-red-900/50 border-red-700' : 'bg-red-100 border-red-400'} border text-red-${isDark ? '300' : '700'} px-4 py-3 rounded mb-4 flex flex-col sm:flex-row sm:items-center justify-between`}>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
          {error.includes('session') || error.includes('token') ? (
            <button
              onClick={handleLoginRedirect}
              className={`mt-2 sm:mt-0 ${isDark ? 'bg-red-500' : 'bg-red-600'} text-white px-4 py-1 rounded hover:bg-red-700 transition-all text-sm`}
            >
              Log In
            </button>
          ) : (
            <button
              onClick={fetchShorts}
              className={`mt-2 sm:mt-0 ${isDark ? 'bg-red-500' : 'bg-red-600'} text-white px-4 py-1 rounded hover:bg-red-700 transition-all text-sm`}
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <ShortForm 
          currentShort={currentShort} 
          setShowForm={setShowForm} 
          refreshShorts={fetchShorts} 
        />
      )}

      {/* Shorts List */}
      {loading ? (
        <div className="text-center py-10">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDark ? 'border-purple-500' : 'border-red-500'} mx-auto`}></div>
          <p className={`mt-3 ${colors.text}`}>Loading shorts...</p>
        </div>
      ) : shorts.length === 0 ? (
        <div className={`text-center py-10 ${colors.bgSection} rounded-lg`}>
          <p className={colors.textMuted}>No shorts found. Add your first YouTube short!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shorts.map((short) => (
            <div key={short._id} className={`${colors.bgCard} rounded-lg ${isDark ? 'shadow-lg shadow-black/30' : 'shadow-md'} overflow-hidden`}>
              {/* Thumbnail */}
              <YouTubeThumbnail 
                url={short.youtubeLink} 
                alt={short.title}
                size="high"
              />
              
              {/* Content */}
              <div className="p-4">
                <h3 className={`font-bold text-lg mb-1 truncate ${colors.textHeading}`}>{short.title}</h3>
                <p className={`${colors.textMuted} text-sm mb-4 line-clamp-2`}>{short.description}</p>
                
                {/* Link */}
                <a 
                  href={short.youtubeLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline text-sm flex items-center mb-4`}
                >
                  <ExternalLink size={14} className="mr-1" />
                  View on YouTube
                </a>
                
                {/* Metrics */}
                <div className={`${colors.bgSection} p-3 rounded-md`}>
                  <h4 className={`font-semibold text-sm mb-2 flex items-center ${colors.textHeading}`}>
                    <BarChart3 size={16} className="mr-1" />
                    Metrics
                    {editingMetrics.id !== short._id && (
                      <button 
                        onClick={() => startEditMetrics(short)}
                        className={`ml-auto text-xs ${isDark ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} px-2 py-1 rounded transition-colors`}
                      >
                        Edit
                      </button>
                    )}
                    {editingMetrics.id === short._id && (
                      <div className="ml-auto">
                        <button 
                          onClick={() => saveMetrics(short._id)}
                          className={`text-xs ${isDark ? 'bg-green-600' : 'bg-green-500'} text-white px-2 py-1 rounded hover:bg-green-${isDark ? '500' : '600'} mr-1 transition-colors`}
                        >
                          <Save size={14} />
                        </button>
                        <button 
                          onClick={cancelEditMetrics}
                          className={`text-xs ${isDark ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} px-2 py-1 rounded transition-colors`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <Eye size={14} className={`mr-1 ${colors.textMuted}`} />
                      {editingMetrics.id === short._id ? (
                        <input
                          type="number"
                          name="views"
                          value={editingMetrics.views}
                          onChange={handleMetricChange}
                          className={`${isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded p-1 w-full text-sm`}
                        />
                      ) : (
                        <span className={`text-sm ${colors.text}`}>{short.metrics.views.toLocaleString()} views</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp size={14} className={`mr-1 ${colors.textMuted}`} />
                      {editingMetrics.id === short._id ? (
                        <input
                          type="number"
                          name="likes"
                          value={editingMetrics.likes}
                          onChange={handleMetricChange}
                          className={`${isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded p-1 w-full text-sm`}
                        />
                      ) : (
                        <span className={`text-sm ${colors.text}`}>{short.metrics.likes.toLocaleString()} likes</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare size={14} className={`mr-1 ${colors.textMuted}`} />
                      {editingMetrics.id === short._id ? (
                        <input
                          type="number"
                          name="comments"
                          value={editingMetrics.comments}
                          onChange={handleMetricChange}
                          className={`${isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded p-1 w-full text-sm`}
                        />
                      ) : (
                        <span className={`text-sm ${colors.text}`}>{short.metrics.comments.toLocaleString()} comments</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Share2 size={14} className={`mr-1 ${colors.textMuted}`} />
                      {editingMetrics.id === short._id ? (
                        <input
                          type="number"
                          name="shares"
                          value={editingMetrics.shares}
                          onChange={handleMetricChange}
                          className={`${isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded p-1 w-full text-sm`}
                        />
                      ) : (
                        <span className={`text-sm ${colors.text}`}>{short.metrics.shares.toLocaleString()} shares</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className={`flex ${isDark ? 'border-t border-gray-700' : 'border-t'}`}>
                <button 
                  onClick={() => handleEdit(short)}
                  className={`flex-1 py-2 text-center ${isDark ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-600 hover:bg-blue-50'} transition-all flex items-center justify-center`}
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(short._id)}
                  className={`flex-1 py-2 text-center ${isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'} transition-all flex items-center justify-center`}
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shorts;