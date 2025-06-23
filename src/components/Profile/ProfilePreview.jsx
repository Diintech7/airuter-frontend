"use client"

import { useState } from "react"
import { Edit, Check, ArrowLeft, User, Mail, Phone, MapPin, Briefcase } from "lucide-react"
import { useThemeStyles } from "../hooks/useThemeStyles"

const ProfilePreview = ({ profileData, onEdit, onSubmit, onBack }) => {
  const { colors, styles, cx, isDark } = useThemeStyles()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(profileData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSection = (title, content, IconComponent) => {
    if (!content || (Array.isArray(content) && content.length === 0)) return null

    return (
      <div className={cx("mb-6 p-4 rounded-lg", colors.bgCard)}>
        <div className="flex items-center mb-3">
          <IconComponent size={20} className={cx("mr-2", colors.primary)} />
          <h3 className={cx("text-lg font-semibold", colors.text)}>{title}</h3>
        </div>
        <div className={cx("text-sm", colors.textSecondary)}>
          {typeof content === "string" ? (
            <p>{content}</p>
          ) : Array.isArray(content) ? (
            content.map((item, index) => (
              <div key={index} className="mb-2">
                {typeof item === "string" ? (
                  <span
                    className={cx(
                      "inline-block px-2 py-1 rounded mr-2 mb-1",
                      isDark ? "bg-purple-900 text-purple-200" : "bg-purple-100 text-purple-800",
                    )}
                  >
                    {item}
                  </span>
                ) : (
                  <div
                    className={cx(
                      "p-3 rounded border-l-4",
                      isDark ? "bg-gray-700 border-purple-500" : "bg-gray-50 border-purple-300",
                    )}
                  >
                    {item.degree && <div className="font-medium">{item.degree}</div>}
                    {item.institution && <div>{item.institution}</div>}
                    {item.company && (
                      <div className="font-medium">
                        {item.position} at {item.company}
                      </div>
                    )}
                    {item.startDate && (
                      <div className="text-xs mt-1">
                        {item.startDate} - {item.endDate || "Present"}
                      </div>
                    )}
                    {item.description && <div className="mt-2">{item.description}</div>}
                  </div>
                )}
              </div>
            ))
          ) : (
            <pre className="whitespace-pre-wrap">{JSON.stringify(content, null, 2)}</pre>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cx("max-w-4xl mx-auto p-8", colors.bg)}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className={cx("flex items-center mr-4", colors.textSecondary, "hover:" + colors.text)}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <div>
            <h1 className={cx("text-3xl font-bold", colors.text)}>Review Your Profile</h1>
            <p className={cx("mt-2", colors.textSecondary)}>
              Please review the information below and make any necessary edits before submitting
            </p>
          </div>
        </div>
      </div>

      <div className={cx("rounded-xl shadow-lg p-8 mb-8", colors.bgCard)}>
        {/* Header Section */}
        <div className="flex items-center mb-8">
          <div
            className={cx(
              "w-20 h-20 rounded-full flex items-center justify-center mr-6",
              isDark ? "bg-purple-700" : "bg-purple-600",
            )}
          >
            <span className="text-2xl font-bold text-white">
              {profileData.firstName?.[0]}
              {profileData.lastName?.[0]}
            </span>
          </div>
          <div>
            <h2 className={cx("text-2xl font-bold", colors.text)}>
              {profileData.firstName} {profileData.lastName}
            </h2>
            {profileData.title && <p className={cx("text-lg", colors.textSecondary)}>{profileData.title}</p>}
            <div className="flex items-center gap-4 mt-2">
              {profileData.email && (
                <div className="flex items-center">
                  <Mail size={16} className={cx("mr-1", colors.textMuted)} />
                  <span className={cx("text-sm", colors.textSecondary)}>{profileData.email}</span>
                </div>
              )}
              {profileData.phone && (
                <div className="flex items-center">
                  <Phone size={16} className={cx("mr-1", colors.textMuted)} />
                  <span className={cx("text-sm", colors.textSecondary)}>{profileData.phone}</span>
                </div>
              )}
              {profileData.location && (
                <div className="flex items-center">
                  <MapPin size={16} className={cx("mr-1", colors.textMuted)} />
                  <span className={cx("text-sm", colors.textSecondary)}>{profileData.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {renderSection("Professional Summary", profileData.summary, User)}
            {renderSection("Work Experience", profileData.experience, Briefcase)}
            {renderSection("Education", profileData.education, User)}
          </div>
          <div>
            {renderSection("Skills", profileData.skills, User)}
            {renderSection("Languages", profileData.languages, User)}
            {renderSection("Certifications", profileData.certifications, User)}
            {renderSection("Achievements", profileData.achievements, User)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onEdit}
          className={cx(
            "flex items-center px-6 py-3 rounded-lg border transition-colors",
            isDark
              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-50",
          )}
        >
          <Edit size={20} className="mr-2" />
          Edit Profile
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={cx(
            "flex items-center px-8 py-3 rounded-lg text-white transition-colors",
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : isDark
                ? "bg-purple-700 hover:bg-purple-600"
                : "bg-purple-600 hover:bg-purple-700",
          )}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Check size={20} className="mr-2" />
              Submit Profile
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ProfilePreview
