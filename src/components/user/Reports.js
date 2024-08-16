import React, { useEffect, useState } from 'react';
import { getExpenses } from '../../backend/Account/ExpenseManagement/ExpenseService'; // Adjust to your correct import path
import { auth } from '../../firebase'; // Ensure you have Firebase auth imported
import ReportDisplay from './ReportDisplay'; // Ensure this path is correct
import ExpenseLineChart from './ExpenseLineChart';
import CategoryPieChart from './CategoryPieChart';
import '../../styles/Charts.css';

const Reports = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const user = auth.currentUser;
      if (user) {
        const expenses = await getExpenses(user.email);
        
        // Transform the expenses data to match the chart format
        const transformedData = expenses.map(expense => ({
          id: expense.id,  // Include an ID to uniquely identify each expense
          category: expense.category,
          totalExpenses: expense.amount,
          date: expense.date, // Make sure 'date' is included
          savings: expense.savings || 0, // Assuming savings is part of the data structure
        }));
        
        setData(transformedData);
      }
    };

    fetchExpenses();
  }, []); // The empty dependency array ensures this runs only once on mount

  return (
    <div className="chart-container">
      <h2 className="chart-title">Financial Reports</h2>

      {/* Display the Expense Line Chart */}
      <ExpenseLineChart data={data} />

      {/* Display the Category Pie Chart */}
      <CategoryPieChart data={data} />

      {/* Display the original ReportDisplay component */}
      <ReportDisplay data={data} />
    </div>
  );
};

export default Reports;
