import React, { useState } from 'react';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { Search, Filter, ArrowUpDown, Download } from 'lucide-react';
import ClientKPIChart from './ClientKPIChart';
import ClientListView from './ClientListView';

const ClientPerformance = () => {
  const { colors, styles } = useThemeStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'grid'

  return (
    <div className={styles.pageContainer}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Client & Recruiter Performance</h1>
        
        <div className="flex items-center space-x-2">
          <button className={`${styles.buttonSecondary} flex items-center`}>
            <Download size={16} className="mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-xl ${colors.bgCard}`}>
          <h3 className="text-lg font-medium mb-2">Average Job Fill Rate</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold">68%</span>
            <span className="text-green-500 text-sm">+5% from last month</span>
          </div>
          <p className={`text-sm ${colors.textMuted} mt-2`}>Industry average: 62%</p>
        </div>
        
        <div className={`p-6 rounded-xl ${colors.bgCard}`}>
          <h3 className="text-lg font-medium mb-2">Average Time-to-Hire</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold">24</span>
            <span className="text-sm font-medium">days</span>
            <span className="text-green-500 text-sm">-3 days from last month</span>
          </div>
          <p className={`text-sm ${colors.textMuted} mt-2`}>Industry average: 28 days</p>
        </div>
        
        <div className={`p-6 rounded-xl ${colors.bgCard}`}>
          <h3 className="text-lg font-medium mb-2">Client Satisfaction</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold">4.7</span>
            <span className="text-sm font-medium">/5</span>
            <span className="text-green-500 text-sm">+0.2 from last month</span>
          </div>
          <p className={`text-sm ${colors.textMuted} mt-2`}>Based on 245 reviews</p>
        </div>
      </div>

      {/* Chart */}
      <div className={`p-6 rounded-xl ${colors.bgCard} mb-8`}>
        <h2 className="text-xl font-semibold mb-4">Performance Trends</h2>
        <div className="h-64">
          <ClientKPIChart />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className={`relative w-full md:w-64 mb-4 md:mb-0`}>
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full rounded-lg ${styles.input}`}
          />
          <Search size={18} className={`absolute left-3 top-2.5 ${colors.textMuted}`} />
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className={`${styles.buttonSecondary} flex items-center`}
          >
            <Filter size={16} className="mr-2" />
            Filters
          </button>
          
          <button className={`${styles.buttonSecondary} flex items-center`}>
            <ArrowUpDown size={16} className="mr-2" />
            Sort
          </button>
        </div>
      </div>
      
      {/* Filter dropdown */}
      {filterOpen && (
        <div className={`p-4 rounded-lg mb-6 ${colors.bgCard}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={styles.label}>Company Size</label>
              <select className={`w-full rounded-lg ${styles.input}`}>
                <option value="">All Sizes</option>
                <option value="small">Small (1-50)</option>
                <option value="medium">Medium (51-200)</option>
                <option value="large">Large (201+)</option>
              </select>
            </div>
            
            <div>
              <label className={styles.label}>Industry</label>
              <select className={`w-full rounded-lg ${styles.input}`}>
                <option value="">All Industries</option>
                <option value="tech">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
              </select>
            </div>
            
            <div>
              <label className={styles.label}>Status</label>
              <select className={`w-full rounded-lg ${styles.input}`}>
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button className={`${styles.buttonSecondary} mr-2`}>Reset</button>
            <button className={styles.buttonPrimary}>Apply Filters</button>
          </div>
        </div>
      )}

      {/* Client List */}
      <ClientListView />
    </div>
  );
};

export default ClientPerformance;