import React, { useState } from 'react';
import { Card, CardContent } from '../UI/Card';
import { Plus, X, Save, User, Mail, Phone, Hash, Calendar, MapPin, GraduationCap, Briefcase, Target } from 'lucide-react';

const AddCandidateForm = ({ onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    registrationNumber: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    education: [],
    enrolledCourse: {
      courseName: '',
      courseType: 'Skill-based',
      status: 'Enrolled'
    },
    skills: [],
    experience: [],
    jobPreferences: {
      preferredLocation: [],
      expectedSalary: { min: '', max: '' },
      jobType: 'Full-time',
      industry: []
    },
    notes: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newIndustry, setNewIndustry] = useState('');

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

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        yearOfCompletion: '',
        percentage: '',
        specialization: ''
      }]
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        duration: '',
        description: ''
      }]
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addLocation = () => {
    if (newLocation.trim() && !formData.jobPreferences.preferredLocation.includes(newLocation.trim())) {
      setFormData(prev => ({
        ...prev,
        jobPreferences: {
          ...prev.jobPreferences,
          preferredLocation: [...prev.jobPreferences.preferredLocation, newLocation.trim()]
        }
      }));
      setNewLocation('');
    }
  };

  const removeLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      jobPreferences: {
        ...prev.jobPreferences,
        preferredLocation: prev.jobPreferences.preferredLocation.filter(l => l !== location)
      }
    }));
  };

  const addIndustry = () => {
    if (newIndustry.trim() && !formData.jobPreferences.industry.includes(newIndustry.trim())) {
      setFormData(prev => ({
        ...prev,
        jobPreferences: {
          ...prev.jobPreferences,
          industry: [...prev.jobPreferences.industry, newIndustry.trim()]
        }
      }));
      setNewIndustry('');
    }
  };

  const removeIndustry = (industry) => {
    setFormData(prev => ({
      ...prev,
      jobPreferences: {
        ...prev.jobPreferences,
        industry: prev.jobPreferences.industry.filter(i => i !== industry)
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="h-6 w-6" />
            Add New Candidate
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                  pattern="[6-9][0-9]{9}"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Registration Number *
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Personal Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </h4>
                <input
                  type="text"
                  name="address.street"
                  placeholder="Street Address"
                  value={formData.address.street}
                  onChange={handleInputChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="address.city"
                    placeholder="City"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                  <input
                    type="text"
                    name="address.state"
                    placeholder="State"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <input
                  type="text"
                  name="address.pincode"
                  placeholder="Pincode"
                  value={formData.address.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Course Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Course Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  name="enrolledCourse.courseName"
                  value={formData.enrolledCourse.courseName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Type
                </label>
                <select
                  name="enrolledCourse.courseType"
                  value={formData.enrolledCourse.courseType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="Skill-based">Skill-based</option>
                  <option value="Academic">Academic</option>
                  <option value="Certification">Certification</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="enrolledCourse.status"
                  value={formData.enrolledCourse.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="Enrolled">Enrolled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </h3>
              <button
                type="button"
                onClick={addEducation}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Education
              </button>
            </div>
            
            {formData.education.map((edu, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg dark:border-gray-600">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Education {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Year of Completion"
                    value={edu.yearOfCompletion}
                    onChange={(e) => updateEducation(index, 'yearOfCompletion', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Percentage/CGPA"
                    value={edu.percentage}
                    onChange={(e) => updateEducation(index, 'percentage', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Specialization"
                    value={edu.specialization}
                    onChange={(e) => updateEducation(index, 'specialization', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white md:col-span-2"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Experience
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </button>
            </div>
            
            {formData.experience.map((exp, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg dark:border-gray-600">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Experience {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={exp.position}
                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 2 years)"
                    value={exp.duration}
                    onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white md:col-span-2"
                  />
                  <textarea
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    rows={3}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white md:col-span-2"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Job Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              Job Preferences
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Job Type
                  </label>
                  <select
                    name="jobPreferences.jobType"
                    value={formData.jobPreferences.jobType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expected Salary Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="jobPreferences.expectedSalary.min"
                      placeholder="Min"
                      value={formData.jobPreferences.expectedSalary.min}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                    <input
                      type="number"
                      name="jobPreferences.expectedSalary.max"
                      placeholder="Max"
                      value={formData.jobPreferences.expectedSalary.max}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preferred Locations
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="Add location"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
                    />
                    <button
                      type="button"
                      onClick={addLocation}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.jobPreferences.preferredLocation.map((location, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm dark:bg-green-900 dark:text-green-200"
                      >
                        {location}
                        <button
                          type="button"
                          onClick={() => removeLocation(location)}
                          className="ml-1 text-green-600 hover:text-green-800 dark:text-green-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Industry Preferences
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newIndustry}
                      onChange={(e) => setNewIndustry(e.target.value)}
                      placeholder="Add industry"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIndustry())}
                    />
                    <button
                      type="button"
                      onClick={addIndustry}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.jobPreferences.industry.map((industry, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm dark:bg-purple-900 dark:text-purple-200"
                      >
                        {industry}
                        <button
                          type="button"
                          onClick={() => removeIndustry(industry)}
                          className="ml-1 text-purple-600 hover:text-purple-800 dark:text-purple-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              placeholder="Any additional information about the candidate..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Add Candidate
                </>
              )}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCandidateForm;