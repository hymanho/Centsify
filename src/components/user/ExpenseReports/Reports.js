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

        const transformedData = expenses.map(expense => ({
          id: expense.id, 
          date: expense.date, 
          category: expense.category,
          totalExpenses: expense.amount || 0,
          savings: expense.savings || 0,
        }));
        
        console.log("Transformed data for reports:", transformedData); // Debugging log
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
