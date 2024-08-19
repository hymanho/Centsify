import React, { useEffect, useState } from 'react';
import { getExpenses } from '../../../backend/Account/ExpenseManagement/ExpenseService'; 
import { auth } from '../../../firebase'; 
import ExpenseLineChart from './ExpenseLineChart';
import CategoryPieChart from './CategoryPieChart';
import ExpenseBarChart from './ExpenseBarChart'; 
import '../../../styles/Charts.css';

const Reports = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const user = auth.currentUser;
      if (user) {
        const expenses = await getExpenses(user.email);

        // Aggregate expenses by date
        const aggregatedData = expenses.reduce((acc, expense) => {
          const date = expense.date;
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += expense.amount;
          return acc;
        }, {});

        // Convert the aggregated data into an array format that the chart can use
        const transformedData = Object.keys(aggregatedData).map(date => ({
          date,
          totalExpenses: aggregatedData[date],
        }));

        console.log("Aggregated and transformed data for reports:", transformedData); // Debugging log
        setData(transformedData);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="chart-container">
      <h2 className="chart-title">Financial Reports</h2>
      <ExpenseLineChart data={data} />
      <ExpenseBarChart data={data} /> 
      <CategoryPieChart data={data} />
    </div>
  );
};

export default Reports;
