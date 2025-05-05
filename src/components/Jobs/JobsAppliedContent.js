import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Building2, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  Briefcase,
  Calendar,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Video,
  Sparkles,
  Star,
  BarChart3,
  Medal
} from 'lucide-react';
import Cookies from 'js-cookie';
import { useTheme } from '../../context/ThemeContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { motion, AnimatePresence } from 'framer-motion';

const JobsAppliedContent = () => {
  const { theme } = useTheme();
  const { isDark, colors, styles, cx } = useThemeStyles();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://auriter-backen.onrender.com/api/jobs-applied/my-applications', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('usertoken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      setApplications(data.applications || []);
      setStats(data.stats || {});
      setLoading(false);
      
      if (data.warnings) {
        console.warn(data.warnings);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(`Failed to fetch applications: ${err.message}`);
      setApplications([]);
      setStats({});
      setLoading(false);
    }
  };

  const toggleDetails = (id) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getStatusGradient = (status) => {
    const gradients = {
      accepted: isDark 
        ? 'bg-gradient-to-r from-green-800 to-emerald-700' 
        : 'bg-gradient-to-r from-green-50 to-emerald-100',
      rejected: isDark 
        ? 'bg-gradient-to-r from-red-800 to-rose-700' 
        : 'bg-gradient-to-r from-red-50 to-rose-100',
      pending: isDark 
        ? 'bg-gradient-to-r from-yellow-800 to-amber-700' 
        : 'bg-gradient-to-r from-yellow-50 to-amber-100',
      reviewed: isDark 
        ? 'bg-gradient-to-r from-blue-800 to-indigo-700' 
        : 'bg-gradient-to-r from-blue-50 to-indigo-100',
      shortlisted: isDark 
        ? 'bg-gradient-to-r from-purple-800 to-violet-700' 
        : 'bg-gradient-to-r from-purple-50 to-violet-100'
    };
    return gradients[status] || (isDark 
      ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
      : 'bg-gradient-to-r from-gray-50 to-gray-100');
  };

  const getCardGradient = (status) => {
    const cardGradients = {
      accepted: isDark 
        ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-green-900/50' 
        : 'bg-gradient-to-br from-white via-white to-green-50',
      rejected: isDark 
        ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-red-900/50' 
        : 'bg-gradient-to-br from-white via-white to-red-50',
      pending: isDark 
        ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-yellow-900/50' 
        : 'bg-gradient-to-br from-white via-white to-yellow-50',
      reviewed: isDark 
        ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-blue-900/50' 
        : 'bg-gradient-to-br from-white via-white to-blue-50',
      shortlisted: isDark 
        ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-purple-900/50' 
        : 'bg-gradient-to-br from-white via-white to-purple-50'
    };
    return cardGradients[status] || (isDark 
      ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
      : 'bg-gradient-to-br from-white to-gray-50');
  };

  const getStatusBadgeStyle = (status) => {
    const baseStyles = {
      accepted: {
        bg: isDark ? 'bg-green-900/70' : 'bg-green-100',
        text: isDark ? 'text-green-200' : 'text-green-800',
        border: isDark ? 'border-green-700' : 'border-green-300',
        icon: <CheckCircle className="w-4 h-4" />
      },
      rejected: {
        bg: isDark ? 'bg-red-900/70' : 'bg-red-100',
        text: isDark ? 'text-red-200' : 'text-red-800',
        border: isDark ? 'border-red-700' : 'border-red-300',
        icon: <XCircle className="w-4 h-4" />
      },
      pending: {
        bg: isDark ? 'bg-yellow-900/70' : 'bg-yellow-100',
        text: isDark ? 'text-yellow-200' : 'text-yellow-800',
        border: isDark ? 'border-yellow-700' : 'border-yellow-300',
        icon: <AlertCircle className="w-4 h-4" />
      },
      reviewed: {
        bg: isDark ? 'bg-blue-900/70' : 'bg-blue-100',
        text: isDark ? 'text-blue-200' : 'text-blue-800',
        border: isDark ? 'border-blue-700' : 'border-blue-300',
        icon: <Clock className="w-4 h-4" />
      },
      shortlisted: {
        bg: isDark ? 'bg-purple-900/70' : 'bg-purple-100',
        text: isDark ? 'text-purple-200' : 'text-purple-800',
        border: isDark ? 'border-purple-700' : 'border-purple-300',
        icon: <ArrowUpRight className="w-4 h-4" />
      }
    };
    
    const style = baseStyles[status] || {
      bg: isDark ? 'bg-gray-700' : 'bg-gray-100',
      text: isDark ? 'text-gray-300' : 'text-gray-800',
      border: isDark ? 'border-gray-600' : 'border-gray-300',
      icon: <AlertCircle className="w-4 h-4" />
    };
    
    return {
      className: `${style.bg} ${style.text} ${style.border} backdrop-blur-sm`,
      icon: style.icon
    };
  };

  const filteredApplications = Array.isArray(applications) ? applications
    .filter(app => {
      const matchesSearch = searchTerm === '' || 
        app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.company?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    }) : [];

  const InterviewDetails = ({ application }) => {
    if (!application.interview && !application.interviewRoomId) return null;
    
    const { interview, interviewRoomId } = application;

    const buttonStyle = interview?.recordedAt 
      ? "px-4 py-2 bg-green-600 text-white text-sm rounded-full hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
      : "px-4 py-2 bg-purple-600 text-white text-sm rounded-full hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg";
    
    const buttonText = interview?.recordedAt ? "View Recording" : "Attend Interview";
    const buttonAction = () => {
      if (interview?.recordedAt && interview?.screenRecordingUrl) {
        window.open(interview.screenRecordingUrl, '_blank');
      } else if (interviewRoomId) {
        window.open(`https://auriter-frontend.vercel.app/interview/${interviewRoomId}`, '_blank');
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cx(
          "mt-4 p-5 rounded-xl backdrop-blur-md",
          isDark ? "bg-gray-800/80 ring-1 ring-gray-700" : "bg-white/90 ring-1 ring-gray-200 shadow-sm"
        )}
      >
        <h3 className={cx("text-md font-semibold mb-3 flex items-center gap-2", colors.text)}>
          <Video className="w-5 h-5 text-purple-500" />
          Interview Details
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          {interview?.date && (
            <div className={cx("flex items-center px-3 py-1 rounded-full", isDark ? "bg-gray-700/70" : "bg-gray-100", colors.textSecondary)}>
              <Calendar className="w-4 h-4 mr-2" />
              <span>{interview.date}</span>
            </div>
          )}
          {interview?.time && (
            <div className={cx("flex items-center px-3 py-1 rounded-full", isDark ? "bg-gray-700/70" : "bg-gray-100", colors.textSecondary)}>
              <Clock className="w-4 h-4 mr-2" />
              <span>{interview.time}</span>
            </div>
          )}
          {(interviewRoomId || (interview?.screenRecordingUrl && interview?.recordedAt)) && (
            <button
              onClick={buttonAction}
              className={buttonStyle}
            >
              {interview?.recordedAt ? <Video className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              {buttonText}
            </button>
          )}
        </div>
        {interview?.recordedAt && (
          <div className={cx("mt-2 text-xs", colors.textSecondary)}>
            Recorded on: {new Date(interview.recordedAt).toLocaleString()}
          </div>
        )}
        {interview?.analysis?.analyzedAt && (
          <div className={cx("mt-4 pt-3 border-t", colors.border)}>
            <div className={cx("text-sm font-medium mb-2 flex items-center gap-2", colors.text)}>
              <BarChart3 className="w-4 h-4 text-purple-500" />
              Interview Analysis
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              {interview.analysis.overallScores && Object.entries(interview.analysis.overallScores).map(([key, score]) => {
                const scoreColor = score >= 8 ? 
                  (isDark ? 'text-green-400' : 'text-green-600') : 
                  score >= 6 ? 
                    (isDark ? 'text-yellow-400' : 'text-yellow-600') : 
                    (isDark ? 'text-red-400' : 'text-red-600');
                
                return (
                  <motion.div 
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    className={cx(
                      "p-3 rounded-lg shadow-sm",
                      isDark ? "bg-gray-700/80" : "bg-white ring-1 ring-gray-100"
                    )}
                  >
                    <div className={cx("text-xs capitalize flex items-center gap-1", colors.textSecondary)}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className={cx("text-xl font-bold", scoreColor)}>
                        {score}/10
                      </div>
                      {score >= 8 && <Medal className="w-4 h-4 text-yellow-500" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className={cx("flex justify-center items-center h-screen", colors.bg)}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 text-center"
        >
          <div className="relative w-16 h-16 mx-auto">
            <motion.div 
              animate={{ 
                rotate: 360,
                transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
              }}
              className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600"
            />
            <Briefcase className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-600" />
          </div>
          <p className={cx("text-lg font-medium", colors.text)}>Loading your applications</p>
          <p className={cx("text-sm", colors.textSecondary)}>Gathering your career journey...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cx("max-w-2xl mx-auto mt-8 p-6 rounded-xl shadow-lg", isDark ? "bg-red-900/50 text-white" : "bg-red-50 text-red-800")}
      >
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="w-6 h-6" />
          Error Loading Applications
        </h2>
        <p className="mb-4">{error}</p>
        <button 
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchApplications();
          }}
          className="px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <span>Try Again</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  const statIconMap = {
    "total_applications": <Briefcase className="w-5 h-5" />,
    "accepted": <CheckCircle className="w-5 h-5" />,
    "rejected": <XCircle className="w-5 h-5" />,
    "pending": <Clock className="w-5 h-5" />,
    "reviewed": <BarChart3 className="w-5 h-5" />,
    "shortlisted": <Star className="w-5 h-5" />
  };

  return (
    <div className={cx("max-w-7xl mx-auto px-4 py-8", colors.bg)}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className={cx("text-3xl md:text-4xl font-bold", colors.text)}>My Applications</h1>
          <p className={cx("mt-2 text-lg", colors.textSecondary)}>Track and manage your career journey</p>
        </div>
        <button 
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={cx(
            "px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300",
            isDark ? 
              "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700" : 
              "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm"
          )}
        >
          <Filter className="w-4 h-4" />
          Filters
          {isFiltersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
      >
        {Object.entries(stats || {}).map(([key, value], index) => {
          const icon = statIconMap[key] || <Briefcase className="w-5 h-5" />;
          
          let gradientClasses;
          let textColor;
          
          switch(key) {
            case "accepted":
              gradientClasses = isDark ? "from-green-900 to-green-800" : "from-green-50 to-green-100";
              textColor = isDark ? "text-green-400" : "text-green-600";
              break;
            case "rejected":
              gradientClasses = isDark ? "from-red-900 to-red-800" : "from-red-50 to-red-100";
              textColor = isDark ? "text-red-400" : "text-red-600";
              break;
            case "pending":
              gradientClasses = isDark ? "from-yellow-900 to-yellow-800" : "from-yellow-50 to-yellow-100";
              textColor = isDark ? "text-yellow-400" : "text-yellow-600";
              break;
            case "reviewed":
              gradientClasses = isDark ? "from-blue-900 to-blue-800" : "from-blue-50 to-blue-100";
              textColor = isDark ? "text-blue-400" : "text-blue-600";
              break;
            case "shortlisted":
              gradientClasses = isDark ? "from-purple-900 to-purple-800" : "from-purple-50 to-purple-100";
              textColor = isDark ? "text-purple-400" : "text-purple-600";
              break;
            default:
              gradientClasses = isDark ? "from-gray-800 to-gray-700" : "from-gray-50 to-gray-100";
              textColor = isDark ? "text-gray-400" : "text-gray-600";
          }
          
          return (
            <motion.div 
              key={key}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className={cx(
                "rounded-xl bg-gradient-to-br shadow-md p-5 transition-all duration-300",
                `${gradientClasses}`,
                isDark ? "ring-1 ring-gray-700" : "ring-1 ring-gray-200"
              )}
            >
              <div className={cx(
                "w-10 h-10 rounded-full flex items-center justify-center mb-3",
                isDark ? "bg-gray-800/80" : "bg-white/80",
                textColor
              )}>
                {icon}
              </div>
              <div className={cx("text-3xl font-bold mb-1", isDark ? "text-white" : "text-gray-900")}>
                {value}
              </div>
              <div className={cx("text-sm font-medium capitalize", isDark ? "text-gray-300" : "text-gray-600")}>
                {key.replace(/_/g, ' ')}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className={cx(
              "p-5 rounded-xl mb-6",
              isDark ? "bg-gray-800/80 backdrop-blur-md ring-1 ring-gray-700" : "bg-white/80 backdrop-blur-md shadow-md ring-1 ring-gray-200"
            )}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by job title or company..."
                    className={cx(
                      "pl-10 pr-4 py-3 w-full border rounded-lg",
                      isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
                      "focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    )}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className={cx(
                    "w-full md:w-[180px] border rounded-lg p-3",
                    isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900",
                    "focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  )}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  className={cx(
                    "w-full md:w-[180px] border rounded-lg p-3",
                    isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900",
                    "focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  )}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredApplications.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cx(
            "text-center py-16 rounded-xl",
            isDark ? "bg-gray-800/80 backdrop-blur-md ring-1 ring-gray-700" : "bg-white/80 backdrop-blur-md shadow-md ring-1 ring-gray-200"
          )}
        >
          <Briefcase className={cx("mx-auto h-16 w-16 mb-4", colors.textMuted)} />
          <p className={cx("text-xl font-medium mb-2", colors.text)}>No applications found</p>
          <p className={cx("max-w-md mx-auto", colors.textSecondary)}>
            {searchTerm || statusFilter !== 'all' 
              ? "No applications match your current filters. Try adjusting your search criteria or filters."
              : "You haven't applied to any jobs yet. Start your career journey by applying to opportunities."}
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6"
        >
          {filteredApplications.map((application, index) => {
            const statusBadge = getStatusBadgeStyle(application.status);
            
            return (
              <motion.div 
                key={application._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.05 }
                }}
                whileHover={{ y: -3 }}
                className={cx(
                  "rounded-xl shadow-md hover:shadow-xl transition-all duration-300",
                  getCardGradient(application.status),
                  "ring-1",
                  isDark ? "ring-gray-700/80" : "ring-gray-200"
                )}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-5">
                    <div className="space-y-2">
                      <h2 className={cx("text-xl font-bold", colors.text)}>
                        {application.job?.title || 'Untitled Position'}
                      </h2>
                      <div className={cx("flex items-center", colors.textSecondary)}>
                        <Building2 className="w-4 h-4 mr-2" />
                        <span className="font-medium">{application.job?.company || 'Unknown Company'}</span>
                      </div>
                    </div>
                    <div className={`flex items-center px-4 py-2 rounded-full border ${statusBadge.className}`}>
                      {statusBadge.icon}
                      <span className="ml-2 text-sm font-medium capitalize">
                        {application.status}
                      </span>
                    </div>
                  </div>

                  <div className={cx(
                    "flex flex-wrap gap-3 mt-4 mb-2",
                    colors.textSecondary
                  )}>
                    {application.job?.location && (
                      <div className={cx(
                        "flex items-center px-3 py-1 rounded-full text-sm",
                        isDark ? "bg-gray-800/60" : "bg-gray-100"
                      )}>
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{application.job.location}</span>
                      </div>
                    )}
                    <div className={cx(
                      "flex items-center px-3 py-1 rounded-full text-sm",
                      isDark ? "bg-gray-800/60" : "bg-gray-100"
                    )}>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                    </div>
                    {application.job?.type && (
                      <div className={cx(
                        "flex items-center px-3 py-1 rounded-full text-sm",
                        isDark ? "bg-gray-800/60" : "bg-gray-100"
                      )}>
                        <Briefcase className="w-4 h-4 mr-1" />
                        <span>{application.job.type}</span>
                      </div>
                    )}
                  </div>

                  {/* Show interview details regardless of whether details are expanded or not */}
                  {(application.interview || application.interviewRoomId) && (
                    <InterviewDetails application={application} />
                  )}

                  <AnimatePresence>
                    {expandedItems.has(application._id) && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-5 space-y-5 overflow-hidden"
                      >
                        {application.coverLetter && (
                          <div className={cx(
                            "p-5 rounded-lg backdrop-blur-sm", 
                            isDark ? "bg-gray-800/80 ring-1 ring-gray-700" : "bg-white/90 ring-1 ring-gray-200"
                          )}>
                            <h3 className={cx("font-semibold mb-3 flex items-center gap-2", colors.text)}>
                              <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 p-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
                                </svg>
                              </span>
                              Cover Letter
                            </h3>
                            <p className={cx("whitespace-pre-line", colors.textSecondary)}>
                              {application.coverLetter}
                            </p>
                          </div>
                        )}

                        {application.additionalNotes && (
                          <div className={cx(
                            "p-5 rounded-lg backdrop-blur-sm",
                            isDark ? "bg-gray-800/80 ring-1 ring-gray-700" : "bg-white/90 ring-1 ring-gray-200"
                          )}>
                            <h3 className={cx("font-semibold mb-3 flex items-center gap-2", colors.text)}>
                              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 p-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                  <polyline points="14 2 14 8 20 8"/>
                                  <line x1="16" y1="13" x2="8" y2="13"/>
                                  <line x1="16" y1="17" x2="8" y2="17"/>
                                  <polyline points="10 9 9 9 8 9"/>
                                </svg>
                              </span>
                              Additional Notes
                            </h3>
                            <p className={cx("whitespace-pre-line", colors.textSecondary)}>
                              {application.additionalNotes}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={cx("mt-6 pt-5 border-t flex justify-end", colors.border)}>
                    <button 
                      onClick={() => toggleDetails(application._id)}
                      className={cx(
                        "px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-all duration-200",
                        isDark ? 
                          "bg-gray-800 hover:bg-gray-700 text-purple-400 hover:text-purple-300" : 
                          "bg-white hover:bg-gray-50 text-purple-600 hover:text-purple-700 shadow-sm hover:shadow-md"
                      )}
                    >
                      {expandedItems.has(application._id) ? (
                        <>
                          <span>Hide Details</span>
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>View Details</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default JobsAppliedContent;