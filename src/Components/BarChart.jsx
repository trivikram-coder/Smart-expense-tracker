import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJs,Tooltip,Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
ChartJs.register(CategoryScale,LinearScale,BarElement,Tooltip,Legend)
const BarChart = ({amounts,categories}) => {
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
   <>
    <div className="w-80 h-50 mt-6">
          {/* Force remount whenever data changes to prevent canvas reuse */}
          <Bar data={data} key={JSON.stringify(amounts)} redraw={true} />
        </div>
   </>
  )
}

export default BarChart
