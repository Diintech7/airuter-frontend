import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Video, FileText, UserCircle, Calendar, Clock, Award, AlertTriangle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../UI/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../UI/Tabs';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const InterviewResultsPage = () => {
  const { applicantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState([]);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    selfIntroduction: true,
    projectExplanation: true,
    englishCommunication: true
  });

  // Get data from location state
  const roomId = location.state?.roomId;
  const applicationId = location.state?.applicationId;
  const applicantName = location.state?.applicantName || 'Candidate';
  const applicantEmail = location.state?.applicantEmail || '';
  const jobTitle = location.state?.jobTitle || 'Position';

  useEffect(() => {
    if (roomId) {
      fetchRecordings();
    }
  }, [roomId]);

  useEffect(() => {
    if (selectedRecording) {
      fetchAnalysis(selectedRecording.roomId);
    }
  }, [selectedRecording]);

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('usertoken');
      if (!token) throw new Error('Authentication token not found');
      
      if (!roomId) {
        throw new Error('Interview room ID not found');
      }

      // Fetch interview details using roomId
      const interviewResponse = await fetch(`https://auriter-backen.onrender.com/api/interview/details/${roomId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!interviewResponse.ok) {
        throw new Error('Failed to fetch interview details');
      }
      
      const interviewData = await interviewResponse.json();
      
      if (!interviewData.screenRecordingUrl) {
        throw new Error('No recording available for this interview');
      }

      const recording = {
        roomId: roomId,
        jobTitle: jobTitle,
        screenRecordingUrl: interviewData.screenRecordingUrl,
        recordedAt: interviewData.recordedAt || new Date().toISOString()
      };

      setRecordings([recording]);
      setSelectedRecording(recording);

      // Fetch analysis if available
      if (roomId) {
        fetchAnalysis(roomId);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching recordings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysis = async (roomId) => {
    try {
      const token = Cookies.get('usertoken');
      const response = await fetch(`https://auriter-backen.onrender.com/api/interview/analysis/${roomId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }
      
      const data = await response.json();
      setAnalysis(data.interview?.analysis || null);
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setAnalysis(null);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRecordingSelect = (recording) => {
    setSelectedRecording(recording);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-blue-600 bg-blue-100';
    if (score >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading && !selectedRecording) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={handleGoBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">Interview Results</h1>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar: Candidate Info & Recording List */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <UserCircle className="h-12 w-12 text-gray-400 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">{applicantName}</h3>
                  <p className="text-gray-500">{applicantEmail}</p>
                </div>
              </div>
              <div className="mb-2">
                <span className="font-medium">Position: </span>
                <span>{jobTitle}</span>
              </div>
              <div>
                <span className="font-medium">Interviews: </span>
                <span>{recordings.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interview Recordings</CardTitle>
            </CardHeader>
            <CardContent>
              {recordings.length === 0 ? (
                <p className="text-gray-500">No recordings available</p>
              ) : (
                <div className="space-y-3">
                  {recordings.map((recording) => (
                    <div 
                      key={recording.roomId}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedRecording?.roomId === recording.roomId 
                          ? 'bg-purple-100 border border-purple-300' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleRecordingSelect(recording)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{recording.jobTitle}</div>
                        <Video className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(recording.recordedAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(recording.recordedAt).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {selectedRecording ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Interview Recording</CardTitle>
                  <CardDescription>
                    Recorded on {new Date(selectedRecording.recordedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    {selectedRecording.screenRecordingUrl ? (
                      <video 
                        src={selectedRecording.screenRecordingUrl} 
                        controls 
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-white">Video unavailable</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <a 
                    href={selectedRecording.screenRecordingUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-purple-600 hover:text-purple-700 flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open video in new tab
                  </a>
                </CardFooter>
              </Card>

              <Tabs defaultValue="scores">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="scores">Scores & Feedback</TabsTrigger>
                  <TabsTrigger value="focus">Focus Areas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="scores">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Analysis</CardTitle>
                      <CardDescription>
                        Detailed feedback on the candidate's interview performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!analysis ? (
                        <div className="p-4 text-center">
                          <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-2" />
                          <p>Analysis not available for this interview.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Overall Score Summary */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-500 mb-1">Self Introduction</div>
                              <div className={`text-2xl font-bold ${getScoreColor(analysis.overallScores.selfIntroduction)}`}>
                                {analysis.overallScores.selfIntroduction}/10
                              </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-500 mb-1">Project Explanation</div>
                              <div className={`text-2xl font-bold ${getScoreColor(analysis.overallScores.projectExplanation)}`}>
                                {analysis.overallScores.projectExplanation}/10
                              </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-500 mb-1">English Communication</div>
                              <div className={`text-2xl font-bold ${getScoreColor(analysis.overallScores.englishCommunication)}`}>
                                {analysis.overallScores.englishCommunication}/10
                              </div>
                            </div>
                          </div>

                          {/* Self Introduction Feedback */}
                          <div className="border rounded-lg overflow-hidden">
                            <div 
                              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                              onClick={() => toggleSection('selfIntroduction')}
                            >
                              <h3 className="font-medium">Self Introduction</h3>
                              {expandedSections.selfIntroduction ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </div>
                            {expandedSections.selfIntroduction && (
                              <div className="p-4">
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-green-600 mb-2">Strengths</h4>
                                  <p className="text-sm">{analysis.feedback.selfIntroduction.strengths}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-red-600 mb-2">Areas for Improvement</h4>
                                  <p className="text-sm">{analysis.feedback.selfIntroduction.areasOfImprovement}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Project Explanation Feedback */}
                          <div className="border rounded-lg overflow-hidden">
                            <div 
                              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                              onClick={() => toggleSection('projectExplanation')}
                            >
                              <h3 className="font-medium">Project Explanation</h3>
                              {expandedSections.projectExplanation ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </div>
                            {expandedSections.projectExplanation && (
                              <div className="p-4">
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-green-600 mb-2">Strengths</h4>
                                  <p className="text-sm">{analysis.feedback.projectExplanation.strengths}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-red-600 mb-2">Areas for Improvement</h4>
                                  <p className="text-sm">{analysis.feedback.projectExplanation.areasOfImprovement}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* English Communication Feedback */}
                          <div className="border rounded-lg overflow-hidden">
                            <div 
                              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                              onClick={() => toggleSection('englishCommunication')}
                            >
                              <h3 className="font-medium">English Communication</h3>
                              {expandedSections.englishCommunication ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </div>
                            {expandedSections.englishCommunication && (
                              <div className="p-4">
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-green-600 mb-2">Strengths</h4>
                                  <p className="text-sm">{analysis.feedback.englishCommunication.strengths}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-red-600 mb-2">Areas for Improvement</h4>
                                  <p className="text-sm">{analysis.feedback.englishCommunication.areasOfImprovement}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="focus">
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Focus Areas</CardTitle>
                      <CardDescription>
                        Prioritized areas for the candidate to improve upon
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!analysis ? (
                        <div className="p-4 text-center">
                          <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-2" />
                          <p>Analysis not available for this interview.</p>
                        </div>
                      ) : (
                        <div>
                          {analysis.focusAreas.length === 0 ? (
                            <p>No focus areas identified.</p>
                          ) : (
                            <ul className="space-y-4">
                              {analysis.focusAreas.map((area, index) => (
                                <li key={index} className="flex">
                                  <div className="flex-shrink-0 mr-3 mt-1">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                                      {index + 1}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="font-medium mb-1">{area}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">No Interview Selected</h3>
                <p className="text-gray-500">
                  {recordings.length === 0 
                    ? "No interview recordings are available for this candidate." 
                    : "Select an interview from the list to view the recording and analysis."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewResultsPage;