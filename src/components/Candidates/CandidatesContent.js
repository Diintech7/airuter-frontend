import React, { useState, useEffect } from 'react';
import { Search, Download, Calendar, Clock } from 'lucide-react';
import Cookies from 'js-cookie';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../UI/Dialog';
import { Alert } from '../Alerts/Alert';
import { AlertDialog as AlertDescription } from '../Alerts/AlertDialog';
import ScoreTooltip from './ScoreTooltip';
import { useNavigate } from 'react-router-dom';
import { useThemeStyles } from '../hooks/useThemeStyles';

const CandidatesContent = () => {
  const { colors, styles, isDark } = useThemeStyles();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    rejected: 0
  });
  const [hoveredApplication, setHoveredApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [analysisMap, setAnalysisMap] = useState({});
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    document: '',
    date: '',
    time: '',
    duration: 30 
  });
  const [interviewDataMap, setInterviewDataMap] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchApplications();
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      searchApplications();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedStatus, selectedJobType]);
  
  const fetchApplications = async () => {
    try {
      setError('');
      const token = Cookies.get('usertoken');
      if (!token) throw new Error('Authentication token not found');
      const response = await fetch('https://auriter-backen.onrender.com/api/applications/company', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setApplications(data.applications);
      setStats(data.stats);
      await Promise.all([
        ...data.applications.map(fetchAnalysis),
        ...data.applications.map(fetchInterviewData)
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAnalysis = async (application) => {
    try {
      const token = Cookies.get('usertoken');
      const response = await fetch(`https://auriter-backen.onrender.com/api/applications/${application._id}/analysis`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const analysisData = await response.json();
        setAnalysisMap(prev => ({
          ...prev,
          [application._id]: analysisData
        }));
      }
    } catch (error) {
      console.error(`Error fetching analysis for application ${application._id}:`, error);
    }
  };
  
  const fetchInterviewData = async (application) => {
    try {
      const token = Cookies.get('usertoken');
      if (application.interviewRoomId) {
        const response = await fetch(`https://auriter-backen.onrender.com/api/interview/application/${application._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.interview) {
            setInterviewDataMap(prev => ({
              ...prev,
              [application._id]: data.interview
            }));
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching interview data for application ${application._id}:`, error);
    }
  };
  
  const searchApplications = async () => {
    try {
      setError('');
      const token = Cookies.get('usertoken');
      if (!token) throw new Error('Authentication token not found');
      const params = new URLSearchParams({
        ...(searchTerm && { searchTerm }),
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        ...(selectedJobType !== 'all' && { jobType: selectedJobType })
      });
      const response = await fetch(`https://auriter-backen.onrender.com/api/applications/search?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setApplications(data.applications);
      setStats(data.stats);

      // Fetch interview data for the new search results
      await Promise.all(data.applications.map(fetchInterviewData));
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleStatusChange = async (applicationId, newStatus) => {
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
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      await fetchApplications();
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Job Title', 'Status', 'Match %', 'Applied Date'],
      ...applications.map(app => [
        app.applicant.name,
        app.applicant.email,
        app.job.title,
        app.status,
        analysisMap[app._id]?.feedback?.[0]?.score || 'N/A',
        new Date(app.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  
  const renderMatchCell = (application) => {
    const analysis = analysisMap[application._id];
    if (!analysis) {
      return (
        <td className={`px-6 py-4 ${colors.textMuted}`}>
          <div className="text-sm">Analysis not available</div>
        </td>
      );
    }
    const overallScore = analysis.feedback.find(f => f.category === 'Overall Match')?.score ||
                        analysis.feedback[0]?.score || 0;
    const getScoreColor = (score) => {
      if (score >= 80) return 'bg-green-500';
      if (score >= 60) return 'bg-blue-500';
      if (score >= 40) return 'bg-yellow-500';
      return 'bg-red-500';
    };
    return (
      <td className="px-6 py-4 relative">
        <div
          className="flex items-center cursor-pointer"
          onMouseEnter={() => setHoveredApplication(application._id)}
          onMouseLeave={() => setHoveredApplication(null)}
          onClick={() => {
            setSelectedAnalysis(analysis);
            setShowAnalysisDialog(true);
          }}
        >
          <div className={`w-16 text-sm font-medium ${colors.text}`}>
            {Math.round(overallScore)}%
          </div>
          <div className={`w-24 h-2 ${colors.sectionBg} rounded`}>
            <div
              className={`h-full ${getScoreColor(overallScore)} rounded transition-all duration-300`}
              style={{ width: `${overallScore}%` }}
            />
          </div>
          {hoveredApplication === application._id && (
            <ScoreTooltip analysis={analysis} />
          )}
        </div>
      </td>
    );
  };
  
  const handleSendInterviewLink = (application) => {
    setSelectedApplication(application);
    setShowInterviewModal(true);
    setInterviewDetails({
      document: '',
      date: '',
      time: '',
      duration: 30
    });
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
          applicationId: selectedApplication._id,
          document: interviewDetails.document,
          date: interviewDetails.date,
          time: interviewDetails.time,
          duration: interviewDetails.duration
        })
      });

      if (!response.ok) {
        throw new Error('Failed to schedule interview');
      }
      await response.json();
      alert('Interview scheduled successfully!');
      setShowInterviewModal(false);
      await fetchApplications();
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleViewResults = (applicationId) => {
    navigate(`/interview-resultss/${applicationId}`);
  };
  
  const getStatusBadgeClass = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
    switch(status) {
      case 'pending':
        return `${baseClasses} ${isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`;
      case 'reviewed':
        return `${baseClasses} ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`;
      case 'shortlisted':
        return `${baseClasses} ${isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`;
      case 'rejected':
        return `${baseClasses} ${isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`;
      default:
        return `${baseClasses} ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`;
    }
  };
  
  // Gradient styles for stat cards
  const getStatCardStyles = (type) => {
    if (isDark) {
      switch(type) {
        case 'total':
          return 'bg-gradient-to-br from-purple-800 to-indigo-900 text-purple-100 border border-purple-700';
        case 'pending':
          return 'bg-gradient-to-br from-yellow-800 to-amber-900 text-yellow-100 border border-yellow-700';
        case 'reviewed':
          return 'bg-gradient-to-br from-blue-800 to-cyan-900 text-blue-100 border border-blue-700';
        case 'shortlisted':
          return 'bg-gradient-to-br from-green-800 to-emerald-900 text-green-100 border border-green-700';
        case 'rejected':
          return 'bg-gradient-to-br from-red-800 to-rose-900 text-red-100 border border-red-700';
        default:
          return 'bg-gray-700 hover:bg-gray-600';
      }
    } else {
      switch(type) {
        case 'total':
          return 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white';
        case 'pending':
          return 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white';
        case 'reviewed':
          return 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white';
        case 'shortlisted':
          return 'bg-gradient-to-br from-green-500 to-emerald-600 text-white';
        case 'rejected':
          return 'bg-gradient-to-br from-red-500 to-rose-600 text-white';
        default:
          return 'bg-white hover:bg-gray-50';
      }
    }
  };
  
  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${colors.bg}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }
  
  const primaryButtonClass = `px-4 py-2 ${isDark ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-lg transition-colors duration-200`;
  const secondaryButtonClass = `px-4 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} rounded-lg transition-colors duration-200`;
  
  return (
    <div className={`space-y-6 p-6 ${colors.bg} transition-colors duration-300`}>
      <Card className={`w-full ${isDark ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-md'} transition-all duration-300`}>
        <CardHeader className={`${isDark ? 'border-b border-gray-700' : 'border-b border-gray-100'}`}>
          <CardTitle className={colors.text}>Applications Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <br />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className={`rounded-lg shadow-md p-4 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${getStatCardStyles('total')}`}>
              <div className="text-lg font-semibold">Total</div>
              <div className="text-3xl font-bold">{stats.total}</div>
            </div>
            
            <div className={`rounded-lg shadow-md p-4 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${getStatCardStyles('pending')}`}>
              <div className="text-lg font-semibold">Pending</div>
              <div className="text-3xl font-bold">{stats.pending}</div>
            </div>
            
            <div className={`rounded-lg shadow-md p-4 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${getStatCardStyles('reviewed')}`}>
              <div className="text-lg font-semibold">Reviewed</div>
              <div className="text-3xl font-bold">{stats.reviewed}</div>
            </div>
            
            <div className={`rounded-lg shadow-md p-4 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${getStatCardStyles('shortlisted')}`}>
              <div className="text-lg font-semibold">Shortlisted</div>
              <div className="text-3xl font-bold">{stats.shortlisted}</div>
            </div>
            
            <div className={`rounded-lg shadow-md p-4 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${getStatCardStyles('rejected')}`}>
              <div className="text-lg font-semibold">Rejected</div>
              <div className="text-3xl font-bold">{stats.rejected}</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.textMuted}`} />
              <input
                type="text"
                className={`w-full pl-10 pr-4 py-2 border ${colors.border} ${colors.bgCard} ${colors.text} rounded-lg focus:ring-2 ${isDark ? 'focus:ring-purple-500 focus:border-purple-500' : 'focus:ring-purple-600 focus:border-purple-600'} transition-colors duration-200`}
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-40 px-4 py-2 border ${colors.border} ${colors.bgCard} ${colors.text} rounded-lg focus:ring-2 ${isDark ? 'focus:ring-purple-500 focus:border-purple-500' : 'focus:ring-purple-600 focus:border-purple-600'} transition-colors duration-200`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className={`w-40 px-4 py-2 border ${colors.border} ${colors.bgCard} ${colors.text} rounded-lg focus:ring-2 ${isDark ? 'focus:ring-purple-500 focus:border-purple-500' : 'focus:ring-purple-600 focus:border-purple-600'} transition-colors duration-200`}
            >
              <option value="all">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            <button
              onClick={handleExport}
              className={`flex items-center px-4 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'} border rounded-lg transition-colors duration-200`}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
          {error && (
            <Alert className={`mb-4 ${isDark ? 'bg-red-900 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-800'}`}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className={`overflow-x-auto rounded-lg border ${colors.border} transition-colors duration-200`}>
            <table className={`min-w-full divide-y ${colors.border}`}>
              <thead className={`${colors.sectionBg}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${colors.textMuted} uppercase tracking-wider`}>
                    Candidate
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${colors.textMuted} uppercase tracking-wider`}>
                    Job
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${colors.textMuted} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${colors.textMuted} uppercase tracking-wider`}>
                    Match %
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${colors.textMuted} uppercase tracking-wider`}>
                    Applied Date
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${colors.textMuted} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${colors.bgCard} divide-y ${colors.border}`}>
                {applications.length > 0 ? (
                  applications.map((application) => (
                    <tr 
                      key={application._id} 
                      className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-200 cursor-pointer`}
                      onClick={() => navigate(`/candidates/${application._id}`)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className={`font-medium ${colors.text}`}>{application.applicant.name}</div>
                          <div className={`text-sm ${colors.textSecondary}`}>{application.applicant.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${colors.text}`}>{application.job.title}</div>
                        <div className={`text-sm ${colors.textSecondary}`}>{application.job.type}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className={getStatusBadgeClass(application.status)}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                          <select
                            value={application.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleStatusChange(application._id, e.target.value)}
                            className={`ml-2 px-2 py-1 text-sm border ${colors.border} ${colors.bgCard} ${colors.text} rounded-md focus:ring-2 ${isDark ? 'focus:ring-purple-500' : 'focus:ring-purple-600'} transition-colors duration-200`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </td>
                      {renderMatchCell(application)}
                      <td className={`px-6 py-4 text-sm ${colors.textSecondary}`}>
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {!application.interviewRoomId ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendInterviewLink(application);
                              }}
                              className={`px-3 py-1.5 ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white text-sm rounded-lg transition-colors duration-200`}
                            >
                              Send Link
                            </button>
                          ) : (
                            interviewDataMap[application._id]?.screenRecordingUrl ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewResults(application._id);
                                }}
                                className={`px-3 py-1.5 ${isDark ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white text-sm rounded-lg transition-colors duration-200`}
                              >
                                View Results
                              </button>
                            ) : (
                              <div className={`px-3 py-1.5 text-center ${isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'} text-sm rounded-lg`}>
                                Scheduled
                              </div>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className={`px-6 py-10 text-center ${colors.textMuted}`}>
                      No applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
        <DialogContent className={isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
          <DialogHeader>
            <DialogTitle className={colors.text}>Schedule Mock Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-1`}>Interview Topics</label>
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
              className={secondaryButtonClass}
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
      
      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent className={isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
          <DialogHeader>
            <DialogTitle className={colors.text}>Resume Analysis</DialogTitle>
          </DialogHeader>
          {selectedAnalysis && (
            <div className="space-y-4">
              <div>
                <h3 className={`font-semibold mb-2 ${colors.text}`}>Key Findings</h3>
                <ul className={`list-disc pl-5 ${colors.textSecondary} space-y-1`}>
                  {selectedAnalysis.keyFindings.map((finding, index) => (
                    <li key={index} className="transition-colors duration-200">{finding}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={`font-semibold mb-2 ${colors.text}`}>Suggestions</h3>
                <ul className={`list-disc pl-5 ${colors.textSecondary} space-y-1`}>
                  {selectedAnalysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="transition-colors duration-200">{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => setShowAnalysisDialog(false)}
              className={`px-4 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} rounded-lg transition-colors duration-200`}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidatesContent;