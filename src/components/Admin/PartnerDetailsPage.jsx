import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Building, 
  Users, 
  CheckCircle, 
  XCircle,
  Edit,
  Trash2,
  ExternalLink,
  BookOpen,
  Clock,
  FileText,
  Briefcase
} from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const PartnerDetailsPage = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchPartnerDetails();
    fetchPartnerStats();
  }, [partnerId]);

  const fetchPartnerDetails = async () => {
    try {
      const token = Cookies.get('admintoken');
      const response = await axios.get(
        `https://test.airuter.com/api/partner/partners/${partnerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPartner(response.data.partner);
    } catch (error) {
      toast.error('Error fetching partner details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerStats = async () => {
    try {
      const token = Cookies.get('admintoken');
      const response = await axios.get(
        `https://test.airuter.com/api/partner/job-access/${partnerId}/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching partner stats:', error);
    }
  };

  const handleStatusToggle = async () => {
    try {
      const token = Cookies.get('admintoken');
      await axios.put(
        `https://test.airuter.com/api/partner/partners/${partnerId}/status`,
        { status: !partner.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPartner(prev => ({ ...prev, isActive: !prev.isActive }));
      toast.success(`Partner ${!partner.isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Error updating partner status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        const token = Cookies.get('admintoken');
        await axios.delete(`https://test.airuter.com/api/partner/partners/${partnerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Partner deleted successfully');
        navigate('/admin/partners');
      } catch (error) {
        toast.error('Error deleting partner');
      }
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-900">Partner not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/partners')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{partner.partnerName}</h1>
            <p className="text-gray-600">{partner.user?.email}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleStatusToggle}
            className={`px-4 py-2 rounded-lg font-medium ${
              partner.isActive
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {partner.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
          >
            <Trash2 className="h-4 w-4 mr-2 inline" />
            Delete
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.candidateCount || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Job Access</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.assignedJobsCount || 0}/{stats.totalPrivateJobsCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Status</p>
              <p className={`text-sm font-medium ${partner.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {partner.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Joined</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(partner.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Partner Name</label>
                <p className="text-gray-900">{partner.partnerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(partner.category)}`}>
                    {partner.category}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Contact Person</label>
                <p className="text-gray-900">{partner.adminContactPerson}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Established Year</label>
                <p className="text-gray-900">{partner.establishedYear || 'N/A'}</p>
              </div>
              {partner.categoryDescription && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Category Description</label>
                  <p className="text-gray-900">{partner.categoryDescription}</p>
                </div>
              )}
              {partner.description && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-900">{partner.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{partner.contactNumber}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{partner.email}</span>
              </div>
              {partner.website && (
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
                  <a 
                    href={partner.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    {partner.website}
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              )}
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-gray-900">{partner.location?.address}</p>
                  <p className="text-gray-600 text-sm">
                    {partner.location?.city}, {partner.location?.state} - {partner.location?.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Offered */}
          {partner.coursesOffered && partner.coursesOffered.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Courses Offered</h2>
              <div className="space-y-3">
                {partner.coursesOffered.map((course, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{course.courseName}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {course.courseType}
                      </span>
                    </div>
                    {course.duration && (
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                    )}
                    {course.description && (
                      <p className="text-sm text-gray-600">{course.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Business Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Business Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">GST Number</label>
                <p className="text-gray-900">{partner.gstNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">PAN Number</label>
                <p className="text-gray-900">{partner.panNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Partnership Type</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {partner.partnershipType}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Verification Status</label>
                <div className="flex items-center mt-1">
                  {partner.isVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className={partner.isVerified ? 'text-green-600' : 'text-red-600'}>
                    {partner.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {partner.socialLinks && Object.values(partner.socialLinks).some(link => link) && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Social Media</h2>
              <div className="space-y-2">
                {partner.socialLinks.linkedin && (
                  <a href={partner.socialLinks.linkedin} className="block text-blue-600 hover:underline">
                    LinkedIn
                  </a>
                )}
                {partner.socialLinks.facebook && (
                  <a href={partner.socialLinks.facebook} className="block text-blue-600 hover:underline">
                    Facebook
                  </a>
                )}
                {partner.socialLinks.twitter && (
                  <a href={partner.socialLinks.twitter} className="block text-blue-600 hover:underline">
                    Twitter
                  </a>
                )}
                {partner.socialLinks.instagram && (
                  <a href={partner.socialLinks.instagram} className="block text-blue-600 hover:underline">
                    Instagram
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Conversion History */}
          {partner.conversionHistory && partner.conversionHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Conversion History</h2>
              <div className="space-y-3">
                {partner.conversionHistory.map((conversion, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">
                      {conversion.fromRole} → {conversion.toRole}
                    </p>
                    <p className="text-gray-600">
                      {new Date(conversion.convertedAt).toLocaleDateString()}
                    </p>
                    {conversion.reason && (
                      <p className="text-gray-500 italic">{conversion.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailsPage;