// AdminLoginPage.js - Fixed version
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, AlertCircle, Loader } from 'lucide-react';
import Cookies from 'js-cookie';

const AdminLoginPage = ({ onAuthSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://auriter-backen.onrender.com/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        console.log(data)
        // Store token in cookie
        Cookies.set('admintoken', data.token, { 
          expires: 7,
        });
        
        // Store user data in cookie
        Cookies.set('adminUser', JSON.stringify(data.user), { 
          expires: 7,
        });
        
        // Call onAuthSuccess with the role 'admin'
        onAuthSuccess('admin');
        
        // Explicitly navigate to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError(data.message);
        
        // Handle specific status messages
        if (data.status === 'pending') {
          setError('Your account is awaiting approval from an admin.');
        } else if (data.status === 'rejected') {
          setError('Your account registration was rejected. Please contact support.');
        }
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-red-600 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Access</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your administrative credentials
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center p-4 bg-red-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isLoading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/admin/register"
              className="text-sm text-red-600 hover:text-red-500"
            >
              Don't have an account? Register as Admin
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;