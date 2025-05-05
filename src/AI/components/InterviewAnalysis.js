import React from 'react';
import { Pie } from 'react-chartjs-2';

const InterviewAnalysis = ({ analysis }) => {
  // Ensure analysis.questions and analysis.overallScores exist
  const { overallScores, feedback, focusAreas } = analysis;

  // Prepare pie chart data for Self Introduction
  const selfIntroductionPieData = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [overallScores.selfIntroduction, 10 - overallScores.selfIntroduction],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(229, 231, 235, 0.3)', // Light Gray
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(229, 231, 235, 0)',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  // Prepare pie chart data for Project Explanation
  const projectExplanationPieData = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [overallScores.projectExplanation, 10 - overallScores.projectExplanation],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', // Green
          'rgba(229, 231, 235, 0.3)', // Light Gray
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(229, 231, 235, 0)',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  // Prepare pie chart data for English Communication
  const englishCommunicationPieData = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [overallScores.englishCommunication, 10 - overallScores.englishCommunication],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)', // Purple
          'rgba(229, 231, 235, 0.3)', // Light Gray
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(229, 231, 235, 0)',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  // Chart options for donut effect
  const chartOptions = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Card with Glassmorphism Effect */}
        <div className="mb-8 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold tracking-tight">Interview Analysis</h1>
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-4 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Analysis Complete</span>
              </div>
            </div>
            <p className="mt-2 opacity-90 text-lg">Here's an in-depth evaluation of your interview performance</p>
          </div>
        </div>

        {/* Performance Score Cards with Pie Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Self Introduction Score Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300">
            <div className="h-4 bg-blue-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Self Introduction</h3>
              <div className="h-48 relative flex items-center justify-center">
                <Pie data={selfIntroductionPieData} options={chartOptions} />
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold text-blue-600">{overallScores.selfIntroduction}</span>
                  <span className="text-sm text-gray-500">out of 10</span>
                </div>
              </div>
              <div className="mt-4 bg-blue-50 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  {overallScores.selfIntroduction >= 8 ? 'Excellent presentation of your background and skills!' :
                    overallScores.selfIntroduction >= 6 ? 'Good introduction with room for improvement.' :
                      'Needs significant improvement in how you present yourself.'}
                </p>
              </div>
            </div>
          </div>

          {/* Project Explanation Score Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300">
            <div className="h-4 bg-green-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Project Explanation</h3>
              <div className="h-48 relative flex items-center justify-center">
                <Pie data={projectExplanationPieData} options={chartOptions} />
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold text-green-600">{overallScores.projectExplanation}</span>
                  <span className="text-sm text-gray-500">out of 10</span>
                </div>
              </div>
              <div className="mt-4 bg-green-50 rounded-lg p-3">
                <p className="text-green-800 text-sm">
                  {overallScores.projectExplanation >= 8 ? 'Exceptional project explanations with clear technical details!' :
                    overallScores.projectExplanation >= 6 ? 'Solid technical explanations that could be more detailed.' :
                      'Technical explanations need more clarity and depth.'}
                </p>
              </div>
            </div>
          </div>

          {/* English Communication Score Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300">
            <div className="h-4 bg-purple-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">English Communication</h3>
              <div className="h-48 relative flex items-center justify-center">
                <Pie data={englishCommunicationPieData} options={chartOptions} />
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold text-purple-600">{overallScores.englishCommunication}</span>
                  <span className="text-sm text-gray-500">out of 10</span>
                </div>
              </div>
              <div className="mt-4 bg-purple-50 rounded-lg p-3">
                <p className="text-purple-800 text-sm">
                  {overallScores.englishCommunication >= 8 ? 'Outstanding fluency and communication skills!' :
                    overallScores.englishCommunication >= 6 ? 'Good language skills with minor areas to improve.' :
                      'Communication skills need significant enhancement.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Detailed Performance Feedback
          </h2>

          <div className="space-y-6">
            {Object.entries(feedback).map(([category, details]) => {
              // Convert category from camelCase to Title Case for display
              const displayCategory = category
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());

              // Determine category color and icon
              let categoryData = {
                color: 'blue',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )
              };

              if (category === 'projectExplanation') {
                categoryData = {
                  color: 'green',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  )
                };
              } else if (category === 'englishCommunication') {
                categoryData = {
                  color: 'purple',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  )
                };
              }

              return (
                <div key={category} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:shadow-xl transition-all duration-300">
                  <div className={`bg-gradient-to-r from-${categoryData.color}-500 to-${categoryData.color}-600 p-4 text-white flex items-center`}>
                    <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                      {categoryData.icon}
                    </div>
                    <h3 className="text-xl font-semibold">
                      {displayCategory} <span className="ml-2 text-md font-normal bg-white bg-opacity-20 px-2 py-1 rounded-full">Score: {overallScores[category]}/10</span>
                    </h3>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`bg-${categoryData.color}-50 rounded-xl p-5 border border-${categoryData.color}-100 transform transition-all duration-300 hover:shadow-md`}>
                        <div className="flex items-center mb-3">
                          <div className={`bg-${categoryData.color}-100 rounded-full p-2 mr-3`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${categoryData.color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h4 className={`font-semibold text-${categoryData.color}-800 text-lg`}>Key Strengths</h4>
                        </div>
                        <p className={`text-${categoryData.color}-800 leading-relaxed`}>{details.strengths}</p>
                      </div>

                      <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 transform transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center mb-3">
                          <div className="bg-amber-100 rounded-full p-2 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-amber-800 text-lg">Growth Opportunities</h4>
                        </div>
                        <p className="text-amber-800 leading-relaxed">{details.areasOfImprovement}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Focus Areas with Animated Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Priority Focus Areas
          </h2>
          <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-2xl shadow-lg p-6">
            <div className="space-y-4">
              {focusAreas.map((area, index) => (
                <div key={index} className="flex items-start group">
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 mt-1 shadow-md transform group-hover:scale-110 transition-all duration-300">
                    {index + 1}
                  </div>
                  <div className="ml-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 flex-grow border border-blue-100 shadow-sm transform group-hover:translate-x-1 transition-all duration-300">
                    <p className="text-indigo-900 font-medium text-lg">{area}</p>
                    <div className="w-full h-1 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full mt-3 transform origin-left scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="flex-1 group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 px-8 rounded-xl shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transform group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-lg font-medium">Return to Dashboard</span>
          </button>

          <button className="flex-1 group bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white py-4 px-8 rounded-xl shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transform group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="text-lg font-medium">Download Report (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewAnalysis; 