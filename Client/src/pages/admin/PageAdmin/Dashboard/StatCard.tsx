// components/StatCard.tsx
import React from 'react';
import type { StatCardProps } from '../../../../types/IProducts';

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-xl p-6 text-white relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          <p className="text-sm mt-2 text-white/90">{change}</p>
        </div>
        <div className="text-white/20 absolute right-4 top-4">
          {React.cloneElement(icon as React.ReactElement, { className: 'w-8 h-8' })}
        </div>
      </div>
    </div>
  );
};

export default StatCard;