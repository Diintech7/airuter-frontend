import React from 'react';
import { Edit2, Mail, Phone, MapPin, Briefcase, Book, Award, Globe, Languages, CheckCircle, Calendar, Building } from 'lucide-react';
import { useThemeStyles } from '../hooks/useThemeStyles'; // Adjust the import path if needed

const ProfileDisplay = ({ profileData, onUpdateClick }) => {
  const { isDark, colors, styles, cx } = useThemeStyles();
  
  return (
    <div className={cx("max-w-7xl mx-auto min-h-screen", colors.bg)}>
      {/* Header/Hero Section */}
      <div className={cx("bg-gradient-to-r py-12 px-8 mb-8", isDark ? "from-purple-900 to-purple-950" : "from-purple-700 to-purple-800")} style={{color: "white"}}>
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div className="flex items-center gap-8">
            <div className={cx("w-32 h-32 rounded-full flex items-center justify-center shadow-lg", isDark ? "bg-gray-800" : "bg-white")}>
              <span className={cx("text-5xl font-bold", isDark ? "text-purple-400" : "text-purple-700")}>
                {`${profileData.firstName[0]}${profileData.lastName[0]}`}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {`${profileData.firstName} ${profileData.lastName}`}
              </h1>
              <h2 className={cx("text-2xl mb-4", isDark ? "text-purple-300" : "text-purple-200")}>{profileData.title}</h2>
              <div className={cx("flex items-center gap-6", isDark ? "text-purple-200" : "text-purple-100")}>
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <span>{profileData.email}</span>
                </div>
                {profileData.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    <span>{profileData.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onUpdateClick}
            className={cx(
              "px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg",
              isDark 
                ? "bg-gray-800 text-purple-400 hover:bg-gray-700" 
                : "bg-white text-purple-700 hover:bg-purple-50"
            )}
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 pb-12">
        {/* Summary Section */}
        <div className={cx("rounded-xl shadow-md p-8 mb-8", colors.bgCard)}>
          <h3 className={cx("text-xl font-semibold mb-4", colors.text)}>Professional Summary</h3>
          <p className={cx("leading-relaxed", colors.textSecondary)}>{profileData.summary}</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content - Experience & Education */}
          <div className="col-span-2 space-y-8">
            {/* Experience Section */}
            <div className={cx("rounded-xl shadow-md p-8", colors.bgCard)}>
              <h3 className={cx("text-xl font-semibold mb-6 flex items-center gap-2", colors.text)}>
                <Briefcase className={colors.primary} size={24} />
                Work Experience
              </h3>
              <div className="space-y-8">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className={`relative pl-8 ${index !== profileData.experience.length - 1 ? `pb-8 border-l-2 ${isDark ? 'border-purple-900' : 'border-purple-100'}` : ''}`}>
                    <div className={cx("absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full", isDark ? "bg-purple-700" : "bg-purple-600")}></div>
                    <div className={cx("rounded-lg p-6", isDark ? "bg-gray-700" : "bg-gray-50")}>
                      <h4 className={cx("text-lg font-semibold mb-1", colors.text)}>{exp.position}</h4>
                      <div className={cx("flex items-center gap-2 mb-2", colors.primary)}>
                        <Building size={16} />
                        <span>{exp.company}</span>
                      </div>
                      <div className={cx("flex items-center gap-2 text-sm mb-3", colors.textMuted)}>
                        <Calendar size={16} />
                        <span>
                          {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - 
                          {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present'}
                        </span>
                      </div>
                      <p className={colors.textSecondary}>{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className={cx("rounded-xl shadow-md p-8", colors.bgCard)}>
              <h3 className={cx("text-xl font-semibold mb-6 flex items-center gap-2", colors.text)}>
                <Book className={colors.primary} size={24} />
                Education
              </h3>
              <div className="grid gap-6">
                {profileData.education.map((edu, index) => (
                  <div key={index} className={cx("rounded-lg p-6", isDark ? "bg-gray-700" : "bg-gray-50")}>
                    <h4 className={cx("text-lg font-semibold mb-1", colors.text)}>{edu.degree}</h4>
                    <p className={cx("mb-2", colors.primary)}>{edu.institution}</p>
                    <div className={cx("flex items-center gap-2 text-sm", colors.textMuted)}>
                      <Calendar size={16} />
                      <span>{edu.field} • {edu.yearOfCompletion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Skills, Languages, etc. */}
          <div className="space-y-8">
            {/* Skills Section */}
            <div className={cx("rounded-xl shadow-md p-8", colors.bgCard)}>
              <h3 className={cx("text-xl font-semibold mb-4 flex items-center gap-2", colors.text)}>
                <CheckCircle className={colors.primary} size={24} />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={cx(
                      "px-4 py-2 rounded-lg text-sm font-medium",
                      isDark ? "bg-purple-900 text-purple-300" : "bg-purple-50 text-purple-700"
                    )}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages Section */}
            <div className={cx("rounded-xl shadow-md p-8", colors.bgCard)}>
              <h3 className={cx("text-xl font-semibold mb-4 flex items-center gap-2", colors.text)}>
                <Languages className={colors.primary} size={24} />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.languages.map((language, index) => (
                  <span
                    key={index}
                    className={cx(
                      "px-4 py-2 rounded-lg text-sm font-medium",
                      isDark ? "bg-blue-900 text-blue-300" : "bg-blue-50 text-blue-700"
                    )}
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div className={cx("rounded-xl shadow-md p-8", colors.bgCard)}>
              <h3 className={cx("text-xl font-semibold mb-4 flex items-center gap-2", colors.text)}>
                <Award className={colors.primary} size={24} />
                Certifications
              </h3>
              <div className="space-y-3">
                {profileData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={cx("w-2 h-2 rounded-full mt-2", isDark ? "bg-purple-500" : "bg-purple-600")}></div>
                    <span className={colors.textSecondary}>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Section */}
            <div className={cx("rounded-xl shadow-md p-8", colors.bgCard)}>
              <h3 className={cx("text-xl font-semibold mb-4 flex items-center gap-2", colors.text)}>
                <Globe className={colors.primary} size={24} />
                Achievements
              </h3>
              <div className="space-y-3">
                {profileData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={cx("w-2 h-2 rounded-full mt-2", isDark ? "bg-purple-500" : "bg-purple-600")}></div>
                    <span className={colors.textSecondary}>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;