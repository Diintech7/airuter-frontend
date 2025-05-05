import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Building, Globe, Users, MapPin, Briefcase, Mail, Phone, Linkedin, Twitter, Facebook, Image, Upload } from 'lucide-react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useThemeStyles } from '../hooks/useThemeStyles';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { colors, styles } = useThemeStyles();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState({
    name: '',
    industry: '',
    size: '',
    location: '',
    website: '',
    description: '',
    position: '',
    contactEmail: '',
    contactPhone: '',
    logo: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: ''
    }
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://auriter-backen.onrender.com/api/company/profile', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('usertoken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch company profile');
      }
      
      const data = await response.json();
      if (data.success) {
        setCompanyData(prevData => ({
          ...prevData,
          ...data.data
        }));
        
        if (data.data.logo) {
          setPreviewLogo(data.data.logo);
        }
      }
    } catch (error) {
      setError('Failed to load company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCompanyData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCompanyData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
        setCompanyData(prev => ({
          ...prev,
          logo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://auriter-backen.onrender.com/api/company/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('usertoken')}`
        },
        body: JSON.stringify(companyData)
      });

      if (!response.ok) {
        throw new Error('Failed to update company profile');
      }

      const data = await response.json();
      if (data.success) {
        setSuccess('Company profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      setError('Failed to update company profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${colors.bg}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className={`${styles.pageContainer} max-w-6xl mx-auto px-4 py-8`}>
      {/* Header Section */}
      <div className={`${colors.cardBg} rounded-xl ${colors.shadow} overflow-hidden mb-6 transition-colors duration-300`}>
        <div className={`p-6 bg-gradient-to-r ${isDark ? 'from-purple-800 to-purple-900' : 'from-purple-600 to-purple-700'} transition-colors duration-300`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Company Profile</h1>
              <p className={`${isDark ? 'text-purple-200' : 'text-purple-100'} mt-1 transition-colors duration-300`}>Manage your company information</p>
            </div>
            <div className="flex gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-purple-600 hover:bg-purple-50'} rounded-lg transition-all duration-300`}
                  >
                    <X size={20} />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-green-600 hover:bg-green-500' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg transition-all duration-300`}
                  >
                    <Save size={20} />
                    <span>Save Changes</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-gray-700 text-purple-300 hover:bg-gray-600 hover:text-purple-200' : 'bg-white text-purple-600 hover:bg-purple-50'} rounded-lg transition-all duration-300`}
                >
                  <Edit2 size={20} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className={`p-4 ${styles.error} border-l-4 transition-colors duration-300`}>
            {error}
          </div>
        )}
        {success && (
          <div className={`p-4 ${styles.success} border-l-4 transition-colors duration-300`}>
            {success}
          </div>
        )}

        {/* Company Information Form */}
        <div className="p-6 space-y-8">
          {/* Company Logo */}
          <div className="flex flex-col items-center mb-6">
            <label className={`flex items-center gap-2 text-sm font-medium ${colors.textSecondary} mb-2 transition-colors duration-300`}>
              <Image size={18} />
              Company Logo
            </label>
            <div className="flex flex-col items-center">
              {previewLogo ? (
                <div className="mb-4 relative">
                  <img 
                    src={previewLogo} 
                    alt="Company Logo" 
                    className="h-32 w-32 object-cover rounded-full border-4 border-purple-500"
                  />
                  {isEditing && (
                    <button 
                      onClick={() => {
                        setPreviewLogo(null);
                        setCompanyData(prev => ({ ...prev, logo: '' }));
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <div className={`h-32 w-32 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'} mb-4`}>
                  <Building size={48} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                </div>
              )}
              
              {isEditing && (
                <div className="flex items-center justify-center">
                  <label 
                    className={`cursor-pointer flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-500 hover:bg-purple-600'} text-white rounded-lg transition-all duration-300`}
                  >
                    <Upload size={20} />
                    <span>Upload Logo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className={`flex items-center gap-2 text-sm font-medium ${colors.textSecondary} mb-2 transition-colors duration-300`}>
                  <Building size={18} />
                  Company Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={companyData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70 ${!isEditing && isDark ? 'disabled:bg-gray-800' : 'disabled:bg-gray-50'} transition-colors duration-300`}
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className={`flex items-center gap-2 text-sm font-medium ${colors.textSecondary} mb-2 transition-colors duration-300`}>
                  <Briefcase size={18} />
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  value={companyData.industry}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70 ${!isEditing && isDark ? 'disabled:bg-gray-800' : 'disabled:bg-gray-50'} transition-colors duration-300`}
                  placeholder="e.g., Technology, Healthcare"
                />
              </div>

              <div>
                <label className={`flex items-center gap-2 text-sm font-medium ${colors.textSecondary} mb-2 transition-colors duration-300`}>
                  <Users size={18} />
                  Company Size
                </label>
                <select
                  name="size"
                  value={companyData.size}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70 ${!isEditing && isDark ? 'disabled:bg-gray-800' : 'disabled:bg-gray-50'} transition-colors duration-300`}
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501+">501+ employees</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className={`flex items-center gap-2 text-sm font-medium ${colors.textSecondary} mb-2 transition-colors duration-300`}>
                  <MapPin size={18} />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={companyData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70 ${!isEditing && isDark ? 'disabled:bg-gray-800' : 'disabled:bg-gray-50'} transition-colors duration-300`}
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className={`flex items-center gap-2 text-sm font-medium ${colors.textSecondary} mb-2 transition-colors duration-300`}>
                  <Globe size={18} />
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={companyData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70 ${!isEditing && isDark ? 'disabled:bg-gray-800' : 'disabled:bg-gray-50'} transition-colors duration-300`}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className={`flex items-center gap-2 text-sm font-medium ${colors.textSecondary} mb-2 transition-colors duration-300`}>
                  <Briefcase size={18} />
                  Your Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={companyData.position}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70 ${!isEditing && isDark ? 'disabled:bg-gray-800' : 'disabled:bg-gray-50'} transition-colors duration-300`}
                  placeholder="e.g., HR Manager"
                />
              </div>
            </div>
          </div>

          {/* Company Description */}
          <div>
            <label className={`block text-sm font-medium ${colors.textSecondary} mb-2 transition-colors duration-300`}>
              Company Description
            </label>
            <textarea
              name="description"
              value={companyData.description}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={4}
              className={`w-full p-3 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70 ${!isEditing && isDark ? 'disabled:bg-gray-800' : 'disabled:bg-gray-50'} transition-colors duration-300`}
              placeholder="Tell us about your company..."
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`flex items-center gap-2 text-sm font-medium ${colors.textSecondary} mb-2 transition-colors duration-300`}>
                <Mail size={18} />
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={companyData.contactEmail}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full p-3 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70 ${!isEditing && isDark ? 'disabled:bg-gray-800' : 'disabled:bg-gray-50'} transition-colors duration-300`}
                placeholder="contact@company.com"
              />
            </div>
            <div>
              <label className={`flex items-center gap-2 text-sm font-medium ${colors.textSecondary} mb-2 transition-colors duration-300`}>
                <Phone size={18} />
                Contact Phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={companyData.contactPhone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full p-3 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70 ${!isEditing && isDark ? 'disabled:bg-gray-800' : 'disabled:bg-gray-50'} transition-colors duration-300`}
                placeholder="+1 (123) 456-7890"
              />
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className={`text-lg font-medium ${colors.text} mb-4 transition-colors duration-300`}>Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={`flex items-center gap-2 text-sm font-medium ${colors.textSecondary} mb-2 transition-colors duration-300`}>
                  <Linkedin size={18} />
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="socialLinks.linkedin"
                  value={companyData.socialLinks.linkedin}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70 ${!isEditing && isDark ? 'disabled:bg-gray-800' : 'disabled:bg-gray-50'} transition-colors duration-300`}
                  placeholder="LinkedIn URL"
                />
              </div>
              <div>
                <label className={`flex items-center gap-2 text-sm font-medium ${colors.textSecondary} mb-2 transition-colors duration-300`}>
                  <Twitter size={18} />
                  Twitter
                </label>
                <input
                  type="url"
                  name="socialLinks.twitter"
                  value={companyData.socialLinks.twitter}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70 ${!isEditing && isDark ? 'disabled:bg-gray-800' : 'disabled:bg-gray-50'} transition-colors duration-300`}
                  placeholder="Twitter URL"
                />
              </div>
              <div>
                <label className={`flex items-center gap-2 text-sm font-medium ${colors.textSecondary} mb-2 transition-colors duration-300`}>
                  <Facebook size={18} />
                  Facebook
                </label>
                <input
                  type="url"
                  name="socialLinks.facebook"
                  value={companyData.socialLinks.facebook}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-70 ${!isEditing && isDark ? 'disabled:bg-gray-800' : 'disabled:bg-gray-50'} transition-colors duration-300`}
                  placeholder="Facebook URL"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;