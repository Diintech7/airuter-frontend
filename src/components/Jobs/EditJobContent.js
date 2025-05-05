import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Save, Clock, DollarSign, Star, Briefcase, MapPin, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { useThemeStyles } from '../hooks/useThemeStyles';

const EditJobContent = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { isDark, colors, styles } = useThemeStyles();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formState, setFormState] = useState({
    title: '',
    company: '',
    type: 'full-time',
    location: '',
    description: '',
    requirements: '',
    responsibilities: '',
    skills: '',
    benefits: '',
    experience: {
      min: 0,
      max: 5
    },
    salary: {
      min: 0,
      max: 100000
    },
    status: 'active'
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('usertoken');
        const response = await fetch(`https://auriter-backen.onrender.com/api/jobs/${jobId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch job details');
        
        const data = await response.json();
        setJob(data);
        
        // Format the job data for the form
        setFormState({
          title: data.title || '',
          company: data.company || '',
          type: data.type || 'full-time',
          location: data.location || '',
          description: data.description || '',
          requirements: Array.isArray(data.requirements) ? data.requirements.join('\n') : '',
          responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities.join('\n') : '',
          skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
          benefits: Array.isArray(data.benefits) ? data.benefits.join('\n') : '',
          experience: {
            min: data.experience?.min || 0,
            max: data.experience?.max || 5
          },
          salary: {
            min: data.salary?.min || 0,
            max: data.salary?.max || 100000
          },
          status: data.status || 'active'
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormState({
        ...formState,
        [parent]: {
          ...formState[parent],
          [child]: parseInt(value, 10)
        }
      });
    } else {
      setFormState({
        ...formState,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    
    try {
      // Format data for submission
      const formattedData = {
        ...formState,
        requirements: formState.requirements.split('\n').filter(item => item.trim() !== ''),
        responsibilities: formState.responsibilities.split('\n').filter(item => item.trim() !== ''),
        skills: formState.skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
        benefits: formState.benefits.split('\n').filter(item => item.trim() !== '')
      };
      
      const token = Cookies.get('usertoken');
      const response = await fetch(`https://auriter-backen.onrender.com/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update job');
      }
      
      setSuccessMessage('Job updated successfully!');
      
      // Navigate back to job listings after 2 seconds
      setTimeout(() => {
        navigate('/my-listings');
      }, 2000);
    } catch (err) {
      setError(err.message);
      window.scrollTo(0, 0);
    } finally {
      setSubmitLoading(false);
    }
  };

  const jobTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'closed', label: 'Closed' },
    { value: 'expired', label: 'Expired' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent ${styles.transition}`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button at top left */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/my-listings')}
          className={`flex items-center ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} ${styles.transition}`}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Job Listings
        </button>
      </div>
      
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader className="pb-4">
          <CardTitle className={`text-2xl font-bold ${colors.text}`}>Edit Job: {job?.title}</CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className={`mb-6 p-4 ${colors.error} rounded-lg border flex items-start ${styles.transition}`}>
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className={`mb-6 p-4 ${colors.success} rounded-lg border ${styles.transition}`}>
              <p className="font-medium">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="title" className={styles.label}>
                  Job Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md ${styles.input} ${styles.focusRing}`}
                  required
                />
              </div>

              {/* Company */}
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="company" className={styles.label}>
                  Company*
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formState.company}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md ${styles.input} ${styles.focusRing}`}
                  required
                />
              </div>

              {/* Job Type */}
              <div>
                <label htmlFor="type" className={styles.label}>
                  <Briefcase className="h-4 w-4 inline mr-1" />
                  Job Type*
                </label>
                <select
                  id="type"
                  name="type"
                  value={formState.type}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md ${styles.input} ${styles.focusRing} bg-opacity-100`}
                  required
                >
                  {jobTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className={styles.label}>
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Location*
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formState.location}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md ${styles.input} ${styles.focusRing}`}
                  placeholder="City, Country or Remote"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className={styles.label}>
                  Status*
                </label>
                <select
                  id="status"
                  name="status"
                  value={formState.status}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md ${styles.input} ${styles.focusRing} bg-opacity-100`}
                  required
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div className="col-span-2 md:col-span-1">
                <label className={styles.label}>
                  <Clock className="h-4 w-4 inline mr-1" />
                  Experience (years)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="experience.min" className={`block text-xs ${colors.textMuted} mb-1`}>
                      Minimum
                    </label>
                    <input
                      type="number"
                      id="experience.min"
                      name="experience.min"
                      value={formState.experience.min}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full p-3 border rounded-md ${styles.input} ${styles.focusRing}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="experience.max" className={`block text-xs ${colors.textMuted} mb-1`}>
                      Maximum
                    </label>
                    <input
                      type="number"
                      id="experience.max"
                      name="experience.max"
                      value={formState.experience.max}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full p-3 border rounded-md ${styles.input} ${styles.focusRing}`}
                    />
                  </div>
                </div>
              </div>

              {/* Salary */}
              <div className="col-span-2 md:col-span-1">
                <label className={styles.label}>
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Salary Range (USD)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="salary.min" className={`block text-xs ${colors.textMuted} mb-1`}>
                      Minimum
                    </label>
                    <input
                      type="number"
                      id="salary.min"
                      name="salary.min"
                      value={formState.salary.min}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full p-3 border rounded-md ${styles.input} ${styles.focusRing}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="salary.max" className={`block text-xs ${colors.textMuted} mb-1`}>
                      Maximum
                    </label>
                    <input
                      type="number"
                      id="salary.max"
                      name="salary.max"
                      value={formState.salary.max}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full p-3 border rounded-md ${styles.input} ${styles.focusRing}`}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label htmlFor="description" className={styles.label}>
                  Job Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formState.description}
                  onChange={handleInputChange}
                  rows="5"
                  className={`w-full p-3 border rounded-md ${styles.input} ${styles.focusRing}`}
                  required
                ></textarea>
                <p className={`mt-1 text-sm ${colors.textMuted}`}>
                  Provide a detailed description of the role and responsibilities.
                </p>
              </div>

              {/* Requirements */}
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="requirements" className={styles.label}>
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formState.requirements}
                  onChange={handleInputChange}
                  rows="5"
                  className={`w-full p-3 border rounded-md ${styles.input} ${styles.focusRing}`}
                  placeholder="Enter each requirement on a new line"
                ></textarea>
                <p className={`mt-1 text-sm ${colors.textMuted}`}>
                  List each requirement on a new line.
                </p>
              </div>

              {/* Responsibilities */}
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="responsibilities" className={styles.label}>
                  Responsibilities
                </label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  value={formState.responsibilities}
                  onChange={handleInputChange}
                  rows="5"
                  className={`w-full p-3 border rounded-md ${styles.input} ${styles.focusRing}`}
                  placeholder="Enter each responsibility on a new line"
                ></textarea>
                <p className={`mt-1 text-sm ${colors.textMuted}`}>
                  List each responsibility on a new line.
                </p>
              </div>

              {/* Skills */}
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="skills" className={styles.label}>
                  <Star className="h-4 w-4 inline mr-1" />
                  Skills
                </label>
                <textarea
                  id="skills"
                  name="skills"
                  value={formState.skills}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full p-3 border rounded-md ${styles.input} ${styles.focusRing}`}
                  placeholder="e.g. JavaScript, React, Node.js"
                ></textarea>
                <p className={`mt-1 text-sm ${colors.textMuted}`}>
                  Enter skills separated by commas.
                </p>
              </div>

              {/* Benefits */}
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="benefits" className={styles.label}>
                  Benefits
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={formState.benefits}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full p-3 border rounded-md ${styles.input} ${styles.focusRing}`}
                  placeholder="Enter each benefit on a new line"
                ></textarea>
                <p className={`mt-1 text-sm ${colors.textMuted}`}>
                  List each benefit on a new line.
                </p>
              </div>
            </div>

            <div className={`flex justify-end space-x-4 pt-4 border-t ${colors.border} ${styles.transition}`}>
              <button
                type="button"
                onClick={() => navigate('/my-listings')}
                className={`px-4 py-2 border ${colors.border} ${colors.textSecondary} rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${styles.focusRing} ${styles.transition}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className={`px-6 py-2 ${colors.buttonPrimary} text-white rounded-md ${styles.focusRing} flex items-center ${styles.transition}`}
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Job
                  </>
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
 
export default EditJobContent;