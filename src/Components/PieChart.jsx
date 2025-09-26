import React from 'react';
import { Pie,Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ amounts, categories }) => {
  const data = {
    labels: categories.length ? categories : ['No Data'],
    datasets: [
      {
        label: 'Expenses',
        data: amounts.length ? amounts : [0],
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#F87171', '#A78BFA', '#F472B6',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-60 h-50 mx-auto">
      {/* Force remount whenever data changes to prevent canvas reuse */}
      <Pie data={data} key={JSON.stringify(amounts)} redraw={true} />
    </div>
  );
};

export default PieChart;
