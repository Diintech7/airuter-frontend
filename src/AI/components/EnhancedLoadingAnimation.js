import React from 'react';

const EnhancedLoadingAnimation = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* Animated circular loader with multiple layers */}
      <div className="relative w-64 h-64 mb-8">
        {/* Outer spinning circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-56 h-56 border-8 border-blue-500 border-t-transparent rounded-full animate-spin" 
               style={{ animationDuration: '3s' }}></div>
        </div>
        
        {/* Middle spinning circle - opposite direction */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 border-4 border-indigo-500 border-b-transparent rounded-full animate-spin"
               style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
        </div>
        
        {/* Inner spinning circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-4 border-purple-500 border-l-transparent rounded-full animate-spin"
               style={{ animationDuration: '1.5s' }}></div>
        </div>
        
        {/* Center pulsing element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full animate-pulse"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-4 left-12 w-3 h-3 bg-blue-400 rounded-full animate-ping" 
             style={{ animationDuration: '1.5s', animationDelay: '0.2s' }}></div>
        <div className="absolute bottom-10 right-16 w-2 h-2 bg-indigo-400 rounded-full animate-ping"
             style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-20 right-10 w-2 h-2 bg-purple-400 rounded-full animate-ping"
             style={{ animationDuration: '2.3s', animationDelay: '0.1s' }}></div>
      </div>
      
      {/* Text content */}
      <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
        Analyzing Your Interview
      </h2>
      
      <p className="text-blue-300 max-w-md text-center mb-6">
        We're carefully reviewing your responses to provide detailed feedback.
        This may take a few moments...
      </p>
      
      {/* Progress indicators */}
      <div className="mt-4 space-y-3 w-64">
        {/* Main progress bar */}
        <div className="bg-gray-800 rounded-full h-2.5 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full animate-pulse w-2/3"></div>
        </div>
        
        {/* Processing steps indicators */}
        <div className="flex justify-between px-1">
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-400 mt-1">Recording</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-400 mt-1">Transcription</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-400 mt-1">Analysis</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
            <span className="text-xs text-gray-400 mt-1">Report</span>
          </div>
        </div>
      </div>
      
      {/* Floating animated messages - using opacity transitions instead of custom animation */}
      <div className="mt-10 relative w-80 h-20">
        <div className="absolute transition-opacity duration-500 ease-in-out opacity-100 bg-gray-800 p-3 rounded-lg text-sm"
             style={{ animation: 'fadeInOut 5s infinite 0s' }}>
          Analyzing communication style...
        </div>
        <div className="absolute transition-opacity duration-500 ease-in-out opacity-0 bg-gray-800 p-3 rounded-lg text-sm"
             style={{ animation: 'fadeInOut 5s infinite 5s' }}>
          Evaluating technical responses...
        </div>
        <div className="absolute transition-opacity duration-500 ease-in-out opacity-0 bg-gray-800 p-3 rounded-lg text-sm"
             style={{ animation: 'fadeInOut 5s infinite 10s' }}>
          Identifying key strengths...
        </div>
      </div>
      
      {/* Add the necessary keyframe animations */}
      <style jsx>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          20%, 80% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default EnhancedLoadingAnimation;