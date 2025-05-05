import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../UI/Tabs';
import { Progress } from '../UI/Progress';
import { ChevronRight, Calendar, Clock, Award, BookOpen, ArrowLeft, Target, Video, Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { useTheme } from '../../context/ThemeContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { useNavigate } from 'react-router-dom';

const InterviewResults = () => {
  const { applicationId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interviewData, setInterviewData] = useState(null);
  const [downloadingVideo, setDownloadingVideo] = useState(false);
  const navigate = useNavigate();

  const { isDark } = useTheme();
  const { colors, styles, cx } = useThemeStyles();

  useEffect(() => {
    fetchInterviewResults();
  }, [applicationId]);

  const fetchInterviewResults = async () => {
    try {
      const token = Cookies.get('usertoken');
      const response = await fetch(`https://auriter-backen.onrender.com/api/interview/application/${applicationId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch interview results');
      }

      const data = await response.json();
      setInterviewData(data.interview);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVideo = async () => {
    if (!interviewData || !interviewData.screenRecordingUrl) {
      alert("No video available to download");
      return;
    }
  
    try {
      setDownloadingVideo(true);
      
      const videoUrl = interviewData.screenRecordingUrl;
      const fileName = `interview-recording-${new Date(interviewData.date).toISOString().split('T')[0]}.mp4`;
      
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch video data");
      }
      
      const blob = await response.blob();
      saveAs(blob, fileName);
    } catch (err) {
      console.error("Error downloading video:", err);
      alert(`Failed to download video. Please try again.`);
    } finally {
      setDownloadingVideo(false);
    }
  };

  if (loading) {
    return (
      <div className={cx("p-8 flex items-center justify-center min-h-screen", colors.bg)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent" 
               style={{ borderColor: isDark ? '#8b5cf6' : '#7c3aed', borderTopColor: 'transparent' }}></div>
          <p className={cx("font-medium mt-4", isDark ? "text-purple-300" : "text-purple-700")}>
            Loading your interview results...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cx("p-8 flex justify-center items-center min-h-screen", colors.bg)}>
        <div className={cx(
          "border-l-4 p-6 rounded-lg shadow-md max-w-2xl",
          isDark ? "bg-red-900/40 border-red-600 text-red-200" : "bg-red-50 border-red-500 text-red-700"
        )}>
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold">Error Loading Results</h3>
          </div>
          <p>{error}</p>
          <button 
            onClick={fetchInterviewResults}
            className={cx(
              "mt-4 px-4 py-2 rounded-lg transition-colors",
              isDark ? "bg-purple-700 text-white hover:bg-purple-600" : "bg-purple-600 text-white hover:bg-purple-700"
            )}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className={cx("p-8 flex justify-center items-center min-h-screen", colors.bg)}>
        <div className={cx(
          "border-l-4 p-6 rounded-lg shadow-md max-w-2xl",
          isDark ? "bg-blue-900/40 border-blue-600 text-blue-200" : "bg-blue-50 border-blue-500 text-blue-700"
        )}>
          <p className="font-medium">No interview data found for this application.</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 8) return isDark ? "text-green-300" : "text-green-600";
    if (score >= 6) return isDark ? "text-blue-300" : "text-blue-600";
    if (score >= 4) return isDark ? "text-yellow-300" : "text-yellow-600";
    return isDark ? "text-red-300" : "text-red-600";
  };

  const getScoreBackground = (score) => {
    if (score >= 8) return isDark ? "bg-green-900/30" : "bg-green-50";
    if (score >= 6) return isDark ? "bg-blue-900/30" : "bg-blue-50";
    if (score >= 4) return isDark ? "bg-yellow-900/30" : "bg-yellow-50";
    return isDark ? "bg-red-900/30" : "bg-red-50";
  };

  const getProgressColor = (score) => {
    if (score >= 8) return isDark ? "bg-green-500" : "bg-green-500";
    if (score >= 6) return isDark ? "bg-blue-500" : "bg-blue-500";
    if (score >= 4) return isDark ? "bg-yellow-500" : "bg-yellow-500";
    return isDark ? "bg-red-500" : "bg-red-500";
  };

  return (
    <div className={cx("min-h-screen pb-16", colors.bg)}>
      {/* Header with gradient background */}
      <div className={cx(
        "w-full py-8 px-6 md:px-8 mb-8",
        isDark 
          ? "bg-gradient-to-r from-purple-900/70 to-indigo-900/70 shadow-lg shadow-black/10" 
          : "bg-gradient-to-r from-purple-600 to-indigo-700 shadow-xl shadow-purple-900/10"
      )}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className={cx(
              "flex items-center text-sm font-medium mb-4 transition-all rounded-full px-3 py-1",
              isDark 
                ? "text-purple-200 hover:text-white bg-white/10 hover:bg-white/20" 
                : "text-white/90 hover:text-white bg-black/10 hover:bg-black/20"
            )}
          >
            <ArrowLeft className="mr-1" size={16} />
            Back to Applications
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2">Interview Results</h1>
          <div className="flex items-center text-white/80">
            <span>{interviewData.jobTitle}</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>{new Date(interviewData.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <Tabs defaultValue="summary" className="space-y-8">
          <TabsList className={cx(
            "p-1 rounded-full inline-flex",
            isDark ? "bg-gray-800/60 backdrop-blur" : "bg-white shadow-md shadow-black/5"
          )}>
            <TabsTrigger 
              value="summary"
              className={cx(
                "rounded-full transition-all",
                isDark 
                  ? "data-[state=active]:bg-purple-700 data-[state=active]:text-white data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:bg-gray-700/50" 
                  : "data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100"
              )}
            >
              Summary
            </TabsTrigger>
            <TabsTrigger 
              value="details"
              className={cx(
                "rounded-full transition-all",
                isDark 
                  ? "data-[state=active]:bg-purple-700 data-[state=active]:text-white data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:bg-gray-700/50" 
                  : "data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100"
              )}
            >
              Detailed Feedback
            </TabsTrigger>
            {interviewData.screenRecordingUrl && (
              <TabsTrigger 
                value="recording"
                className={cx(
                  "rounded-full transition-all",
                  isDark 
                    ? "data-[state=active]:bg-purple-700 data-[state=active]:text-white data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:bg-gray-700/50" 
                    : "data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100"
                )}
              >
                Recording
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="summary" className="space-y-8 animate-in fade-in-50 duration-300">
            <Card className={cx(
              "overflow-hidden border-0 rounded-xl", 
              isDark 
                ? "bg-gray-800/50 backdrop-blur shadow-xl shadow-black/20" 
                : "bg-white shadow-xl shadow-purple-900/5"
            )}>
              <CardHeader className={cx(
                "mb-4 bg-gradient-to-r text-white rounded-t-xl",
                isDark 
                  ? "from-purple-800 to-indigo-800" 
                  : "from-purple-600 to-indigo-600"
              )}>
                <CardTitle className="text-xl flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {interviewData.analysis && Object.entries(interviewData.analysis.overallScores).map(([category, score]) => (
                    <div key={category} className={cx(
                      `${getScoreBackground(score)} rounded-xl p-6 transition-all hover:shadow-lg group`,
                      isDark 
                        ? "hover:shadow-black/20 hover:-translate-y-1" 
                        : "hover:shadow-purple-900/10 hover:-translate-y-1"
                    )}>
                      <h3 className={cx(
                        "font-medium capitalize mb-1",
                        isDark ? "text-gray-200" : "text-gray-700"
                      )}>{category}</h3>
                      <div className={cx(`text-4xl font-bold ${getScoreColor(score)} mb-3 group-hover:scale-110 transition-transform origin-left`)}>{score}/10</div>
                      <Progress 
                        value={score * 10} 
                        className={cx("h-2 rounded-full", isDark ? "bg-gray-700" : "bg-gray-200")} 
                        indicatorClassName={cx(`${getProgressColor(score)} rounded-full`)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={cx(
                "border-0 rounded-xl overflow-hidden", 
                isDark 
                  ? "bg-gray-800/50 backdrop-blur shadow-lg shadow-black/10" 
                  : "bg-white shadow-lg shadow-purple-900/5"
              )}>
                <CardHeader className={cx(
                  "border-b",
                  isDark ? "bg-gray-800/80 border-gray-700" : "bg-gray-50 border-gray-100"
                )}>
                  <CardTitle className="text-lg flex items-center">
                    <Target className={cx("mr-2 h-5 w-5", isDark ? "text-blue-400" : "text-blue-600")} />
                    Key Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {interviewData.analysis && (
                    <ul className="space-y-4">
                      {interviewData.analysis.focusAreas.map((area, index) => (
                        <li key={index} className="flex items-start group">
                          <span className={cx(
                            "flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center mr-3 mt-0.5 text-sm font-bold transition-transform group-hover:scale-110",
                            isDark ? "bg-blue-900/60 text-blue-300" : "bg-blue-100 text-blue-600"
                          )}>
                            {index + 1}
                          </span>
                          <span className={cx(
                            colors.textSecondary,
                            "group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors"
                          )}>
                            {area}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card className={cx(
                "border-0 rounded-xl overflow-hidden", 
                isDark 
                  ? "bg-gray-800/50 backdrop-blur shadow-lg shadow-black/10" 
                  : "bg-white shadow-lg shadow-purple-900/5"
              )}>
                <CardHeader className={cx(
                  "border-b",
                  isDark ? "bg-gray-800/80 border-gray-700" : "bg-gray-50 border-gray-100"
                )}>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className={cx("mr-2 h-5 w-5", isDark ? "text-purple-400" : "text-purple-600")} />
                    Interview Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-5">
                    <div className="flex items-center group hover:bg-gray-50 dark:hover:bg-gray-700/30 p-2 rounded-lg transition-colors">
                      <div className={cx(
                        "h-12 w-12 rounded-lg flex items-center justify-center mr-4 transition-all group-hover:scale-110",
                        isDark ? "bg-purple-900/60 text-purple-300" : "bg-purple-100 text-purple-600"
                      )}>
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className={cx("text-sm", colors.textMuted)}>Job Title</h3>
                        <p className={cx("font-medium", colors.text)}>{interviewData.jobTitle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center group hover:bg-gray-50 dark:hover:bg-gray-700/30 p-2 rounded-lg transition-colors">
                      <div className={cx(
                        "h-12 w-12 rounded-lg flex items-center justify-center mr-4 transition-all group-hover:scale-110",
                        isDark ? "bg-blue-900/60 text-blue-300" : "bg-blue-100 text-blue-600"
                      )}>
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className={cx("text-sm", colors.textMuted)}>Date</h3>
                        <p className={cx("font-medium", colors.text)}>{new Date(interviewData.date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center group hover:bg-gray-50 dark:hover:bg-gray-700/30 p-2 rounded-lg transition-colors">
                      <div className={cx(
                        "h-12 w-12 rounded-lg flex items-center justify-center mr-4 transition-all group-hover:scale-110",
                        isDark ? "bg-green-900/60 text-green-300" : "bg-green-100 text-green-600"
                      )}>
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className={cx("text-sm", colors.textMuted)}>Time</h3>
                        <p className={cx("font-medium", colors.text)}>{interviewData.time}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 animate-in fade-in-50 duration-300">
            {interviewData.analysis && Object.entries(interviewData.analysis.feedback).map(([category, feedback], index) => (
              <Card key={category} className={cx(
                "border-0 rounded-xl overflow-hidden transition-all hover:shadow-xl",
                isDark 
                  ? "bg-gray-800/50 backdrop-blur shadow-lg shadow-black/10 hover:shadow-black/20" 
                  : "bg-white shadow-lg shadow-purple-900/5 hover:shadow-purple-900/10"
              )}>
                <CardHeader className={cx(
                  "bg-gradient-to-r text-white rounded-t-xl",
                  index % 3 === 0 
                    ? isDark ? 'from-blue-700 to-blue-900' : 'from-blue-600 to-blue-800' 
                    : index % 3 === 1 
                      ? isDark ? 'from-purple-700 to-purple-900' : 'from-purple-600 to-purple-800' 
                      : isDark ? 'from-indigo-700 to-indigo-900' : 'from-indigo-600 to-indigo-800'
                )}>
                  <CardTitle className="capitalize">{category}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6 border-b dark:border-gray-700">
                    <div className="flex items-center mb-4">
                      <div className={cx(
                        "h-9 w-9 rounded-full flex items-center justify-center mr-3",
                        isDark ? "bg-green-900/60 text-green-300" : "bg-green-100 text-green-600"
                      )}>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className={cx("font-semibold", colors.text)}>Strengths</h3>
                    </div>
                    <p className={cx("whitespace-pre-line leading-relaxed", colors.textSecondary)}>{feedback.strengths}</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={cx(
                        "h-9 w-9 rounded-full flex items-center justify-center mr-3",
                        isDark ? "bg-orange-900/60 text-orange-300" : "bg-orange-100 text-orange-600"
                      )}>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className={cx("font-semibold", colors.text)}>Areas for Improvement</h3>
                    </div>
                    <p className={cx("whitespace-pre-line leading-relaxed", colors.textSecondary)}>{feedback.areasOfImprovement}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {interviewData.screenRecordingUrl && (
            <TabsContent value="recording" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card className={cx(
                "border-0 rounded-xl overflow-hidden", 
                isDark 
                  ? "bg-gray-800/50 backdrop-blur shadow-xl shadow-black/20" 
                  : "bg-white shadow-xl shadow-purple-900/10"
              )}>
                <CardHeader className={cx(
                  "mb-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-t-xl"
                )}>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Video className="mr-2 h-5 w-5 text-purple-300" />
                      <span className="font-bold">Interview Recording</span>
                    </div>

                    <button 
                      onClick={handleDownloadVideo}
                      disabled={downloadingVideo}
                      className={cx(
                        "px-4 py-2 text-white rounded-full transition-all shadow-md flex items-center text-sm disabled:opacity-70 disabled:cursor-not-allowed",
                        isDark 
                          ? "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-blue-900/30" 
                          : "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-blue-900/20"
                      )}
                    >
                      {downloadingVideo ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download Video
                        </>
                      )}
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className={cx("rounded-xl overflow-hidden", 
                    isDark ? "shadow-lg shadow-black/30" : "shadow-lg shadow-black/10"
                  )}>
                    <video
                      controls
                      className="w-full h-auto max-h-96 bg-black"
                      src={interviewData.screenRecordingUrl}
                      poster="/video-thumbnail.jpg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className={cx(
                    "mt-6 p-5 rounded-xl border",
                    isDark 
                      ? "bg-gray-800/60 border-gray-700" 
                      : "bg-gray-50 border-gray-200"
                  )}>
                    <h3 className={cx("font-medium mb-3", colors.text)}>Playback Instructions</h3>
                    <p className={cx("text-sm leading-relaxed", colors.textSecondary)}>
                      This recording shows your entire interview session. Use the video controls to pause, 
                      rewind, or skip to specific parts of your interview. Watching your recording can help 
                      you identify areas for improvement mentioned in your feedback.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default InterviewResults;