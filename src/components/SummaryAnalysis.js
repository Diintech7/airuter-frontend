"use client"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const SummaryAnalysis = ({ analysis }) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Theme colors
  const textColor = isDark ? "text-white" : "text-gray-900"
  const subTextColor = isDark ? "text-gray-300" : "text-gray-600"
  const cardBg = isDark ? "bg-gray-800" : "bg-white"
  const sectionBg = isDark ? "bg-gray-700" : "bg-gray-50"
  const itemBg = isDark ? "bg-gray-600" : "bg-white"
  const borderColor = isDark ? "border-gray-600" : "border-gray-100"

  // Add a check for analysis existence
  if (!analysis) return null

  const getScoreColor = (score) => {
    if (score >= 80) return isDark ? "text-green-400" : "text-green-600"
    if (score >= 60) return isDark ? "text-yellow-400" : "text-yellow-600"
    return isDark ? "text-red-400" : "text-red-600"
  }

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className={`h-5 w-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
    if (score >= 60) return <AlertCircle className={`h-5 w-5 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />
    return <XCircle className={`h-5 w-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
  }

  // Create a formatted feedback array that includes all scores
  const formattedFeedback = [
    {
      category: "Overall Match",
      score: analysis.overallScore || analysis.matchPercentage,
      message: "Overall match with job requirements",
    },
    {
      category: "Skills Match",
      score: analysis.skillsScore,
      message:
        analysis.feedback?.find((f) => f.category === "Skills Match")?.message ||
        "Assessment of technical and professional skills",
    },
    {
      category: "Experience",
      score: analysis.experienceScore,
      message:
        analysis.feedback?.find((f) => f.category === "Experience")?.message ||
        "Evaluation of relevant work experience",
    },
    {
      category: "Education",
      score: analysis.educationScore,
      message: "Assessment of educational qualifications",
    },
    {
      category: "Keywords Match",
      score: analysis.keywordsScore,
      message: "Match rate with job-specific keywords",
    },
    {
      category: "Format & Structure",
      score: analysis.formatScore,
      message: "Resume formatting and organization",
    },
  ]

  return (
    <div className={`${sectionBg} p-6 rounded-lg`}>
      {/* Overall Score */}
      <div className="text-center mb-8">
        <div className="text-4xl font-bold mb-2">
          <span className={getScoreColor(analysis.totalScore || analysis.score || analysis.overallScore)}>
            {(analysis.totalScore || analysis.score || analysis.overallScore).toFixed(1)}%
          </span>
        </div>
        <p className={subTextColor}>Total Score</p>
      </div>

      {/* Score Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formattedFeedback.map((item, index) => (
          <div key={index} className={`${itemBg} p-4 rounded-lg shadow-sm border ${borderColor}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium ${textColor}`}>{item.category}</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${getScoreColor(item.score)}`}>{item.score?.toFixed(1)}%</span>
                {getScoreIcon(item.score)}
              </div>
            </div>
            <p className={`text-sm ${subTextColor}`}>{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SummaryAnalysis
