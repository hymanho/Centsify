/*

This component renders a bar chart to display total expenses by category 
using the Chart.js library with react-chartjs-2. The data prop should 
contain an array of expense objects, each with a category and totalExpenses.

*/

import React from 'react';
import { Bar } from 'react-chartjs-2'; // Import Bar chart component
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'; // Import required Chart.js components

// Register the required Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// ExpenseBarChart component accepts data as a prop
const ExpenseBarChart = ({ data }) => {
  // Prepare chart data
  const chartData = {
    labels: data.map(expense => expense.category || 'Unknown'), // Use expense categories as labels
    datasets: [
      {
        label: 'Total Expenses', // Label for the dataset
        data: data.map(expense => expense.totalExpenses || 0), // Map to get total expenses
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Bar fill color
        borderColor: 'rgba(54, 162, 235, 1)', // Bar border color
        borderWidth: 1, // Border width of the bars
      },
    ],
  };

  return (
    <div>
      <h2>Expenses by Category</h2> {/* Title for the bar chart */}
      <Bar data={chartData} /> {/* Render the Bar chart */}
    </div>
  );
};

export default ExpenseBarChart;
