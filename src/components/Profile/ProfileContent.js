"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import ProfileDisplay from "./ProfileDisplay"
import ProfileSetup from "./ProfileSetup"
import ProfileUpdateForm from "./ProfileUpdate"
import { useThemeStyles } from "../hooks/useThemeStyles"

const ProfileContent = () => {
  const { colors, styles, cx, isDark } = useThemeStyles()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://airuter-backend.onrender.com/api/profile", {
        headers: {
          Authorization: `Bearer ${Cookies.get("usertoken")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setProfileData(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (updatedData) => {
    try {
      setError(null)
      const response = await fetch("https://airuter-backend.onrender.com/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("usertoken")}`,
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      await fetchProfileData()
      setIsEditing(false)
      setShowSetup(false)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleSetupComplete = async (profileData) => {
    await handleProfileUpdate(profileData)
  }

  const handleCreateProfile = () => {
    setShowSetup(true)
  }

  const handleBackToProfile = () => {
    setShowSetup(false)
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className={cx("flex items-center justify-center h-full", colors.bg)}>
        <div
          className={cx(
            "animate-spin rounded-full h-12 w-12 border-b-2",
            isDark ? "border-purple-400" : "border-purple-600",
          )}
        ></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cx("text-center p-8", colors.bg)}>
        <div className={cx("text-lg mb-4", colors.errorText)}>Error: {error}</div>
        <button
          onClick={fetchProfileData}
          className={cx(
            "px-4 py-2 text-white rounded-lg hover:bg-purple-700 transition-colors",
            isDark ? "bg-purple-700" : "bg-purple-600",
          )}
        >
          Retry
        </button>
      </div>
    )
  }

  // Show setup flow if no profile exists or user clicked create profile
  if (!profileData || showSetup) {
    return (
      <ProfileSetup
        initialData={profileData}
        onComplete={handleSetupComplete}
        onBack={profileData ? handleBackToProfile : null}
        onSkip={() => navigate("/dashboard")}
      />
    )
  }

  // Show edit form
  if (isEditing) {
    return (
      <ProfileUpdateForm
        initialData={profileData}
        onSubmit={handleProfileUpdate}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  // Show profile display
  return (
    <ProfileDisplay
      profileData={profileData}
      onUpdateClick={() => setIsEditing(true)}
      onCreateNewClick={handleCreateProfile}
    />
  )
}

export default ProfileContent
