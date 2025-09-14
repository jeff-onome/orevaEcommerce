
import React from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  data: ChartData[];
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <div className="w-20 text-sm text-gray-600 truncate">{item.label}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-6 mr-2">
            <div
              className="bg-primary h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            >
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SimpleBarChart;