import React from 'react';
import { useNavigate } from 'react-router-dom';

const InterviewStart = ({ startInterview }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h1 className="text-3xl font-bold text-white">Welcome to Your AI Interview</h1>
          <p className="text-blue-100 mt-2">Your AI interviewer is ready to begin when you are</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How it Works
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <div className="bg-blue-500 rounded-full p-1 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                You'll be asked a series of interview questions by our AI interviewer
              </li>
              <li className="flex items-start">
                <div className="bg-blue-500 rounded-full p-1 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Your answers will be recorded and transcribed in real-time
              </li>
              <li className="flex items-start">
                <div className="bg-blue-500 rounded-full p-1 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                At the end, you'll receive feedback and analysis of your performance
              </li>
            </ul>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={startInterview}
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 px-6 rounded-lg text-white font-medium transition-all transform hover:scale-105 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Interview
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 px-6 rounded-lg text-white font-medium transition-all transform hover:scale-105 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
        
        <div className="bg-gray-900 p-4 text-center text-gray-400 text-sm">
          Make sure you're in a quiet place with good lighting and a stable internet connection
        </div>
      </div>
    </div>
  );
};

export default InterviewStart; 