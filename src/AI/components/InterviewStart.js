"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import LanguageSelector from "./LanguageSelector"

const InterviewStart = ({ startInterview }) => {
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  const handleStartInterview = () => {
    startInterview(selectedLanguage)
  }

  const getLocalizedText = (key) => {
    const texts = {
      en: {
        title: "Welcome to Your AI Interview",
        subtitle: "Voice-based interview with real-time transcription",
        importantNotice: "Important Notice",
        noticeText:
          "The interview will not start until all permissions (camera, microphone, and screen sharing) are granted. Please ensure you're ready to share your screen when prompted.",
        requiredPermissions: "Required Permissions",
        cameraAccess: "Camera Access - Required",
        cameraDesc: "Your camera will be used during the interview",
        microphoneAccess: "Microphone Access - Required",
        microphoneDesc: "Your microphone will record your responses",
        screenSharing: "Screen Sharing - Required",
        screenDesc: "Screen recording is mandatory for interview verification",
        voiceBased: "Voice-based Interview",
        voiceDesc: "Optimized for smooth voice interactions with AI",
        autoScrolling: "Auto-scrolling Transcript",
        scrollDesc: "Real-time transcript with automatic scrolling",
        startInterview: "Start Interview",
        backToDashboard: "Back to Dashboard",
      },
      hi: {
        title: "आपके AI साक्षात्कार में आपका स्वागत है",
        subtitle: "रियल-टाइम ट्रांसक्रिप्शन के साथ वॉयस-आधारित साक्षात्कार",
        importantNotice: "महत्वपूर्ण सूचना",
        noticeText:
          "साक्षात्कार तब तक शुरू नहीं होगा जब तक सभी अनुमतियां (कैमरा, माइक्रोफोन, और स्क्रीन शेयरिंग) नहीं दी जातीं। कृपया सुनिश्चित करें कि आप स्क्रीन शेयर करने के लिए तैयार हैं।",
        requiredPermissions: "आवश्यक अनुमतियां",
        cameraAccess: "कैमरा एक्सेस - आवश्यक",
        cameraDesc: "साक्षात्कार के दौरान आपका कैमरा उपयोग किया जाएगा",
        microphoneAccess: "माइक्रोफोन एक्सेस - आवश्यक",
        microphoneDesc: "आपका माइक्रोफोन आपके उत्तर रिकॉर्ड करेगा",
        screenSharing: "स्क्रीन शेयरिंग - आवश्यक",
        screenDesc: "साक्षात्कार सत्यापन के लिए स्क्रीन रिकॉर्डिंग अनिवार्य है",
        voiceBased: "वॉयस-आधारित साक्षात्कार",
        voiceDesc: "AI के साथ सुचारू वॉयस इंटरैक्शन के लिए अनुकूलित",
        autoScrolling: "ऑटो-स्क्रॉलिंग ट्रांसक्रिप्ट",
        scrollDesc: "ऑटोमैटिक स्क्रॉलिंग के साथ रियल-टाइम ट्रांसक्रिप्ट",
        startInterview: "साक्षात्कार शुरू करें",
        backToDashboard: "डैशबोर्ड पर वापस जाएं",
      },
    }
    return texts[selectedLanguage][key] || texts.en[key]
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h1 className="text-3xl font-bold text-white">{getLocalizedText("title")}</h1>
          <p className="text-blue-100 mt-2">{getLocalizedText("subtitle")}</p>
        </div>

        <div className="p-6 space-y-6">
          <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />

          

          <div className="bg-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold  flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {getLocalizedText("requiredPermissions")}
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <div className="bg-red-500 rounded-full p-1 mr-3 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-red-300">{getLocalizedText("cameraAccess")}</span>
                  <p className="text-sm text-gray-400">{getLocalizedText("cameraDesc")}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-red-500 rounded-full p-1 mr-3 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-red-300">{getLocalizedText("microphoneAccess")}</span>
                  <p className="text-sm text-gray-400">{getLocalizedText("microphoneDesc")}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-red-500 rounded-full p-1 mr-3 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-red-300">{getLocalizedText("screenSharing")}</span>
                  <p className="text-sm text-gray-400">{getLocalizedText("screenDesc")}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-green-500 rounded-full p-1 mr-3 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-green-300">{getLocalizedText("voiceBased")}</span>
                  <p className="text-sm text-gray-400">{getLocalizedText("voiceDesc")}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-green-500 rounded-full p-1 mr-3 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-green-300">{getLocalizedText("autoScrolling")}</span>
                  <p className="text-sm text-gray-400">{getLocalizedText("scrollDesc")}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleStartInterview}
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 px-6 rounded-lg text-white font-medium transition-all transform hover:scale-105 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {getLocalizedText("startInterview")}
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 px-6 rounded-lg text-white font-medium transition-all transform hover:scale-105 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {getLocalizedText("backToDashboard")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewStart
