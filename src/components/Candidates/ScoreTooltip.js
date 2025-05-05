import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useThemeStyles } from '../hooks/useThemeStyles';

const ScoreTooltip = ({ analysis }) => {
  const { isDark, colors } = useThemeStyles();
  
  if (!analysis || !analysis.feedback) return null;

  const data = analysis.feedback.map(item => ({
    name: item.category,
    value: item.score,
    message: item.message
  }));

  // Theme-aware colors for the pie chart
  const COLORS = isDark 
    ? ['#4ade80', '#60a5fa', '#f472b6'] // Original colors for dark mode
    : ['#22c55e', '#3b82f6', '#ec4899']; // Slightly darker for light mode for better contrast

  return (
    <div className={`absolute z-50 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-4 w-64 border ${colors.border} transition-colors duration-300`}>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              content={({ payload }) => {
                if (payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-800'} text-white p-2 rounded`}>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm">{item.value}%</p>
                      <p className="text-xs mt-1">{item.message}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 space-y-1">
        {data.map((item, index) => (
          <div key={index} className="flex items-center text-sm">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className={`font-medium ${colors.text}`}>{item.name}:</span>
            <span className={`ml-1 ${colors.textSecondary}`}>{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreTooltip;