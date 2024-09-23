/*

This component renders a line chart to display total expenses over time 
using the Chart.js library with react-chartjs-2. It includes a simple 
forecast for the next six periods based on the last known expense value.

*/

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // Import Line chart component
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js'; // Import required Chart.js components
import PropTypes from 'prop-types'; // Import PropTypes for type checking

// Register the required Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

// ExpenseLineChart component accepts data as a prop
const ExpenseLineChart = ({ data = [] }) => {
  const [isMounted, setIsMounted] = useState(false); // State to check if the component is mounted

  useEffect(() => {
    setIsMounted(true); // Set mounted state to true on component mount
  }, []);

  if (!isMounted) return null; // Prevent rendering until mounted

  // Function to generate forecasted expenses
  const forecastExpenses = () => {
    if (data.length === 0) return []; 
    const lastExpense = data[data.length - 1].totalExpenses || 0; 
    const forecast = Array(6).fill(lastExpense); // Simple forecast based on last known value
    return forecast;
  };

  // Prepare chart data
  const chartData = {
    labels: [...data.map(expense => expense.date || ''), 'Forecast'], // Labels for x-axis
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
        data: [...data.map(expense => expense.totalExpenses || 0), ...forecastExpenses()], // Data for the line chart
      },
    ],
  };

  return (
    <div>
      <h2>Expenses Over Time</h2> {/* Title for the line chart */}
      <Line data={chartData} /> {/* Render the Line chart */}
    </div>
  );
};

// PropTypes for type checking the props
ExpenseLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    totalExpenses: PropTypes.number,
  })),
};

export default ExpenseLineChart; // Export the component
