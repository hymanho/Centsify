/*

This component renders a pie chart to display the distribution of expenses by category
using the Chart.js library with react-chartjs-2. The data prop should contain an array 
of expense objects, each with a category and totalExpenses.

*/

import React from 'react';
import { Pie } from 'react-chartjs-2'; // Import Pie chart component
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Import Chart.js components

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// CategoryPieChart component accepts data as a prop
const CategoryPieChart = ({ data }) => {
  console.log("Data passed to CategoryPieChart:", data); // Log the input data for debugging

  // Prepare chart data
  const chartData = {
    labels: [...new Set(data.map(expense => expense.category))], // Unique categories
    datasets: [
      {
        data: data.reduce((acc, expense) => {
          const index = acc.findIndex(item => item.category === expense.category);
          if (index > -1) {
            acc[index].value += expense.totalExpenses; // Sum totalExpenses for each category
          } else {
            acc.push({ category: expense.category, value: expense.totalExpenses }); // Add new category
          }
          return acc;
        }, []).map(item => item.value), // Map to get total values
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // Segment colors
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // Hover colors
      },
    ],
  };

  console.log("Transformed data for Pie Chart:", chartData); // Log prepared chart data for debugging

  return (
    <div>
      <h2>Category Distribution</h2> {/* Title for the pie chart */}
      <Pie data={chartData} /> {/* Render the Pie chart */}
    </div>
  );
};

export default CategoryPieChart; 