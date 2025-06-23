"use client"

import { useState } from "react"
import { ArrowLeft, Upload, Check, Loader, FileText } from "lucide-react"
import Cookies from "js-cookie"
import { useThemeStyles } from "../hooks/useThemeStyles"

const ResumeUpload = ({ onBack, onSubmit, initialData }) => {
  const { colors, styles, cx, isDark } = useThemeStyles()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.type === "application/msword" ||
        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit")
        return
      }
      setFile(selectedFile)
      setError(null)
      setProgress(0)
    } else {
      setError("Please select a valid PDF or Word document")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setProgress(0)

    const formData = new FormData()
    formData.append("resume", file)

    const token = Cookies.get("usertoken")
    if (!token) {
      setError("Authentication token not found. Please log in again.")
      setUploading(false)
      return
    }

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("https://airuter-backend.onrender.com/api/profile/resume", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      clearInterval(progressInterval)
      setProgress(100)

      const contentType = response.headers.get("content-type")
      let data

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        throw new Error("Invalid response format from server")
      }

      if (!response.ok) {
        throw new Error(data.message || "Upload failed")
      }

      if (data.success && data.profile) {
        // Pass the parsed data to the parent component for preview
        setTimeout(() => {
          onSubmit({
            ...initialData,
            ...data.profile,
            isComplete: true,
          })
        }, 500)
      } else {
        throw new Error(data.message || "Upload failed")
      }
    } catch (error) {
      console.error("Resume upload error:", error)
      setError(error.message || "Failed to upload resume. Please try again.")
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cx("max-w-2xl mx-auto p-8", colors.bgCard, "rounded-xl")}>
      <button onClick={onBack} className={cx("flex items-center mb-8", colors.textSecondary, "hover:" + colors.text)}>
        <ArrowLeft size={20} className="mr-2" />
        Back to options
      </button>

      <div className="text-center mb-8">
        <div
          className={cx(
            "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
            isDark ? "bg-green-800" : "bg-green-100",
          )}
        >
          <FileText className={cx(isDark ? "text-green-300" : "text-green-600")} size={32} />
        </div>
        <h2 className={cx("text-2xl font-bold mb-2", colors.text)}>Upload Your Resume</h2>
        <p className={cx("text-sm", colors.textSecondary)}>
          We'll extract your information and let you review it before saving
        </p>
      </div>

      {error && (
        <div className={cx("p-4 rounded-lg mb-6", isDark ? "bg-red-900 text-red-200" : "bg-red-50 text-red-800")}>
          {error}
        </div>
      )}

      <div
        className={cx(
          "border-2 border-dashed rounded-lg p-8 text-center mb-6",
          file ? colors.border : cx(colors.border, "hover:border-purple-400"),
        )}
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
          id="resume-upload"
          disabled={uploading}
        />

        {!file ? (
          <div>
            <Upload className={cx("mx-auto mb-4", colors.textMuted)} size={48} />
            <label
              htmlFor="resume-upload"
              className={cx("cursor-pointer font-medium", colors.primary, "hover:underline")}
            >
              Click to upload your resume
            </label>
            <p className={cx("mt-2 text-sm", colors.textMuted)}>Supported formats: PDF, DOC, DOCX (max 10MB)</p>
          </div>
        ) : (
          <div>
            <Check className="mx-auto text-green-500 mb-4" size={48} />
            <p className={cx("font-medium mb-2", colors.text)}>{file.name}</p>
            <p className={cx("text-sm mb-4", colors.textMuted)}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <button
              onClick={() => {
                setFile(null)
                setError(null)
                setProgress(0)
              }}
              className={cx("text-sm", colors.textSecondary, "hover:" + colors.text)}
              disabled={uploading}
            >
              Choose different file
            </button>
          </div>
        )}
      </div>

      {progress > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className={cx("text-sm", colors.text)}>Processing resume...</span>
            <span className={cx("text-sm", colors.textMuted)}>{progress}%</span>
          </div>
          <div className={cx("w-full rounded-full h-2", colors.bgSection)}>
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={cx(
            "w-full py-3 rounded-lg text-white transition-colors duration-200 flex items-center justify-center",
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : isDark
                ? "bg-green-700 hover:bg-green-600"
                : "bg-green-600 hover:bg-green-700",
          )}
        >
          {uploading ? (
            <>
              <Loader className="animate-spin mr-2" size={20} />
              Processing Resume...
            </>
          ) : (
            <>
              <Upload className="mr-2" size={20} />
              Process & Continue
            </>
          )}
        </button>
      )}

      <div
        className={cx("mt-6 p-4 rounded-lg text-sm", isDark ? "bg-blue-900 text-blue-200" : "bg-blue-50 text-blue-800")}
      >
        <p className="font-medium mb-2">What happens next?</p>
        <ul className="space-y-1 text-xs">
          <li>• We'll extract information from your resume</li>
          <li>• You'll see a preview of all extracted data</li>
          <li>• You can edit any information before saving</li>
          <li>• Your resume file will be securely stored</li>
        </ul>
      </div>
    </div>
  )
}

export default ResumeUpload
