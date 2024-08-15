import React, { useEffect, useState } from 'react';
import { getExpenses } from '../../../backend/Account/ExpenseManagement/ExpenseService'; // Adjust to your correct import path
import { auth } from '../../../firebase'; // Ensure you have Firebase auth imported
import ReportDisplay from './ReportDisplay'; // Ensure this path is correct

const Reports = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const user = auth.currentUser;
      if (user) {
        const expenses = await getExpenses(user.email);
        
        // Transform the expenses data to match the chart format
        const transformedData = expenses.map(expense => ({
          category: expense.category,
          totalExpenses: expense.amount,
          savings: expense.savings || 0, // Assuming savings is part of the data structure
        }));
        
        setData(transformedData);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="chart-container">
      <h2 className="chart-title">Financial Reports</h2>
      <ReportDisplay data={data} />
    </div>
  );
};

export default Reports;
