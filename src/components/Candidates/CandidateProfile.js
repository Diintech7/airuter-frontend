import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Calendar, Clock, ArrowLeft, CheckCircle2, XCircle, AlertCircle, Loader2, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../UI/Dialog';

const CandidateProfile = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { isDark, colors, styles } = useThemeStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [application, setApplication] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState({
    document: '',
    date: '',
    time: '',
    duration: 30,
    questions: ''
  });
  const [interviewSubmitting, setInterviewSubmitting] = useState(false);
  const [interviewSubmitSuccess, setInterviewSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('usertoken');
      if (!token) throw new Error('Authentication token not found');

      // Fetch application details
      const appResponse = await fetch(`https://airuter-backend.onrender.com/api/applications/${applicationId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!appResponse.ok) throw new Error('Failed to fetch application details');
      const appData = await appResponse.json();
      setApplication(appData);

      // Fetch analysis
      const analysisResponse = await fetch(`https://airuter-backend.onrender.com/api/applications/${applicationId}/analysis`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json();
        setAnalysis(analysisData);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const token = Cookies.get('usertoken');
      const response = await fetch(`https://airuter-backend.onrender.com/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');
      await fetchApplicationDetails();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownloadResume = async () => {
    try {
      const token = Cookies.get('usertoken');
      const response = await fetch(`https://airuter-backend.onrender.com/api/applications/${applicationId}/resume`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to download resume');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${application.applicant.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInterviewSubmit = async () => {
    try {
      setInterviewSubmitting(true);
      const token = Cookies.get('usertoken');
      const endpoint = application?.interviewRoomId ? 'reschedule' : 'schedule';
      const response = await fetch(`https://airuter-backend.onrender.com/api/interview/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicationId,
          document: interviewDetails.document,
          date: interviewDetails.date,
          time: interviewDetails.time,
          duration: interviewDetails.duration
        })
      });

      if (!response.ok) throw new Error(`Failed to ${application?.interviewRoomId ? 'reschedule' : 'schedule'} interview`);
      setInterviewSubmitSuccess(true);
      toast.success('Interview scheduled successfully!');
      setTimeout(async () => {
        setShowInterviewModal(false);
        setInterviewSubmitSuccess(false);
        await fetchApplicationDetails();
      }, 700);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to schedule interview');
    } finally {
      setInterviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${colors.bg}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${isDark ? 'bg-red-900/20' : 'bg-red-50'} rounded-lg`}>
        <div className="flex items-center">
          <AlertCircle className={`mr-2 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
          <p className={isDark ? 'text-red-300' : 'text-red-800'}>{error}</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className={`p-4 ${isDark ? 'bg-yellow-900/20' : 'bg-yellow-50'} rounded-lg`}>
        <p className={isDark ? 'text-yellow-300' : 'text-yellow-800'}>Application not found</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 p-6 ${colors.bg} transition-colors duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center text-sm font-medium ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} ${styles.transition}`}
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Applications
        </button>
        <div className="flex items-center space-x-4">
          <select
            value={application.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-4 py-2 border ${colors.border} ${colors.bgCard} ${colors.text} rounded-lg focus:ring-2 ${isDark ? 'focus:ring-purple-500' : 'focus:ring-purple-600'} transition-colors duration-200`}
          >
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={() => {
              // Prefill if interview exists on application
              if (application?.interviewRoomId) {
                // Attempt to reuse details already fetched in analysis or elsewhere is minimal; keep blank if not present
                setInterviewDetails((prev) => ({ ...prev }))
              }
              setShowInterviewModal(true)
            }}
            className={`px-4 py-2 ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors duration-200`}
          >
            {application?.interviewRoomId ? 'Reschedule' : 'Schedule Interview'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Info */}
        <div className={`lg:col-span-1 ${colors.bgCard} p-6 rounded-xl shadow-md`}>
          <h2 className={`text-xl font-semibold mb-4 ${colors.text}`}>Candidate Information</h2>
          <div className="space-y-4">
            <div>
              <p className={`text-sm ${colors.textSecondary}`}>Name</p>
              <p className={`font-medium ${colors.text}`}>{application.applicant.name}</p>
            </div>
            <div>
              <p className={`text-sm ${colors.textSecondary}`}>Email</p>
              <p className={`font-medium ${colors.text}`}>{application.applicant.email}</p>
            </div>
            <div>
              <p className={`text-sm ${colors.textSecondary}`}>Applied Position</p>
              <p className={`font-medium ${colors.text}`}>{application.job.title}</p>
            </div>
            <div>
              <p className={`text-sm ${colors.textSecondary}`}>Application Date</p>
              <p className={`font-medium ${colors.text}`}>
                {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={handleDownloadResume}
              className={`flex items-center justify-center w-full px-4 py-2 mt-4 ${isDark ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-lg transition-colors duration-200`}
            >
              <Download className="mr-2" size={16} />
              Download Resume
            </button>
          </div>
        </div>

        {/* Resume Analysis */}
        <div className={`lg:col-span-2 ${colors.bgCard} p-6 rounded-xl shadow-md`}>
          <h2 className={`text-xl font-semibold mb-4 ${colors.text}`}>Resume Analysis</h2>
          {analysis ? (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${colors.textSecondary}`}>Overall Match</p>
                  <p className={`text-2xl font-bold ${colors.text}`}>
                    {analysis.feedback[0]?.score || 0}%
                  </p>
                </div>
                <div className={`w-48 h-2 ${colors.sectionBg} rounded-full overflow-hidden`}>
                  <div
                    className={`h-full ${analysis.feedback[0]?.score >= 80 ? 'bg-green-500' : analysis.feedback[0]?.score >= 60 ? 'bg-blue-500' : analysis.feedback[0]?.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'} rounded-full transition-all duration-300`}
                    style={{ width: `${analysis.feedback[0]?.score || 0}%` }}
                  />
                </div>
              </div>

              {/* Key Findings */}
              <div>
                <h3 className={`text-lg font-medium mb-2 ${colors.text}`}>Key Findings</h3>
                <ul className={`space-y-2 ${colors.textSecondary}`}>
                  {analysis.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className={`mr-2 mt-1 ${isDark ? 'text-green-400' : 'text-green-500'}`} size={16} />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div>
                <h3 className={`text-lg font-medium mb-2 ${colors.text}`}>Suggestions</h3>
                <ul className={`space-y-2 ${colors.textSecondary}`}>
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <AlertCircle className={`mr-2 mt-1 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} size={16} />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className={`text-center py-8 ${colors.textSecondary}`}>
              <p>No analysis available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Interview Modal */}
      <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
        <DialogContent className={`${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'} max-w-2xl`}>
          <DialogHeader>
            <DialogTitle className={`${colors.text} text-xl font-semibold`}>
              {application?.interviewRoomId ? 'Reschedule AI Interview' : 'Schedule AI Interview'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Date and Time Section - Top Priority */}
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'} border`}>
              <h3 className={`text-lg font-medium ${colors.text} mb-3 flex items-center`}>
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${colors.text} mb-2`}>Interview Date</label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.textMuted}`} size={16} />
                    <input
                      type="date"
                      value={interviewDetails.date}
                      onChange={(e) => setInterviewDetails({ ...interviewDetails, date: e.target.value })}
                      className={`w-full pl-10 pr-3 py-2.5 border ${colors.border} ${colors.bgCard} ${colors.text} rounded-lg focus:ring-2 ${isDark ? 'focus:ring-purple-500 focus:border-purple-500' : 'focus:ring-purple-600 focus:border-purple-600'} transition-all duration-200`}
                      required
                      disabled={interviewSubmitting}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${colors.text} mb-2`}>Interview Time</label>
                  <div className="relative">
                    <Clock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.textMuted}`} size={16} />
                    <input
                      type="time"
                      value={interviewDetails.time}
                      onChange={(e) => setInterviewDetails({ ...interviewDetails, time: e.target.value })}
                      className={`w-full pl-10 pr-3 py-2.5 border ${colors.border} ${colors.bgCard} ${colors.text} rounded-lg focus:ring-2 ${isDark ? 'focus:ring-purple-500 focus:border-purple-500' : 'focus:ring-purple-600 focus:border-purple-600'} transition-all duration-200`}
                      required
                      disabled={interviewSubmitting}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${colors.text} mb-2`}>Duration (minutes)</label>
                  <select
                    value={interviewDetails.duration}
                    onChange={(e) => setInterviewDetails({ ...interviewDetails, duration: parseInt(e.target.value) })}
                    className={`w-full px-3 py-2.5 border ${colors.border} ${colors.bgCard} ${colors.text} rounded-lg focus:ring-2 ${isDark ? 'focus:ring-purple-500 focus:border-purple-500' : 'focus:ring-purple-600 focus:border-purple-600'} transition-all duration-200`}
                    disabled={interviewSubmitting}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Interview Topics Section */}
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'} border`}>
              <h3 className={`text-lg font-medium ${colors.text} mb-3 flex items-center`}>
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Interview Topics & Focus Areas
              </h3>
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                  Topics to Cover During Interview
                </label>
                <textarea
                  value={interviewDetails.document}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, document: e.target.value })}
                  className={`w-full p-3 border ${colors.border} ${colors.bgCard} ${colors.text} rounded-lg focus:ring-2 ${isDark ? 'focus:ring-purple-500 focus:border-purple-500' : 'focus:ring-purple-600 focus:border-purple-600'} transition-all duration-200 resize-none`}
                  rows={3}
                  disabled={interviewSubmitting}
                />
                <p className={`text-sm ${colors.textMuted} mt-2`}>
                  Provide detailed topics to ensure the AI interviewer asks relevant questions.
                </p>
              </div>
            </div>

            {/* Questions Section */}
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-200'} border`}>
              <h3 className={`text-lg font-medium ${colors.text} mb-3 flex items-center`}>
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Specific Questions (Optional)
              </h3>
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                  Custom Questions for the Interview
                </label>
                <textarea
                  value={interviewDetails.questions}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, questions: e.target.value })}
                  className={`w-full p-3 border ${colors.border} ${colors.bgCard} ${colors.text} rounded-lg focus:ring-2 ${isDark ? 'focus:ring-purple-500 focus:border-purple-500' : 'focus:ring-purple-600 focus:border-purple-600'} transition-all duration-200 resize-none`}
                  rows={3}
                  disabled={interviewSubmitting}
                />
                <p className={`text-sm ${colors.textMuted} mt-2`}>
                  Leave empty to let the AI generate questions based on the job requirements and topics above.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-6">
            <button
              onClick={() => setShowInterviewModal(false)}
              className={`px-6 py-2.5 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200'} border rounded-lg transition-all duration-200 font-medium`}
              disabled={interviewSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleInterviewSubmit}
              disabled={!interviewDetails.date || !interviewDetails.time || interviewSubmitting}
              className={`px-6 py-2.5 ${
                (!interviewDetails.date || !interviewDetails.time)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isDark
                    ? 'bg-blue-700 hover:bg-blue-600'
                    : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${interviewSubmitting ? 'animate-pulse' : ''}`}
            >
              {interviewSubmitSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Scheduled
                </>
              ) : interviewSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4" />
                  {application?.interviewRoomId ? 'Reschedule Interview' : 'Schedule Interview'}
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidateProfile; 