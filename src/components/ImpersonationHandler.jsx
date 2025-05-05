// ImpersonationHandler.jsx
import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const ImpersonationHandler = () => {
  const { recruiterId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const setupImpersonation = async () => {
      try {
        const token = Cookies.get('admintoken');
        
        if (!token) {
          setError('No admin token found');
          return;
        }

        const response = await axios.get(`https://auriter-backen.onrender.com/api/admin/recruiters/${recruiterId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          const recruiterData = response.data.recruiter;
          
          // Set cookies for impersonation
          Cookies.set('usertoken', token, { path: '/' });
          Cookies.set('user', JSON.stringify({
            _id: recruiterData._id,
            name: recruiterData.name,
            email: recruiterData.email,
            role: 'recruiter'
          }), { path: '/' });
          Cookies.set('impersonatingRecruiter', 'true', { path: '/' });
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error setting up impersonation:', error);
        setError('Could not impersonate recruiter');
      }
    };

    setupImpersonation();
  }, [recruiterId]);

  if (loading && !error) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">
      {error}
    </div>;
  }

  // Redirect to dashboard after cookies are set
  return <Navigate to="/dashboard" replace />;
};

export default ImpersonationHandler;