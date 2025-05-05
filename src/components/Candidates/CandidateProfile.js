import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Calendar, Clock, ArrowLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
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
    duration: 30
  });

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('usertoken');
      if (!token) throw new Error('Authentication token not found');

      // Fetch application details
      const appResponse = await fetch(`https://auriter-backen.onrender.com/api/applications/${applicationId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!appResponse.ok) throw new Error('Failed to fetch application details');
      const appData = await appResponse.json();
      setApplication(appData);

      // Fetch analysis
      const analysisResponse = await fetch(`https://auriter-backen.onrender.com/api/applications/${applicationId}/analysis`, {
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
      const response = await fetch(`https://auriter-backen.onrender.com/api/applications/${applicationId}/status`, {
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
      const response = await fetch(`https://auriter-backen.onrender.com/api/applications/${applicationId}/resume`, {
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
      const token = Cookies.get('usertoken');
      const response = await fetch('https://auriter-backen.onrender.com/api/interview/schedule', {
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

      if (!response.ok) throw new Error('Failed to schedule interview');
      setShowInterviewModal(false);
      await fetchApplicationDetails();
    } catch (err) {
      setError(err.message);
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
            onClick={() => setShowInterviewModal(true)}
            className={`px-4 py-2 ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors duration-200`}
          >
            Schedule Interview
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
        <DialogContent className={isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
          <DialogHeader>
            <DialogTitle className={colors.text}>Schedule Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-1`}>Schedule Mock Interview</label>
              <textarea
                value={interviewDetails.document}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, document: e.target.value })}
                className={`w-full p-2 border ${colors.border} ${colors.bgCard} ${colors.text} rounded-lg focus:ring-2 ${isDark ? 'focus:ring-purple-500' : 'focus:ring-purple-600'} transition-colors duration-200`}
                rows={4}
                placeholder="Enter the topics to cover during the interview..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-1`}>Date</label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.textMuted}`} size={16} />
                  <input
                    type="date"
                    value={interviewDetails.date}
                    onChange={(e) => setInterviewDetails({ ...interviewDetails, date: e.target.value })}
                    className={`w-full pl-10 p-2 border ${colors.border} ${colors.bgCard} ${colors.text} rounded-lg focus:ring-2 ${isDark ? 'focus:ring-purple-500' : 'focus:ring-purple-600'} transition-colors duration-200`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-1`}>Time</label>
                <div className="relative">
                  <Clock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.textMuted}`} size={16} />
                  <input
                    type="time"
                    value={interviewDetails.time}
                    onChange={(e) => setInterviewDetails({ ...interviewDetails, time: e.target.value })}
                    className={`w-full pl-10 p-2 border ${colors.border} ${colors.bgCard} ${colors.text} rounded-lg focus:ring-2 ${isDark ? 'focus:ring-purple-500' : 'focus:ring-purple-600'} transition-colors duration-200`}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-1`}>Duration (minutes)</label>
              <input
                type="number"
                value={interviewDetails.duration}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, duration: parseInt(e.target.value) })}
                className={`w-full p-2 border ${colors.border} ${colors.bgCard} ${colors.text} rounded-lg focus:ring-2 ${isDark ? 'focus:ring-purple-500' : 'focus:ring-purple-600'} transition-colors duration-200`}
                min={15}
                max={120}
                step={5}
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowInterviewModal(false)}
              className={`px-4 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} rounded-lg transition-colors duration-200`}
            >
              Cancel
            </button>
            <button
              onClick={handleInterviewSubmit}
              className={`px-4 py-2 ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors duration-200`}
            >
              Schedule Interview
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidateProfile; 