import React, { useState } from 'react';
import { 
  User, MapPin, Mail, Phone, Briefcase, Plus, X, Calendar, 
  Building, Book, Award, Languages, CheckCircle, Trash2, Pencil
} from 'lucide-react';
import { useThemeStyles } from '../hooks/useThemeStyles';

const ProfileUpdateForm = ({ initialData, onSubmit, onCancel }) => {
  const { colors, styles, cx, isDark } = useThemeStyles();
  
  const [formData, setFormData] = useState(initialData || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    yearsOfExperience: '',
    skills: [],
    languages: [],
    certifications: [],
    achievements: [],
    education: [],
    experience: []
  });

  // Form fields for adding items
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  
  // Form fields for education
  const [educationForm, setEducationForm] = useState({
    degree: '',
    institution: '',
    yearOfCompletion: '',
    field: ''
  });
  
  // Form fields for experience
  const [experienceForm, setExperienceForm] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  
  const [editingEducationIndex, setEditingEducationIndex] = useState(-1);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState(-1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Helper for simple array items
  const addItem = (field, value, setter) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()]
      });
      setter('');
    }
  };

  const removeItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };
  
  // Handle education
  const addEducation = () => {
    if (educationForm.degree.trim() && educationForm.institution.trim()) {
      if (editingEducationIndex >= 0) {
        // Update existing education
        const updatedEducation = [...formData.education];
        updatedEducation[editingEducationIndex] = {...educationForm};
        setFormData({...formData, education: updatedEducation});
        setEditingEducationIndex(-1);
      } else {
        // Add new education
        setFormData({
          ...formData,
          education: [...formData.education, {...educationForm}]
        });
      }
      setEducationForm({
        degree: '',
        institution: '',
        yearOfCompletion: '',
        field: ''
      });
    }
  };
  
  const editEducation = (index) => {
    setEducationForm({...formData.education[index]});
    setEditingEducationIndex(index);
  };
  
  const removeEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index)
    });
  };
  
  // Handle experience
  const addExperience = () => {
    if (experienceForm.company.trim() && experienceForm.position.trim()) {
      if (editingExperienceIndex >= 0) {
        // Update existing experience
        const updatedExperience = [...formData.experience];
        updatedExperience[editingExperienceIndex] = {...experienceForm};
        setFormData({...formData, experience: updatedExperience});
        setEditingExperienceIndex(-1);
      } else {
        // Add new experience
        setFormData({
          ...formData,
          experience: [...formData.experience, {...experienceForm}]
        });
      }
      setExperienceForm({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
  };
  
  const editExperience = (index) => {
    setExperienceForm({...formData.experience[index]});
    setEditingExperienceIndex(index);
  };
  
  const removeExperience = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index)
    });
  };

  const inputClass = cx("pl-10 w-full p-2 border rounded-lg", 
    isDark ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
    : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500");
  
  const textareaClass = cx("w-full p-3 border rounded-lg", 
    isDark ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
    : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500");

  const labelClass = cx("block text-sm font-medium mb-2", 
    isDark ? "text-gray-200" : "text-gray-700");
  
  const sectionHeaderClass = cx("text-lg font-semibold mb-4", colors.text);
  
  const formSectionClass = cx("mb-8 p-6 rounded-lg", 
    isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200");
    
  const tagClass = cx("px-3 py-1 rounded-full flex items-center gap-2", 
    isDark ? "bg-purple-900 text-purple-200" : "bg-purple-50 text-purple-700");
    
  const cardClass = cx("p-4 mb-3 rounded-lg flex flex-col", 
    isDark ? "bg-gray-700 border border-gray-600" : "bg-gray-50 border border-gray-200");
    
  const buttonPrimary = cx("px-4 py-2 rounded-lg text-white transition-colors", 
    isDark ? "bg-purple-700 hover:bg-purple-600" : "bg-purple-600 hover:bg-purple-700");
    
  const buttonSecondary = cx("px-4 py-2 rounded-lg transition-colors", 
    isDark ? "bg-gray-700 text-white hover:bg-gray-600 border border-gray-600" 
    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300");
    
  const iconButtonClass = cx("p-2 rounded-lg transition-colors", 
    isDark ? "hover:bg-gray-600 text-gray-300 hover:text-white" 
    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700");

  return (
    <form onSubmit={handleSubmit} className={cx("max-w-4xl mx-auto rounded-xl shadow-lg p-8", colors.bgCard)}>
      <div className="mb-8">
        <h2 className={cx("text-2xl font-bold mb-6", colors.text)}>Update Profile</h2>
        
        {/* Personal Information */}
        <div className={formSectionClass}>
          <h3 className={sectionHeaderClass}>Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={labelClass}>First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className={inputClass}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className={labelClass}>Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Title</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className={inputClass}
                />
              </div>
            </div>
            
            <div>
              <label className={labelClass}>Years of Experience</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="number"
                  value={formData.yearsOfExperience || ''}
                  onChange={(e) => setFormData({...formData, yearsOfExperience: e.target.value})}
                  className={inputClass}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Professional Summary</label>
            <textarea
              value={formData.summary || ''}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              className={textareaClass}
              rows={4}
            />
          </div>
        </div>

        {/* Education Section */}
        <div className={formSectionClass}>
          <div className="flex items-center mb-4">
            <Book className={cx("mr-2", colors.primary)} size={24} />
            <h3 className={sectionHeaderClass}>Education</h3>
          </div>
          
          <div className="mb-6 p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>Degree</label>
                <input
                  type="text"
                  value={educationForm.degree}
                  onChange={(e) => setEducationForm({...educationForm, degree: e.target.value})}
                  className={inputClass.replace('pl-10', 'pl-3')}
                  placeholder="Bachelor of Science"
                />
              </div>
              
              <div>
                <label className={labelClass}>Institution</label>
                <input
                  type="text"
                  value={educationForm.institution}
                  onChange={(e) => setEducationForm({...educationForm, institution: e.target.value})}
                  className={inputClass.replace('pl-10', 'pl-3')}
                  placeholder="University Name"
                />
              </div>
              
              <div>
                <label className={labelClass}>Field of Study</label>
                <input
                  type="text"
                  value={educationForm.field}
                  onChange={(e) => setEducationForm({...educationForm, field: e.target.value})}
                  className={inputClass.replace('pl-10', 'pl-3')}
                  placeholder="Computer Science"
                />
              </div>
              
              <div>
                <label className={labelClass}>Year of Completion</label>
                <input
                  type="number"
                  value={educationForm.yearOfCompletion || ''}
                  onChange={(e) => setEducationForm({...educationForm, yearOfCompletion: e.target.value})}
                  className={inputClass.replace('pl-10', 'pl-3')}
                  placeholder="2020"
                  min="1900"
                  max="2100"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addEducation}
                className={buttonPrimary}
              >
                {editingEducationIndex >= 0 ? 'Update Education' : 'Add Education'}
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {formData.education && formData.education.map((edu, index) => (
              <div key={index} className={cardClass}>
                <div className="flex justify-between items-start mb-2">
                  <div className={cx("font-semibold", colors.text)}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => editEducation(index)}
                      className={iconButtonClass}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className={iconButtonClass}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className={colors.textSecondary}>{edu.institution}</div>
                {edu.yearOfCompletion && (
                  <div className={cx("text-sm", colors.textMuted)}>
                    Graduated: {edu.yearOfCompletion}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Experience Section */}
        <div className={formSectionClass}>
          <div className="flex items-center mb-4">
            <Briefcase className={cx("mr-2", colors.primary)} size={24} />
            <h3 className={sectionHeaderClass}>Work Experience</h3>
          </div>
          
          <div className="mb-6 p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>Company</label>
                <input
                  type="text"
                  value={experienceForm.company}
                  onChange={(e) => setExperienceForm({...experienceForm, company: e.target.value})}
                  className={inputClass.replace('pl-10', 'pl-3')}
                  placeholder="Company Name"
                />
              </div>
              
              <div>
                <label className={labelClass}>Position</label>
                <input
                  type="text"
                  value={experienceForm.position}
                  onChange={(e) => setExperienceForm({...experienceForm, position: e.target.value})}
                  className={inputClass.replace('pl-10', 'pl-3')}
                  placeholder="Software Engineer"
                />
              </div>
              
              <div>
                <label className={labelClass}>Start Date</label>
                <input
                  type="date"
                  value={experienceForm.startDate ? new Date(experienceForm.startDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setExperienceForm({...experienceForm, startDate: e.target.value})}
                  className={inputClass.replace('pl-10', 'pl-3')}
                />
              </div>
              
              <div>
                <label className={labelClass}>End Date</label>
                <input
                  type="date"
                  value={experienceForm.endDate ? new Date(experienceForm.endDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setExperienceForm({...experienceForm, endDate: e.target.value})}
                  className={inputClass.replace('pl-10', 'pl-3')}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className={labelClass}>Description</label>
              <textarea
                value={experienceForm.description || ''}
                onChange={(e) => setExperienceForm({...experienceForm, description: e.target.value})}
                className={textareaClass}
                rows={3}
                placeholder="Describe your responsibilities and achievements"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addExperience}
                className={buttonPrimary}
              >
                {editingExperienceIndex >= 0 ? 'Update Experience' : 'Add Experience'}
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {formData.experience && formData.experience.map((exp, index) => (
              <div key={index} className={cardClass}>
                <div className="flex justify-between items-start mb-2">
                  <div className={cx("font-semibold", colors.text)}>
                    {exp.position}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => editExperience(index)}
                      className={iconButtonClass}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className={iconButtonClass}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className={colors.textSecondary}>{exp.company}</div>
                {(exp.startDate || exp.endDate) && (
                  <div className={cx("text-sm mt-1", colors.textMuted)}>
                    {exp.startDate && new Date(exp.startDate).toLocaleDateString()} 
                    {exp.startDate && exp.endDate && " - "}
                    {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                  </div>
                )}
                {exp.description && (
                  <div className={cx("mt-2 text-sm", colors.textSecondary)}>
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className={formSectionClass}>
          <div className="flex items-center mb-4">
            <CheckCircle className={cx("mr-2", colors.primary)} size={24} />
            <h3 className={sectionHeaderClass}>Skills</h3>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className={inputClass.replace('pl-10', 'pl-3')}
            />
            <button
              type="button"
              onClick={() => addItem('skills', newSkill, setNewSkill)}
              className={buttonPrimary}
            >
              <Plus size={24} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills && formData.skills.map((skill, index) => (
              <span key={index} className={tagClass}>
                {skill}
                <button
                  type="button"
                  onClick={() => removeItem('skills', index)}
                  className="hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Languages Section */}
        <div className={formSectionClass}>
          <div className="flex items-center mb-4">
            <Languages className={cx("mr-2", colors.primary)} size={24} />
            <h3 className={sectionHeaderClass}>Languages</h3>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add a language"
              className={inputClass.replace('pl-10', 'pl-3')}
            />
            <button
              type="button"
              onClick={() => addItem('languages', newLanguage, setNewLanguage)}
              className={buttonPrimary}
            >
              <Plus size={24} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.languages && formData.languages.map((language, index) => (
              <span key={index} className={tagClass}>
                {language}
                <button
                  type="button"
                  onClick={() => removeItem('languages', index)}
                  className="hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </span>
            ))}
          </div>
        </div>
        
        {/* Certifications Section */}
        <div className={formSectionClass}>
          <div className="flex items-center mb-4">
            <Award className={cx("mr-2", colors.primary)} size={24} />
            <h3 className={sectionHeaderClass}>Certifications</h3>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="Add a certification"
              className={inputClass.replace('pl-10', 'pl-3')}
            />
            <button
              type="button"
              onClick={() => addItem('certifications', newCertification, setNewCertification)}
              className={buttonPrimary}
            >
              <Plus size={24} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.certifications && formData.certifications.map((certification, index) => (
              <span key={index} className={tagClass}>
                {certification}
                <button
                  type="button"
                  onClick={() => removeItem('certifications', index)}
                  className="hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className={formSectionClass}>
          <div className="flex items-center mb-4">
            <Award className={cx("mr-2", colors.primary)} size={24} />
            <h3 className={sectionHeaderClass}>Achievements</h3>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              placeholder="Add an achievement"
              className={inputClass.replace('pl-10', 'pl-3')}
            />
            <button
              type="button"
              onClick={() => addItem('achievements', newAchievement, setNewAchievement)}
              className={buttonPrimary}
            >
              <Plus size={24} />
            </button>
          </div>
          <div className="space-y-2">
            {formData.achievements && formData.achievements.map((achievement, index) => (
              <div
                key={index}
                className={cx("p-3 rounded-lg flex items-center justify-between", 
                  isDark ? "bg-purple-900 text-purple-200" : "bg-purple-50 text-purple-700")}
              >
                <span>{achievement}</span>
                <button
                  type="button"
                  onClick={() => removeItem('achievements', index)}
                  className="hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className={buttonSecondary}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={buttonPrimary}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileUpdateForm;