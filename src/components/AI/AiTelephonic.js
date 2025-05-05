import React, { useState } from 'react';
import { StyledSection, InterviewCard } from '../Dashboard/enhanced-dashboard-components';
import InterviewComponent from '../Interview/InterviewComponent';
import PhoneCallComponent from './PhoneCallComponent';

const AiTelephonic = () => {
  const [activeTab, setActiveTab] = useState('prepare');
  
  const aiTelephonic = {
    title: 'AI Telephonic Interview',
    instructions: 'Please follow the instructions and answer the questions during the interview.',
    duration: '30 minutes',
    previousDone: [
      { id: 1, date: '2023-04-01', score: 85 },
      { id: 2, date: '2023-05-15', score: 92 }
    ],
    inProgress: [
      { id: 3, date: '2023-06-10', score: null }
    ],
    notAttended: [
      { id: 4, date: '2023-07-01' },
      { id: 5, date: '2023-08-20' }
    ]
  };

  return (
    <StyledSection>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">AI Telephonic Interview</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'prepare' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('prepare')}
            >
              Prepare Interview
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('history')}
            >
              Interview History
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'prepare' ? (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Interview Setup</h2>
                  <p className="mb-4 text-gray-600">
                    Our AI-powered telephonic interview system simulates a real interview experience by calling your phone.
                    You'll be asked relevant technical and behavioral questions based on your profile and the job you're applying for.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-md mb-6">
                    <h3 className="font-medium text-blue-800 mb-2">Interview Tips</h3>
                    <ul className="list-disc pl-5 text-blue-700">
                      <li>Find a quiet place with good reception</li>
                      <li>Prepare as you would for a real phone interview</li>
                      <li>Speak clearly and answer questions thoroughly</li>
                      <li>You'll receive detailed feedback after completion</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <PhoneCallComponent />
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Interview History</h2>
                
                {aiTelephonic.previousDone.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Completed Interviews</h3>
                    <div className="grid gap-4">
                      {aiTelephonic.previousDone.map(interview => (
                        <InterviewCard 
                          key={interview.id}
                          date={interview.date}
                          score={interview.score}
                          status="completed"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {aiTelephonic.inProgress.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">In Progress</h3>
                    <div className="grid gap-4">
                      {aiTelephonic.inProgress.map(interview => (
                        <InterviewCard 
                          key={interview.id}
                          date={interview.date}
                          status="in-progress"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {aiTelephonic.notAttended.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Scheduled</h3>
                    <div className="grid gap-4">
                      {aiTelephonic.notAttended.map(interview => (
                        <InterviewCard 
                          key={interview.id}
                          date={interview.date}
                          status="scheduled"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </StyledSection>
  );
};

export default AiTelephonic;