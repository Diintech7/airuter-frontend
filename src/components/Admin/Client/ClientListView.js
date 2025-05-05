import React from 'react';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { ExternalLink, MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientListView = () => {
  const { colors, styles } = useThemeStyles();
  const navigate = useNavigate();

  // Mock data for clients
  const clients = [
    {
      id: 1,
      company: 'TechGrowth Inc.',
      logo: '/api/placeholder/50/50',
      industry: 'Technology',
      jobs: 42,
      fillRate: 72,
      trendPositive: true,
      timeToHire: 21,
      satisfaction: 4.8,
      status: 'active'
    },
    {
      id: 2,
      company: 'MediCare Solutions',
      logo: '/api/placeholder/50/50',
      industry: 'Healthcare',
      jobs: 28,
      fillRate: 65,
      trendPositive: true,
      timeToHire: 25,
      satisfaction: 4.5,
      status: 'active'
    },
    {
      id: 3,
      company: 'FinServe Corporation',
      logo: '/api/placeholder/50/50',
      industry: 'Finance',
      jobs: 34,
      fillRate: 58,
      trendPositive: false,
      timeToHire: 30,
      satisfaction: 4.2,
      status: 'active'
    },
    {
      id: 4,
      company: 'EduTech Systems',
      logo: '/api/placeholder/50/50',
      industry: 'Education',
      jobs: 19,
      fillRate: 75,
      trendPositive: true,
      timeToHire: 18,
      satisfaction: 4.9,
      status: 'active'
    },
    {
      id: 5,
      company: 'Retail Solutions Ltd',
      logo: '/api/placeholder/50/50',
      industry: 'Retail',
      jobs: 23,
      fillRate: 62,
      trendPositive: false,
      timeToHire: 27,
      satisfaction: 4.3,
      status: 'inactive'
    }
  ];

  const handleViewClient = (clientId) => {
    navigate(`/admin/clients/${clientId}`);
  };

  return (
    <div className={`rounded-xl overflow-hidden ${colors.bgCard}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${colors.bgSection} border-b ${colors.border}`}>
            <tr>
              <th className="text-left py-4 px-6 font-medium">Company</th>
              <th className="text-left py-4 px-6 font-medium">Industry</th>
              <th className="text-left py-4 px-6 font-medium">Active Jobs</th>
              <th className="text-left py-4 px-6 font-medium">Fill Rate</th>
              <th className="text-left py-4 px-6 font-medium">Time to Hire</th>
              <th className="text-left py-4 px-6 font-medium">Satisfaction</th>
              <th className="text-left py-4 px-6 font-medium">Status</th>
              <th className="text-left py-4 px-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr 
                key={client.id} 
                className={`border-b ${colors.border} hover:${colors.bgSection.replace('bg-', 'hover:bg-')} transition-colors`}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <img 
                      src={client.logo} 
                      alt={client.company} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <span className="font-medium">{client.company}</span>
                  </div>
                </td>
                <td className="py-4 px-6">{client.industry}</td>
                <td className="py-4 px-6">{client.jobs}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <span className="mr-2">{client.fillRate}%</span>
                    {client.trendPositive ? (
                      <TrendingUp size={16} className="text-green-500" />
                    ) : (
                      <TrendingDown size={16} className="text-red-500" />
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">{client.timeToHire} days</td>
                <td className="py-4 px-6">{client.satisfaction}/5</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    client.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {client.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleViewClient(client.id)}
                      className={`p-2 rounded-full ${colors.hoverBg}`}
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button className={`p-2 rounded-full ${colors.hoverBg}`}>
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t">
        <div className={`text-sm ${colors.textMuted}`}>
          Showing 1 to 5 of 24 results
        </div>
        <div className="flex items-center space-x-2">
          <button className={`px-3 py-1 rounded ${styles.buttonSecondary}`}>Previous</button>
          <button className={`px-3 py-1 rounded ${styles.buttonPrimary}`}>1</button>
          <button className={`px-3 py-1 rounded ${styles.buttonSecondary}`}>2</button>
          <button className={`px-3 py-1 rounded ${styles.buttonSecondary}`}>3</button>
          <button className={`px-3 py-1 rounded ${styles.buttonSecondary}`}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default ClientListView;