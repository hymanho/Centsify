// src/components/user/ExpenseBarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ExpenseBarChart = ({ data }) => {
  const chartData = {
    labels: data.map(expense => expense.category || 'Unknown'),
    datasets: [
      {
        label: 'Total Expenses',
        data: data.map(expense => expense.totalExpenses || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Expenses by Category</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default ExpenseBarChart;
