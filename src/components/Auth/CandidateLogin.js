import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Airuter from '../../assets/airuter_logo.png';

const CandidateLogin = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '563533938078-9c4h92mat7s939a3l2i5nuq0083bgef8.apps.googleusercontent.com',
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: '100%'
          }
        );
      }
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://test.airuter.com/api/candidate/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      console.log(response);

      const data = await response.json();

      if (data.success) {
        setSuccess('Login successful! Redirecting...');
        
        // Save token to cookies with name 'usertoken'
        if (data.token) {
          Cookies.set('usertoken', data.token, { 
            expires: 30, // expires in 30 days
            secure: process.env.NODE_ENV === 'production', // secure flag for production
            sameSite: 'lax' // CSRF protection
          });
        }
        
        if (onAuthSuccess) {
          onAuthSuccess('candidate', []);
        }
        
        setTimeout(() => {
          navigate('/candidate/dashboard');
        }, 1500);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleResponse = async (response) => {
    setIsGoogleLoading(true);
    setError('');

    try {
      const backendResponse = await fetch('https://test.airuter.com/api/candidate/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          token: response.credential
        }),
      });
      console.log(backendResponse);
      
      const data = await backendResponse.json();

      if (data.success) {
        setSuccess('Google login successful! Redirecting...');
        
        // Save token to cookies with name 'usertoken'
        if (data.token) {
          Cookies.set('usertoken', data.token, { 
            expires: 30, // expires in 30 days
            secure: process.env.NODE_ENV === 'production', // secure flag for production
            sameSite: 'lax' // CSRF protection
          });
        }
        
        if (onAuthSuccess) {
          onAuthSuccess('candidate', []);
        }
        
        setTimeout(() => {
          navigate('/candidate/dashboard');
        }, 1500);
      } else {
        setError(data.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google authentication failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/candidate/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex flex-col">
      <div className="bg-white shadow-sm border-b border-yellow-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center overflow-hidden mr-3">
              <img src={Airuter} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Skills Circle Institute</h1>
              <p className="text-sm text-gray-600">Job Portal powered by Airuter</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img src={Airuter} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-600">
              Welcome to Skills Circle Job Portal powered by Airuter
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to access your candidate dashboard
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-yellow-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-yellow-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                  <CheckCircle size={16} />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div id="google-signin-button" className="w-full"></div>
              {isGoogleLoading && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-500 border-t-transparent"></div>
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Having trouble logging in? Contact your institute administrator.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Powered by <span className="font-semibold text-yellow-600">Airuter</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateLogin;