import React from 'react';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ClientKPIChart = () => {
  const { isDark } = useThemeStyles();
  
  // Mock data for the chart
  const data = [
    { month: 'Jan', fillRate: 60, timeToHire: 28, satisfaction: 4.3 },
    { month: 'Feb', fillRate: 62, timeToHire: 27, satisfaction: 4.4 },
    { month: 'Mar', fillRate: 65, timeToHire: 26, satisfaction: 4.5 },
    { month: 'Apr', fillRate: 63, timeToHire: 26, satisfaction: 4.5 },
    { month: 'May', fillRate: 67, timeToHire: 25, satisfaction: 4.6 },
    { month: 'Jun', fillRate: 68, timeToHire: 24, satisfaction: 4.7 }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
        <XAxis 
          dataKey="month" 
          stroke={isDark ? "#9CA3AF" : "#6B7280"} 
        />
        <YAxis 
          yAxisId="left" 
          stroke={isDark ? "#9CA3AF" : "#6B7280"} 
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          stroke={isDark ? "#9CA3AF" : "#6B7280"} 
          domain={[0, 5]} 
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderColor: isDark ? '#374151' : '#E5E7EB',
            color: isDark ? '#F9FAFB' : '#111827'
          }}
        />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="fillRate" 
          name="Fill Rate (%)" 
          stroke="#8B5CF6" 
          activeDot={{ r: 8 }} 
        />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="timeToHire" 
          name="Time to Hire (days)" 
          stroke="#10B981" 
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="satisfaction" 
          name="Satisfaction (1-5)" 
          stroke="#F59E0B" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ClientKPIChart;
