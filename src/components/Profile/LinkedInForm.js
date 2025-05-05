import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Cookies from 'js-cookie';
import { useThemeStyles } from '../hooks/useThemeStyles'; // Adjust the import path if needed

const LinkedInForm = ({ onBack }) => {
  const { colors, styles, cx } = useThemeStyles();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://auriter-backen.onrender.com/api/profile/linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('usertoken')}`
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      if (data.success) {
        // Handle successful profile import
        window.location.href = '/';
      }
    } catch (error) {
      console.error('LinkedIn import error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("max-w-md mx-auto p-8", colors.bgCard)}>
      <button
        onClick={onBack}
        className={cx("flex items-center hover:text-gray-800 mb-8", colors.textSecondary)}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to options
      </button>

      <h2 className={cx("text-2xl font-bold mb-6", colors.text)}>Connect LinkedIn</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={cx("block text-sm font-medium mb-2", colors.text)}>
            LinkedIn Email
          </label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            className={cx("w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent",
              colors.inputBg, colors.inputBorder, colors.inputText)}
            required
          />
        </div>

        <div>
          <label className={cx("block text-sm font-medium mb-2", colors.text)}>
            LinkedIn Password
          </label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className={cx("w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent",
              colors.inputBg, colors.inputBorder, colors.inputText)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={cx("w-full text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center",
            loading ? "opacity-70 cursor-not-allowed" : "",
            colors.buttonPrimary)}
        >
          {loading ? 'Importing...' : 'Import Profile'}
        </button>
      </form>
    </div>
  );
};

export default LinkedInForm;