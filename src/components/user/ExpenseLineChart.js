// src/components/user/ExpenseLineChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';

const ExpenseLineChart = ({ data }) => {
  const chartData = {
    labels: data.map(expense => expense.date), // Assuming 'date' is the format 'YYYY-MM-DD'
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
        data: data.map(expense => expense.amount), // Assuming 'amount' is the expense value
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

export default ExpenseLineChart;
