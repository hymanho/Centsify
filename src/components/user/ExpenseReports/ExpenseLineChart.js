import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const ExpenseLineChart = ({ data = [] }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Set the state to true after the component has mounted
  }, []);

  if (!isMounted) return null; // Don't render the chart until the component has mounted

  const chartData = {
    labels: data.map(expense => expense.date || ''), // Assuming 'date' is in 'YYYY-MM-DD' format
    datasets: [
      {
        label: 'Total Expenses',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: data.map(expense => expense.totalExpenses || 0), // Assuming 'totalExpenses' is the expense value
      },
    ],
  };

  return (
    <div>
      <h2>Expenses Over Time</h2>
      <Line data={chartData} />
    </div>
  );
};

ExpenseLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    totalExpenses: PropTypes.number,
  })),
};

export default ExpenseLineChart;
