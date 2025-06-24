// components/RevenueChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import type { RevenueDataPoint } from '../../../types/IProducts';

const revenueData: RevenueDataPoint[] = [
  { month: 'Jan', online: 400, store: 280 },
  { month: 'Feb', online: 280, store: 400 },
  { month: 'Mar', online: 600, store: 350 },
  { month: 'Apr', online: 450, store: 500 },
  { month: 'May', online: 750, store: 400 },
  { month: 'Jun', online: 500, store: 450 },
  { month: 'Jul', online: 850, store: 600 },
  { month: 'Aug', online: 600, store: 550 }
];

const RevenueChart: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Online Customers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Store Customers</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <Line 
              type="monotone" 
              dataKey="online" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 0, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="store" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 0, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;