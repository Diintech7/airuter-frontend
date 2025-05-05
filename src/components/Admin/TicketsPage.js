import React, { useState } from 'react';
import { Ticket, Search, Filter, MoreHorizontal, CheckCircle, Clock, AlertCircle, XCircle, MessageSquare, ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { useThemeStyles } from '../hooks/useThemeStyles';

const TicketsPage = () => {
  const { styles, colors } = useThemeStyles();
  const [activeTab, setActiveTab] = useState('all');
  const [activeView, setActiveView] = useState('tickets'); // 'tickets', 'issues' or 'feedback'
  
  const tickets = [
    { 
      id: 'TKT-1001', 
      title: 'Course access issue', 
      user: 'Jennifer Lawrence', 
      date: '2025-04-22', 
      status: 'open', 
      priority: 'high', 
      category: 'Technical',
      description: 'Unable to access premium course content after payment confirmation.'
    },
    { 
      id: 'TKT-1002', 
      title: 'Payment not reflecting', 
      user: 'Michael Johnson', 
      date: '2025-04-21', 
      status: 'in-progress', 
      priority: 'medium', 
      category: 'Billing',
      description: 'Made payment for advanced course but it does not show in my account.'
    },
    { 
      id: 'TKT-1003', 
      title: 'Certificate download error', 
      user: 'Emma Williams', 
      date: '2025-04-20', 
      status: 'resolved', 
      priority: 'low', 
      category: 'Technical',
      description: 'Getting error 404 when trying to download course completion certificate.'
    },
    { 
      id: 'TKT-1004', 
      title: 'Recruiter contact information', 
      user: 'Robert Smith', 
      date: '2025-04-19', 
      status: 'open', 
      priority: 'medium', 
      category: 'General',
      description: 'Need updated contact information for recruiter partner companies.'
    },
    { 
      id: 'TKT-1005', 
      title: 'Video playback issue', 
      user: 'Sarah Davis', 
      date: '2025-04-18', 
      status: 'in-progress', 
      priority: 'high', 
      category: 'Technical',
      description: 'Course videos are buffering constantly despite good internet connection.'
    },
    { 
      id: 'TKT-1006', 
      title: 'Refund request', 
      user: 'Daniel Wilson', 
      date: '2025-04-17', 
      status: 'closed', 
      priority: 'high', 
      category: 'Billing',
      description: 'Requesting refund for duplicate payment made on April 15th.'
    }
  ];
  
  const issues = [
    { 
      id: 'ISS-2001', 
      title: 'Course navigation bug', 
      reportedBy: 'Technical Team', 
      date: '2025-04-22', 
      status: 'investigating', 
      impact: 'medium', 
      affectedArea: 'Learning Platform',
      description: 'Users report getting stuck on module 3 completion page.'
    },
    { 
      id: 'ISS-2002', 
      title: 'Login system downtime', 
      reportedBy: 'System Admin', 
      date: '2025-04-21', 
      status: 'fixed', 
      impact: 'critical', 
      affectedArea: 'Authentication',
      description: 'Intermittent login failures between 2-4 AM EST due to database maintenance.'
    },
    { 
      id: 'ISS-2003', 
      title: 'Payment gateway timeout', 
      reportedBy: 'Finance Department', 
      date: '2025-04-20', 
      status: 'monitoring', 
      impact: 'high', 
      affectedArea: 'Payment System',
      description: 'Payment gateway experiencing timeouts for ~5% of transactions.'
    },
    { 
      id: 'ISS-2004', 
      title: 'Certificate generation delay', 
      reportedBy: 'Customer Support', 
      date: '2025-04-19', 
      status: 'investigating', 
      impact: 'low',
      affectedArea: 'Certification',
      description: 'Certificates taking up to 3 hours to generate instead of the usual 30 minutes.'
    }
  ];
  
  const feedback = [
    { 
      id: 'FDB-3001', 
      course: 'Advanced Machine Learning', 
      user: 'Thomas Anderson', 
      date: '2025-04-22', 
      rating: 5, 
      sentiment: 'positive',
      comment: 'Excellent course with practical examples. The instructor was very knowledgeable.'
    },
    { 
      id: 'FDB-3002', 
      course: 'Web Development Fundamentals', 
      user: 'Alice Johnson', 
      date: '2025-04-21', 
      rating: 2, 
      sentiment: 'negative',
      comment: 'Content was outdated. Many techniques taught are no longer industry standard.'
    },
    { 
      id: 'FDB-3003', 
      course: 'Data Science Basics', 
      user: 'Elena Rodriguez', 
      date: '2025-04-20', 
      rating: 4, 
      sentiment: 'positive',
      comment: 'Good introduction to the field. Could use more practical assignments.'
    },
    { 
      id: 'FDB-3004', 
      course: 'Cloud Computing Essentials', 
      user: 'Marcus Wei', 
      date: '2025-04-19', 
      rating: 3, 
      sentiment: 'neutral',
      comment: 'Content was good but platform kept crashing during lab exercises.'
    },
    { 
      id: 'FDB-3005', 
      course: 'UX Design Principles', 
      user: 'Sophia Patel', 
      date: '2025-04-18', 
      rating: 5, 
      sentiment: 'positive',
      comment: 'Best course I\'ve taken! Practical skills I could immediately apply to my job.'
    }
  ];
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'open':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-500" />;
      case 'resolved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'closed':
        return <XCircle size={16} className="text-gray-500" />;
      case 'investigating':
        return <AlertCircle size={16} className="text-orange-500" />;
      case 'fixed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'monitoring':
        return <Clock size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'investigating':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'fixed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'monitoring':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high':
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getSentimentClass = (sentiment) => {
    switch(sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'neutral':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const getSentimentIcon = (sentiment) => {
    switch(sentiment) {
      case 'positive':
        return <ThumbsUp size={16} className="text-green-500" />;
      case 'negative':
        return <ThumbsDown size={16} className="text-red-500" />;
      case 'neutral':
        return <MessageSquare size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };
  
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
          />
        ))}
      </div>
    );
  };
  
  const filteredTickets = activeTab === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.status === activeTab);
  
  const filteredIssues = activeTab === 'all'
    ? issues
    : issues.filter(issue => issue.status === activeTab);
  
  return (
    <div className={`${styles.pageContainer} pb-12`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${colors.textHeading}`}>
            {activeView === 'tickets' ? 'Support Tickets' : 
             activeView === 'issues' ? 'System Issues' : 'User Feedback'}
          </h1>
          <p className={colors.textMuted}>
            {activeView === 'tickets' ? 'Manage and respond to user support requests' : 
             activeView === 'issues' ? 'Track and resolve system issues' : 'Review course feedback and ratings'}
          </p>
        </div>
        <div className="flex space-x-2">
          {activeView === 'tickets' && (
            <button className={`px-4 py-2 bg-red-600 text-white rounded-md flex items-center ${styles.buttonHover}`}>
              <Ticket size={16} className="mr-2" />
              New Ticket
            </button>
          )}
          {activeView === 'issues' && (
            <button className={`px-4 py-2 bg-red-600 text-white rounded-md flex items-center ${styles.buttonHover}`}>
              <AlertCircle size={16} className="mr-2" />
              Report Issue
            </button>
          )}
        </div>
      </div>
      
      <div className="flex mb-4 border-b pb-2">
        <button 
          className={`mr-4 pb-2 font-medium ${activeView === 'tickets' ? 'text-red-600 border-b-2 border-red-600' : colors.text}`}
          onClick={() => setActiveView('tickets')}
        >
          <div className="flex items-center">
            <Ticket size={18} className="mr-1" />
            Tickets
          </div>
        </button>
        <button 
          className={`mr-4 pb-2 font-medium ${activeView === 'issues' ? 'text-red-600 border-b-2 border-red-600' : colors.text}`}
          onClick={() => setActiveView('issues')}
        >
          <div className="flex items-center">
            <AlertCircle size={18} className="mr-1" />
            Issues
          </div>
        </button>
        <button 
          className={`mr-4 pb-2 font-medium ${activeView === 'feedback' ? 'text-red-600 border-b-2 border-red-600' : colors.text}`}
          onClick={() => setActiveView('feedback')}
        >
          <div className="flex items-center">
            <MessageSquare size={18} className="mr-1" />
            Feedback
          </div>
        </button>
      </div>
      
      <div className={`${colors.bgCard} rounded-lg shadow-md mb-6 border ${colors.borderColor}`}>
        <div className="flex flex-wrap p-4 border-b">
          <div className="mr-4 mb-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder={`Search ${activeView}...`}
                className={`pl-10 pr-4 py-2 border rounded-md w-64 ${colors.inputBg} ${colors.text}`}
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          <div className="mr-4 mb-2">
            <button className={`px-4 py-2 border rounded-md flex items-center ${colors.borderColor} ${colors.text}`}>
              <Filter size={16} className="mr-2" />
              Filter
            </button>
          </div>
          <div className="flex-grow"></div>
          
          {activeView !== 'feedback' && (
            <div className="flex space-x-1">
              <button 
                className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-100' : `${colors.bgSection} ${colors.text}`}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              
              {activeView === 'tickets' ? (
                <>
                  <button 
                    className={`px-4 py-2 rounded-md ${activeTab === 'open' ? 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-100' : `${colors.bgSection} ${colors.text}`}`}
                    onClick={() => setActiveTab('open')}
                  >
                    Open
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md ${activeTab === 'in-progress' ? 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-100' : `${colors.bgSection} ${colors.text}`}`}
                    onClick={() => setActiveTab('in-progress')}
                  >
                    In Progress
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md ${activeTab === 'resolved' ? 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-100' : `${colors.bgSection} ${colors.text}`}`}
                    onClick={() => setActiveTab('resolved')}
                  >
                    Resolved
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md ${activeTab === 'closed' ? 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-100' : `${colors.bgSection} ${colors.text}`}`} 
                    onClick={() => setActiveTab('closed')}
                  >
                    Closed
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={`px-4 py-2 rounded-md ${activeTab === 'investigating' ? 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-100' : `${colors.bgSection} ${colors.text}`}`}
                    onClick={() => setActiveTab('investigating')}
                  >
                    Investigating
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md ${activeTab === 'monitoring' ? 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-100' : `${colors.bgSection} ${colors.text}`}`}
                    onClick={() => setActiveTab('monitoring')}
                  >
                    Monitoring
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md ${activeTab === 'fixed' ? 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-100' : `${colors.bgSection} ${colors.text}`}`}
                    onClick={() => setActiveTab('fixed')}
                  >
                    Fixed
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          {activeView === 'tickets' && (
            <table className="w-full">
              <thead>
                <tr className={colors.tableBgHeader}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ticket ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`${colors.bgCard} divide-y ${colors.dividerColor}`}>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className={`hover:${colors.bgHover}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${colors.text}`}>{ticket.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${colors.text}`}>{ticket.title}</div>
                      <div className={`text-xs ${colors.textMuted} truncate max-w-xs`}>{ticket.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${colors.text}`}>{ticket.user}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${colors.text}`}>{ticket.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1 capitalize">
                          {ticket.status.replace('-', ' ')}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(ticket.priority)}`}>
                        <span className="capitalize">{ticket.priority}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${colors.text}`}>{ticket.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {activeView === 'issues' && (
            <table className="w-full">
              <thead>
                <tr className={colors.tableBgHeader}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Issue ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reported By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Impact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Affected Area</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`${colors.bgCard} divide-y ${colors.dividerColor}`}>
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className={`hover:${colors.bgHover}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${colors.text}`}>{issue.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${colors.text}`}>{issue.title}</div>
                      <div className={`text-xs ${colors.textMuted} truncate max-w-xs`}>{issue.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${colors.text}`}>{issue.reportedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${colors.text}`}>{issue.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(issue.status)}`}>
                        {getStatusIcon(issue.status)}
                        <span className="ml-1 capitalize">
                          {issue.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(issue.impact)}`}>
                        <span className="capitalize">{issue.impact}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${colors.text}`}>{issue.affectedArea}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {activeView === 'feedback' && (
            <table className="w-full">
              <thead>
                <tr className={colors.tableBgHeader}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Feedback ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sentiment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Comment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`${colors.bgCard} divide-y ${colors.dividerColor}`}>
                {feedback.map((item) => (
                  <tr key={item.id} className={`hover:${colors.bgHover}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${colors.text}`}>{item.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${colors.text}`}>{item.course}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${colors.text}`}>{item.user}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${colors.text}`}>{item.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(item.rating)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentClass(item.sentiment)}`}>
                        {getSentimentIcon(item.sentiment)}
                        <span className="ml-1 capitalize">
                          {item.sentiment}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${colors.text} truncate max-w-xs`}>{item.comment}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className={`px-6 py-4 border-t ${colors.borderColor} flex items-center justify-between`}>
          <div className={`text-sm ${colors.textMuted}`}>
            {activeView === 'tickets' && `Showing ${filteredTickets.length} tickets`}
            {activeView === 'issues' && `Showing ${filteredIssues.length} issues`}
            {activeView === 'feedback' && `Showing ${feedback.length} feedback items`}
          </div>
          <div className="flex space-x-2">
            <button className={`px-3 py-1 border rounded-md ${colors.borderColor} ${colors.text}`}>Previous</button>
            <button className="px-3 py-1 bg-red-600 text-white rounded-md">1</button>
            <button className={`px-3 py-1 border rounded-md ${colors.borderColor} ${colors.text}`}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsPage;