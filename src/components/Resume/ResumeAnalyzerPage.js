"use client"

import { useState } from "react"
import { FileText, Upload, AlertCircle } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import DetailedAnalysis from "./DetailedResumeAnalysis"
import SummaryAnalysis from "../SummaryAnalysis"

const ResumeAnalyzerPage = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    keywords: "",
    jobDescription: "",
  })
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showDetailed, setShowDetailed] = useState(false)

  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Theme colors
  const textColor = isDark ? "text-white" : "text-gray-900"
  const subTextColor = isDark ? "text-gray-300" : "text-gray-600"
  const cardBg = isDark ? "bg-gray-800" : "bg-white"
  const pageBg = isDark ? "bg-gray-900" : "bg-gray-50"
  const inputBg = isDark ? "bg-gray-700" : "bg-white"
  const inputBorder = isDark ? "border-gray-600" : "border-gray-300"
  const inputText = isDark ? "text-white" : "text-gray-900"
  const uploadBg = isDark ? "bg-gray-700" : "bg-gray-50"
  const uploadBorder = isDark ? "border-gray-600" : "border-gray-300"
  const uploadText = isDark ? "text-purple-400" : "text-purple-600"
  const errorBg = isDark ? "bg-red-900/50" : "bg-red-50"
  const errorBorder = isDark ? "border-red-700" : "border-red-200"
  const errorText = isDark ? "text-red-300" : "text-red-700"
  const buttonBg = isDark ? "bg-purple-700 hover:bg-purple-600" : "bg-purple-600 hover:bg-purple-700"
  const secondaryButtonBg = isDark ? "bg-purple-800 hover:bg-purple-700" : "bg-purple-100 hover:bg-purple-200"
  const secondaryButtonText = isDark ? "text-white" : "text-purple-600"

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setFileName(selectedFile.name)
      setError("")
    } else {
      setError("Please upload a PDF file")
      setFile(null)
      setFileName("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a PDF file")
      return
    }

    setLoading(true)
    setError("")

    const formDataToSend = new FormData()
    formDataToSend.append("resume", file, file.name)
    formDataToSend.append("jobTitle", formData.jobTitle)
    formDataToSend.append("keywords", formData.keywords)
    formDataToSend.append("jobDescription", formData.jobDescription)

    try {
      const response = await fetch("https://airuter-backend.onrender.com/api/resume/analyze-pdf", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const result = await response.json()
      // Store only the analysis data, not the entire response
      setAnalysis(result.data)
    } catch (err) {
      setError(err.message || "Error analyzing resume")
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className={`min-h-screen ${pageBg} py-8`}>
      <div className="max-w-7xl mx-auto p-6">
        <div className={`${cardBg} rounded-lg shadow-xl p-8`}>
          <div className="flex items-center gap-3 mb-8">
            <FileText className={`h-8 w-8 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
            <h1 className={`text-3xl font-bold ${textColor}`}>Resume ATS Analyzer</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Section */}
            <div className={`border-2 border-dashed ${uploadBorder} rounded-lg p-6 ${uploadBg}`}>
              <div className="flex flex-col items-center">
                <Upload className={`h-12 w-12 ${isDark ? "text-gray-400" : "text-gray-400"} mb-4`} />
                <div className="text-center">
                  <label className="cursor-pointer">
                    <span className={`${uploadText} hover:opacity-80 font-medium`}>Click to upload</span>
                    <span className={`${subTextColor}`}> or drag and drop</span>
                    <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
                  </label>
                  <p className={`text-sm ${subTextColor} mt-1`}>PDF (up to 10MB)</p>
                </div>
                {fileName && (
                  <div className={`mt-4 text-sm ${textColor} flex items-center gap-2`}>
                    <FileText className="h-4 w-4" />
                    {fileName}
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Job Title</label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className={`w-full px-4 py-2 border ${inputBorder} ${inputBg} ${inputText} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className={`w-full px-4 py-2 border ${inputBorder} ${inputBg} ${inputText} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200`}
                  placeholder="python, react, agile, etc."
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${textColor} mb-2`}>Job Description</label>
              <textarea
                value={formData.jobDescription}
                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                className={`w-full px-4 py-2 border ${inputBorder} ${inputBg} ${inputText} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32 transition-colors duration-200`}
                placeholder="Paste the job description here..."
                required
              />
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className={`w-full ${isDark ? "bg-gray-600" : "bg-gray-200"} rounded-full h-2`}>
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className={`${errorBg} border ${errorBorder} ${errorText} px-4 py-3 rounded relative`}>
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full ${buttonBg} text-white py-3 px-4 rounded-md transition-colors duration-200 ${loading || !file ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </form>

          {/* Analysis Results */}
          {analysis && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${textColor}`}>Analysis Results</h2>
                <button
                  onClick={() => setShowDetailed(!showDetailed)}
                  className={`${secondaryButtonBg} ${secondaryButtonText} px-4 py-2 rounded-md transition-colors duration-200`}
                >
                  {showDetailed ? "Show Summary" : "View Detailed Analysis"}
                </button>
              </div>

              {showDetailed ? <DetailedAnalysis analysis={analysis} /> : <SummaryAnalysis analysis={analysis} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeAnalyzerPage
