"use client"
import { getLocalizedText } from "../utils/languageUtils"

const EnhancedLoadingAnimation = ({ language = "en" }) => {
  // Get localized text helper
  const getText = (key) => getLocalizedText(language, key)

  // Get processing step labels
  const getProcessingSteps = () => {
    const steps = {
      en: [
        { key: "recording", label: "Recording" },
        { key: "transcription", label: "Transcription" },
        { key: "analysis", label: "Analysis" },
        { key: "report", label: "Report" },
      ],
      hi: [
        { key: "recording", label: "रिकॉर्डिंग" },
        { key: "transcription", label: "ट्रांसक्रिप्शन" },
        { key: "analysis", label: "विश्लेषण" },
        { key: "report", label: "रिपोर्ट" },
      ],
    }
    return steps[language] || steps.en
  }

  // Get animated status messages
  const getStatusMessages = () => {
    const messages = {
      en: [
        "Analyzing communication style...",
        "Evaluating technical responses...",
        "Identifying key strengths...",
        "Generating detailed feedback...",
        "Preparing final report...",
      ],
      hi: [
        "संचार शैली का विश्लेषण कर रहे हैं...",
        "तकनीकी उत्तरों का मूल्यांकन कर रहे हैं...",
        "मुख्य शक्तियों की पहचान कर रहे हैं...",
        "विस्तृत फीडबैक तैयार कर रहे हैं...",
        "अंतिम रिपोर्ट तैयार कर रहे हैं...",
      ],
    }
    return messages[language] || messages.en
  }

  const processingSteps = getProcessingSteps()
  const statusMessages = getStatusMessages()

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* Animated circular loader with multiple layers */}
      <div className="relative w-64 h-64 mb-8">
        {/* Outer spinning circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-56 h-56 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"
            style={{ animationDuration: "3s" }}
          ></div>
        </div>

        {/* Middle spinning circle - opposite direction */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-40 h-40 border-4 border-indigo-500 border-b-transparent rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "2s" }}
          ></div>
        </div>

        {/* Inner spinning circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-24 h-24 border-4 border-purple-500 border-l-transparent rounded-full animate-spin"
            style={{ animationDuration: "1.5s" }}
          ></div>
        </div>

        {/* Center pulsing element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full animate-pulse"></div>
        </div>

        {/* Floating particles */}
        <div
          className="absolute top-4 left-12 w-3 h-3 bg-blue-400 rounded-full animate-ping"
          style={{ animationDuration: "1.5s", animationDelay: "0.2s" }}
        ></div>
        <div
          className="absolute bottom-10 right-16 w-2 h-2 bg-indigo-400 rounded-full animate-ping"
          style={{ animationDuration: "2s", animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-20 right-10 w-2 h-2 bg-purple-400 rounded-full animate-ping"
          style={{ animationDuration: "2.3s", animationDelay: "0.1s" }}
        ></div>
      </div>

      {/* Text content */}
      <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
        {getText("analyzingInterview")}
      </h2>

      <p className="text-blue-300 max-w-md text-center mb-6">{getText("analysisInProgress")}</p>

      {/* Progress indicators */}
      <div className="mt-4 space-y-3 w-64">
        {/* Main progress bar */}
        <div className="bg-gray-800 rounded-full h-2.5 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full animate-pulse w-2/3"></div>
        </div>

        {/* Processing steps indicators */}
        <div className="flex justify-between px-1">
          {processingSteps.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  index < 2 ? "bg-green-500" : index === 2 ? "bg-blue-500 animate-pulse" : "bg-gray-600"
                }`}
              ></div>
              <span
                className={`text-xs mt-1 ${
                  index < 2 ? "text-green-400" : index === 2 ? "text-blue-400" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating animated messages */}
      <div className="mt-10 relative w-80 h-20">
        {statusMessages.map((message, index) => (
          <div
            key={index}
            className="absolute transition-opacity duration-500 ease-in-out bg-gray-800 p-3 rounded-lg text-sm"
            style={{
              animation: `fadeInOut 5s infinite ${index * 5}s`,
              opacity: index === 0 ? 1 : 0,
            }}
          >
            {message}
          </div>
        ))}
      </div>

      {/* Add the necessary keyframe animations */}
      <style jsx>{`
        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0;
          }
          20%,
          80% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default EnhancedLoadingAnimation
