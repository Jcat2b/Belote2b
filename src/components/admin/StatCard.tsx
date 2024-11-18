import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  description: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  description,
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="flex items-center">
        <div className="rounded-full bg-blue-100 p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p className="ml-2 text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};