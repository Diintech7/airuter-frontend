import React from 'react';

const InterviewSession = ({
  localVideoRef,
  questions,
  currentQuestionIndex,
  userResponse,
  transcript,
  isRecording,
  aiSpeaking,
  remainingTime,
  timerActive,
  stopRecording,
  handleNextQuestion,
  formatTime
}) => {
  const parseTranscript = (fullTranscript) => {
    const messages = [];
    if (questions && questions.length > 0) {
      for (let i = 0; i <= currentQuestionIndex; i++) {
        messages.push({
          sender: 'Alex',
          text: questions[i],
          type: 'ai'
        });
        if (i < currentQuestionIndex) {
          messages.push({
            sender: 'Sophie',
            text: "Previous response to question " + (i + 1),
            type: 'user'
          });
        }
      }
    }
    if (userResponse && userResponse.trim()) {
      messages.push({
        sender: 'Sophie',
        text: userResponse,
        type: 'user'
      });
    }
    return messages;
  };
  const messages = parseTranscript(userResponse);
  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-red-500 h-4 w-4 rounded-full animate-pulse mr-2"></div>
          <span className="font-medium">Interview in Progress</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-md ${timerActive ? 'bg-blue-600' : 'bg-gray-700'}`}>
            <span className="font-mono">{formatTime(remainingTime)}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col md:flex-row p-4 overflow-hidden">
        <div className="md:w-2/3 pr-0 md:pr-4 mb-4 md:mb-0">
          <div className="bg-black rounded-lg h-full flex flex-col overflow-hidden">
            <div className="relative flex-1 flex items-center justify-center">
              <video 
                ref={localVideoRef}
                autoPlay 
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }} 
              />
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 px-4 py-2 rounded-lg">
                <div className="flex items-center">
                  <span className="text-white font-medium">Sophie</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-gray-900 rounded-t-lg shadow-lg overflow-hidden" style={{ width: "180px" }}>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-2 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-white font-medium">Alex (AI)</span>
                </div>
                <div className="p-4 flex items-center justify-center bg-gray-800">
                  <div className="w-36 h-36 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-full h-full">
                      <rect x="16" y="8" width="32" height="28" rx="4" fill="#4B5563" />
                      <rect x="20" y="12" width="24" height="20" rx="2" fill="#1E293B" />
                      <circle cx="26" cy="20" r="4" fill={aiSpeaking ? "#60A5FA" : "#2563EB"}>
                        {aiSpeaking && <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />}
                      </circle>
                      <circle cx="38" cy="20" r="4" fill={aiSpeaking ? "#60A5FA" : "#2563EB"}>
                        {aiSpeaking && <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />}
                      </circle>
                      <rect x="26" y="30" width="12" height="2" rx="1" fill={aiSpeaking ? "#60A5FA" : "#9CA3AF"}>
                        {aiSpeaking && <animate attributeName="width" values="12;8;12" dur="0.8s" repeatCount="indefinite" />}
                        {aiSpeaking && <animate attributeName="x" values="26;28;26" dur="0.8s" repeatCount="indefinite" />}
                      </rect>
                      <rect x="22" y="36" width="20" height="12" rx="2" fill="#4B5563" />
                      <rect x="31" y="4" width="2" height="4" fill="#9CA3AF" />
                      <circle cx="32" cy="4" r="2" fill="#60A5FA">
                        {aiSpeaking && <animate attributeName="fill" values="#60A5FA;#2563EB;#60A5FA" dur="1s" repeatCount="indefinite" />}
                      </circle>
                    </svg>
                    {aiSpeaking && (
                      <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                        <div className="flex space-x-1">
                          <div className="w-1 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                          <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-1 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {aiSpeaking && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
                      <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-75 animate-ping"></div>
                      </div>
                    </div>
                    <div className="bg-gray-800 bg-opacity-90 px-6 py-3 rounded-full shadow-lg">
                      <div className="flex items-center">
                        <span className="text-white font-medium text-lg">AI Speaking</span>
                        <div className="ml-2 flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {isRecording && (
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-lg shadow-lg flex items-center transform transition-all duration-300 hover:scale-105">
                  <div className="relative mr-2">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-400"></span>
                    </span>
                  </div>
                  <span className="font-medium text-white">Recording</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="md:w-1/3 flex flex-col h-full overflow-hidden">
          <div className="flex-1 flex flex-col p-4 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="py-2 px-4 bg-gray-100 border-b border-gray-200 rounded-t-lg">
              <h3 className="font-medium text-gray-800">Live Transcript</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-sm text-gray-600 mb-1">{message.sender}</span>
                  <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
                    message.type === 'ai' 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-blue-600 text-white self-end'
                  }`}>
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
              
              {isRecording && transcript && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 mb-1">Sophie</span>
                  <div className="bg-blue-100 border border-blue-300 text-blue-800 p-3 rounded-lg max-w-xs lg:max-w-md">
                    <p className="flex items-center">
                      <span className="animate-pulse mr-2">⚫</span>
                      {transcript}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-auto border-t border-gray-200 pt-4 bg-white">
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 w-full h-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <span className="font-medium text-gray-800">Alex (AI)</span>
                </div>
                
                {aiSpeaking && (
                  <div className="flex space-x-1 items-center">
                    <div className="w-1 h-3 bg-blue-500 rounded animate-pulse"></div>
                    <div className="w-1 h-5 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-4 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-6 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    <div className="w-1 h-2 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center shadow-md transform transition-all duration-300 hover:scale-[1.02]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                    Stop Recording
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center shadow-md transform transition-all duration-300 hover:scale-[1.02]"
                  >
                    {currentQuestionIndex < questions.length - 1 ? (
                      <>
                        <span>Next Question</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Finish Interview</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;