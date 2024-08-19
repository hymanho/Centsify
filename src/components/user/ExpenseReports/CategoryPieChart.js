// src/components/user/CategoryPieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ data }) => {
  console.log("Data passed to CategoryPieChart:", data); // Debugging log

  const chartData = {
    labels: [...new Set(data.map(expense => expense.category))], // Unique categories
    datasets: [
      {
        data: data.reduce((acc, expense) => {
          const index = acc.findIndex(item => item.category === expense.category);
          if (index > -1) {
            acc[index].value += expense.totalExpenses;
          } else {
            acc.push({ category: expense.category, value: expense.totalExpenses });
          }
          return acc;
        }, []).map(item => item.value),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  console.log("Transformed data for Pie Chart:", chartData); // Debugging log

  return (
    <div>
      <h2>Category Distribution</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default CategoryPieChart;
