"use client"
import { useNavigate } from "react-router-dom"

const InterviewStart = ({ startInterview }) => {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h1 className="text-3xl font-bold text-white">Welcome to Your Fast AI Interview</h1>
          <p className="text-blue-100 mt-2">No camera or microphone required - text-based interview</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-400 mr-3"
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
              <div>
                <h4 className="font-medium text-yellow-300">Important Notice</h4>
                <p className="text-yellow-200 text-sm mt-1">
                  The interview will not start until all permissions (camera, microphone, and screen sharing) are
                  granted. Please ensure you're ready to share your screen when prompted.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Required Permissions
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
                  <span className="font-medium text-red-300">Camera Access - Required</span>
                  <p className="text-sm text-gray-400">Your camera will be used during the interview</p>
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
                  <span className="font-medium text-red-300">Microphone Access - Required</span>
                  <p className="text-sm text-gray-400">Your microphone will record your responses</p>
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
                  <span className="font-medium text-red-300">Screen Sharing - Required</span>
                  <p className="text-sm text-gray-400">Screen recording is mandatory for interview verification</p>
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
                  <span className="font-medium text-green-300">Voice-based Interview</span>
                  <p className="text-sm text-gray-400">Optimized for smooth voice interactions with AI</p>
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
                  <span className="font-medium text-green-300">Auto-scrolling Transcript</span>
                  <p className="text-sm text-gray-400">Real-time transcript with automatic scrolling</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={startInterview}
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
              Start Fast Interview
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
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewStart
