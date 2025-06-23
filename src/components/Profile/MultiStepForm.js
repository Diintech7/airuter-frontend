"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Plus, X, Check } from "lucide-react"
import { useThemeStyles } from "../hooks/useThemeStyles"

const MultiStepForm = ({ onBack, onSubmit, initialData }) => {
  const { colors, styles, cx, isDark } = useThemeStyles()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState(
    initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      title: "",
      summary: "",
      yearsOfExperience: "",
      education: [
        {
          degree: "",
          institution: "",
          yearOfCompletion: "",
          field: "",
        },
      ],
      experience: [
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      skills: [""],
      languages: [""],
      certifications: [""],
      achievements: [""],
    },
  )

  const steps = [
    "Personal Information",
    "Professional Summary",
    "Education",
    "Work Experience",
    "Skills",
    "Additional Information",
  ]

  const addArrayField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    })
  }

  const removeArrayField = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    })
  }

  const updateArrayField = (field, index, value) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({
      ...formData,
      [field]: newArray,
    })
  }

  const handleSubmit = () => {
    // Clean up empty array fields
    const cleanedData = {
      ...formData,
      skills: formData.skills.filter((skill) => skill.trim()),
      languages: formData.languages.filter((lang) => lang.trim()),
      certifications: formData.certifications.filter((cert) => cert.trim()),
      achievements: formData.achievements.filter((achievement) => achievement.trim()),
      education: formData.education.filter((edu) => edu.degree || edu.institution),
      experience: formData.experience.filter((exp) => exp.company || exp.position),
      isComplete: true,
    }

    onSubmit(cleanedData)
  }

  const renderFormFields = () => {
    const inputClass = cx(
      "w-full px-4 py-2 border rounded-lg",
      isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900",
    )

    const labelClass = cx("block text-sm font-medium mb-2", colors.text)

    switch (step) {
      case 0: // Personal Information
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={inputClass}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={inputClass}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass}
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClass}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={inputClass}
                placeholder="Enter your location"
              />
            </div>
          </div>
        )

      case 1: // Professional Summary
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Professional Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={inputClass}
                placeholder="e.g., Software Engineer, Marketing Manager"
              />
            </div>
            <div>
              <label className={labelClass}>Years of Experience</label>
              <input
                type="number"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                className={inputClass}
                min="0"
                placeholder="Enter years of experience"
              />
            </div>
            <div>
              <label className={labelClass}>Professional Summary</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className={cx(inputClass, "min-h-[120px]")}
                rows={4}
                placeholder="Describe your professional background, key skills, and career objectives..."
              />
            </div>
          </div>
        )

      case 2: // Education
        return (
          <div className="space-y-6">
            {formData.education.map((edu, index) => (
              <div key={index} className={cx("p-4 border rounded-lg", colors.bgCard, colors.border)}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={cx("font-medium", colors.text)}>Education #{index + 1}</h3>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField("education", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...formData.education]
                        newEducation[index] = { ...edu, degree: e.target.value }
                        setFormData({ ...formData, education: newEducation })
                      }}
                      className={inputClass}
                      placeholder="Bachelor of Science"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Field of Study</label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => {
                        const newEducation = [...formData.education]
                        newEducation[index] = { ...edu, field: e.target.value }
                        setFormData({ ...formData, education: newEducation })
                      }}
                      className={inputClass}
                      placeholder="Computer Science"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className={labelClass}>Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const newEducation = [...formData.education]
                      newEducation[index] = { ...edu, institution: e.target.value }
                      setFormData({ ...formData, education: newEducation })
                    }}
                    className={inputClass}
                    placeholder="University Name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Year of Completion</label>
                  <input
                    type="number"
                    value={edu.yearOfCompletion}
                    onChange={(e) => {
                      const newEducation = [...formData.education]
                      newEducation[index] = { ...edu, yearOfCompletion: e.target.value }
                      setFormData({ ...formData, education: newEducation })
                    }}
                    className={inputClass}
                    min="1900"
                    max="2030"
                    placeholder="2023"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("education")}
              className={cx("flex items-center", colors.primary, "hover:underline")}
            >
              <Plus size={20} className="mr-2" />
              Add Education
            </button>
          </div>
        )

      case 3: // Work Experience
        return (
          <div className="space-y-6">
            {formData.experience.map((exp, index) => (
              <div key={index} className={cx("p-4 border rounded-lg", colors.bgCard, colors.border)}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={cx("font-medium", colors.text)}>Experience #{index + 1}</h3>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField("experience", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExperience = [...formData.experience]
                        newExperience[index] = { ...exp, company: e.target.value }
                        setFormData({ ...formData, experience: newExperience })
                      }}
                      className={inputClass}
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => {
                        const newExperience = [...formData.experience]
                        newExperience[index] = { ...exp, position: e.target.value }
                        setFormData({ ...formData, experience: newExperience })
                      }}
                      className={inputClass}
                      placeholder="Job Title"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => {
                        const newExperience = [...formData.experience]
                        newExperience[index] = { ...exp, startDate: e.target.value }
                        setFormData({ ...formData, experience: newExperience })
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => {
                        const newExperience = [...formData.experience]
                        newExperience[index] = { ...exp, endDate: e.target.value }
                        setFormData({ ...formData, experience: newExperience })
                      }}
                      className={inputClass}
                    />
                    <p className={cx("text-xs mt-1", colors.textMuted)}>Leave empty if current position</p>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => {
                      const newExperience = [...formData.experience]
                      newExperience[index] = { ...exp, description: e.target.value }
                      setFormData({ ...formData, experience: newExperience })
                    }}
                    className={cx(inputClass, "min-h-[100px]")}
                    rows={4}
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("experience")}
              className={cx("flex items-center", colors.primary, "hover:underline")}
            >
              <Plus size={20} className="mr-2" />
              Add Experience
            </button>
          </div>
        )

      case 4: // Skills
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Skills</label>
              <p className={cx("text-sm mb-4", colors.textMuted)}>Add your technical and professional skills</p>
            </div>
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateArrayField("skills", index, e.target.value)}
                  className={cx("flex-1", inputClass)}
                  placeholder="Enter a skill"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField("skills", index)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("skills")}
              className={cx("flex items-center", colors.primary, "hover:underline")}
            >
              <Plus size={20} className="mr-2" />
              Add Skill
            </button>
          </div>
        )

      case 5: // Additional Information
        return (
          <div className="space-y-8">
            {/* Languages */}
            <div>
              <label className={labelClass}>Languages</label>
              <div className="space-y-2">
                {formData.languages.map((language, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={language}
                      onChange={(e) => updateArrayField("languages", index, e.target.value)}
                      className={cx("flex-1", inputClass)}
                      placeholder="Enter a language"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("languages", index)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("languages")}
                  className={cx("flex items-center text-sm", colors.primary, "hover:underline")}
                >
                  <Plus size={16} className="mr-1" />
                  Add Language
                </button>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <label className={labelClass}>Certifications</label>
              <div className="space-y-2">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={cert}
                      onChange={(e) => updateArrayField("certifications", index, e.target.value)}
                      className={cx("flex-1", inputClass)}
                      placeholder="Enter a certification"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("certifications", index)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("certifications")}
                  className={cx("flex items-center text-sm", colors.primary, "hover:underline")}
                >
                  <Plus size={16} className="mr-1" />
                  Add Certification
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <label className={labelClass}>Achievements</label>
              <div className="space-y-2">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => updateArrayField("achievements", index, e.target.value)}
                      className={cx("flex-1", inputClass)}
                      placeholder="Enter an achievement"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("achievements", index)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("achievements")}
                  className={cx("flex items-center text-sm", colors.primary, "hover:underline")}
                >
                  <Plus size={16} className="mr-1" />
                  Add Achievement
                </button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={cx("max-w-3xl mx-auto p-8", colors.bgCard, "rounded-xl")}>
      <button onClick={onBack} className={cx("flex items-center mb-8", colors.textSecondary, "hover:" + colors.text)}>
        <ArrowLeft size={20} className="mr-2" />
        Back to options
      </button>

      <div className="mb-8">
        <h2 className={cx("text-2xl font-bold mb-4", colors.text)}>{steps[step]}</h2>
        <div className="flex gap-2 mb-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cx(
                "h-2 flex-1 rounded-full transition-colors",
                index <= step ? (isDark ? "bg-purple-500" : "bg-purple-600") : colors.bgSection,
              )}
            />
          ))}
        </div>
        <p className={cx("text-sm", colors.textMuted)}>
          Step {step + 1} of {steps.length} - All fields are optional
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {renderFormFields()}

        <div className="flex justify-between items-center pt-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className={cx(
                "flex items-center px-4 py-2 rounded-lg border transition-colors",
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50",
              )}
            >
              <ArrowLeft size={20} className="mr-2" />
              Previous
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => {
              if (step === steps.length - 1) {
                handleSubmit()
              } else {
                setStep(step + 1)
              }
            }}
            className={cx(
              "flex items-center px-6 py-2 rounded-lg text-white transition-colors",
              isDark ? "bg-purple-700 hover:bg-purple-600" : "bg-purple-600 hover:bg-purple-700",
            )}
          >
            {step === steps.length - 1 ? (
              <>
                <Check size={20} className="mr-2" />
                Complete Profile
              </>
            ) : (
              <>
                Next
                <ArrowRight size={20} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MultiStepForm
