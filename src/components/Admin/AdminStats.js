import React from 'react';
import { useThemeStyles } from '../hooks/useThemeStyles';

const AdminStats = () => {
  const { colors } = useThemeStyles();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className={`p-4 rounded-lg ${colors.bgCard}`}>
        <h3 className={`text-sm font-medium ${colors.textMuted}`}>Total Users</h3>
        <p className={`text-2xl font-bold ${colors.text}`}>1,234</p>
      </div>
      <div className={`p-4 rounded-lg ${colors.bgCard}`}>
        <h3 className={`text-sm font-medium ${colors.textMuted}`}>Active Jobs</h3>
        <p className={`text-2xl font-bold ${colors.text}`}>456</p>
      </div>
      <div className={`p-4 rounded-lg ${colors.bgCard}`}>
        <h3 className={`text-sm font-medium ${colors.textMuted}`}>Applications</h3>
        <p className={`text-2xl font-bold ${colors.text}`}>789</p>
      </div>
      <div className={`p-4 rounded-lg ${colors.bgCard}`}>
        <h3 className={`text-sm font-medium ${colors.textMuted}`}>Companies</h3>
        <p className={`text-2xl font-bold ${colors.text}`}>321</p>
      </div>
    </div>
  );
};

export default AdminStats;