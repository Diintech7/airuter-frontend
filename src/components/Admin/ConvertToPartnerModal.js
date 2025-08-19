import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X, Building, MapPin, FileText, Phone, Mail, Globe, Calendar, BookOpen, Plus, Minus } from 'lucide-react';

const ConvertToPartnerModal = ({ recruiters, onClose, onSubmit, selectedRecruiter }) => {
    const [formData, setFormData] = useState({
        category: '',
        categoryDescription: '',
        adminContactPerson: '',
        contactNumber: '',
        email: '',
        website: '', 
        gstNumber: '',
        panNumber: '',
        establishedYear: '',
        description: '',
        location: {
          address: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India'
        },
        coursesOffered: [{
          courseName: '',
          courseType: '',
          duration: '',
          description: ''
        }],
        reason: ''
      });

  const [selectedRecruiterId, setSelectedRecruiterId] = useState(selectedRecruiter?._id || '');
  const [selectedRecruiterData, setSelectedRecruiterData] = useState(null);
  const categoryOptions = [
    'Training Institute',
    'Placement Consultancy',
    'College / University',
    'NGO / Non-Profit',
    'School',
    'Government Organization',
    'Others'
  ];

  const courseTypes = ['Skill-based', 'Academic', 'Certification', 'Workshop'];
  useEffect(() => {
    if (selectedRecruiterId) {
      const recruiter = recruiters.find(r => r._id === selectedRecruiterId);
      if (recruiter) {
        setSelectedRecruiterData(recruiter);
        setFormData(prev => ({
          ...prev,
          adminContactPerson: recruiter.name || '',
          email: recruiter.email || '',
          contactNumber: recruiter.company?.phone || recruiter.adminProfile?.contactPhone || '',
          description: recruiter.company?.description || recruiter.adminProfile?.description || '',
          establishedYear: recruiter.adminProfile?.establishedYear || '',
          location: {
            ...prev.location,
            address: recruiter.company?.location || recruiter.adminProfile?.location || ''
          },
          website: recruiter.company?.website || recruiter.adminProfile?.website || ''
        }));
      }
    }
}, [selectedRecruiterId, recruiters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...formData.coursesOffered];
    updatedCourses[index] = {
      ...updatedCourses[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      coursesOffered: updatedCourses
    }));
  };

  const addCourse = () => {
    setFormData(prev => ({
      ...prev,
      coursesOffered: [
        ...prev.coursesOffered,
        { courseName: '', courseType: '', duration: '', description: '' }
      ]
    }));
  };

  const removeCourse = (index) => {
    setFormData(prev => ({
      ...prev,
      coursesOffered: prev.coursesOffered.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ['category', 'adminContactPerson', 'contactNumber', 'email', 'panNumber', 'reason'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    const businessCategories = ['Training Institute', 'Placement Consultancy', 'College / University', 'Government Organization'];
    if (businessCategories.includes(formData.category) && !formData.gstNumber) {
      missingFields.push('gstNumber');
    }
    if (formData.category === 'Others' && !formData.categoryDescription) {
      missingFields.push('categoryDescription');
    }
    if (missingFields.length > 0) {
      toast.error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }
    onSubmit({
      recruiterId: selectedRecruiterId,
      ...formData
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Partner
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {!selectedRecruiter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Recruiter
              </label>
              <select
                value={selectedRecruiterId}
                onChange={(e) => setSelectedRecruiterId(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Choose a recruiter...</option>
                {recruiters.map(recruiter => (
                  <option key={recruiter._id} value={recruiter._id}>
                    {recruiter.name} ({recruiter.email}) - {recruiter.adminProfile?.companyName || 'No Company'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedRecruiterData && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Current Recruiter Details:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium">Name:</span> {selectedRecruiterData.name}</p>
                <p><span className="font-medium">Email:</span> {selectedRecruiterData.email}</p>
                <p><span className="font-medium">Company:</span> {selectedRecruiterData.adminProfile?.companyName || 'N/A'}</p>
                <p><span className="font-medium">Position:</span> {selectedRecruiterData.adminProfile?.position || 'N/A'}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Partner Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {formData.category === 'Others' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Description *
                </label>
                <input
                  type="text"
                  name="categoryDescription"
                  value={formData.categoryDescription}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe the category"
                  required
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Contact Person *
              </label>
              <input
                type="text"
                name="adminContactPerson"
                value={formData.adminContactPerson}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Website URL
  </label>
  <input
    type="url"
    name="website"
    value={formData.website}
    onChange={handleInputChange}
    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    placeholder="https://example.com"
  />
</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                PAN Number *
              </label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="ABCDE1234F"
                required
              />
            </div>
            
            {!['NGO / Non-Profit', 'School'].includes(formData.category) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GST Number {['Training Institute', 'Placement Consultancy', 'College / University', 'Government Organization'].includes(formData.category) ? '*' : ''}
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="22AAAAA0000A1Z5"
                  required={['Training Institute', 'Placement Consultancy', 'College / University', 'Government Organization'].includes(formData.category)}
                />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Address
                </label>
                <textarea
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Complete address with landmarks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  name="location.pincode"
                  value={formData.location.pincode}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Established Year
                </label>
                <input
                  type="number"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Courses Offered</h3>
              <button
                type="button"
                onClick={addCourse}
                className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Course
              </button>
            </div>
            
            {formData.coursesOffered.map((course, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">Course {index + 1}</h4>
                  {formData.coursesOffered.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCourse(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={course.courseName}
                      onChange={(e) => handleCourseChange(index, 'courseName', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Type
                    </label>
                    <select
                      value={course.courseType}
                      onChange={(e) => handleCourseChange(index, 'courseType', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Type</option>
                      {courseTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={course.duration}
                      onChange={(e) => handleCourseChange(index, 'duration', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., 6 months, 40 hours"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={course.description}
                      onChange={(e) => handleCourseChange(index, 'description', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Organization Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe the organization, its mission, and services"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for Adding *
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Add to Partner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConvertToPartnerModal;