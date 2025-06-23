"use client"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useTheme } from "../../context/ThemeContext"

const DetailedResumeAnalysis = ({ analysis }) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Theme colors
  const textColor = isDark ? "text-white" : "text-gray-900"
  const subTextColor = isDark ? "text-gray-300" : "text-gray-600"
  const cardBg = isDark ? "bg-gray-800" : "bg-white"
  const sectionBg = isDark ? "bg-gray-700" : "bg-gray-50"

  // Add error checking
  if (!analysis || !analysis.skillsScore) {
    return (
      <div className={`${cardBg} rounded-lg shadow-lg p-6 mt-6`}>
        <p className={subTextColor}>Analysis data not available</p>
      </div>
    )
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  const pieData = [
    { name: "Skills Match", value: analysis.skillsScore },
    { name: "Experience", value: analysis.experienceScore },
    { name: "Education", value: analysis.educationScore },
    { name: "Keywords Match", value: analysis.keywordsScore },
    { name: "Format & Structure", value: analysis.formatScore },
  ]

  // Ensure keyFindings and suggestions exist
  const keyFindings = analysis.keyFindings || []
  const suggestions = analysis.suggestions || []

  return (
    <div className={`${cardBg} rounded-lg shadow-lg p-6 mt-6`}>
      <h2 className={`text-2xl font-bold mb-6 ${textColor}`}>Detailed Resume Analysis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80">
          <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>Score Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className={`${sectionBg} p-6 rounded-lg`}>
            <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>Key Findings</h3>
            <ul className="space-y-4">
              {keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start">
                  <span className={`w-2 h-2 mt-2 mr-2 ${isDark ? "bg-blue-400" : "bg-blue-500"} rounded-full`}></span>
                  <span className={textColor}>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${sectionBg} p-6 rounded-lg`}>
            <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>Improvement Suggestions</h3>
            <ul className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span
                    className={`w-2 h-2 mt-2 mr-2 ${isDark ? "bg-yellow-400" : "bg-yellow-500"} rounded-full`}
                  ></span>
                  <span className={textColor}>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailedResumeAnalysis
