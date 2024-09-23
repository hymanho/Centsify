/*

This component renders a bar chart using Recharts to display total 
expenses and savings categorized by specific criteria.

*/

import React from 'react'; // Import React
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'; // Import necessary components from Recharts

const ReportDisplay = ({ data }) => {
    return (
        <BarChart width={600} height={300} data={data}> 
            <CartesianGrid strokeDasharray="3 3" /> 
            <XAxis dataKey="category" /> 
            <YAxis /> 
            <Tooltip /> 
            <Legend /> 
            <Bar dataKey="totalExpenses" fill="#8884d8" name="Total Expenses" /> 
            <Bar dataKey="savings" fill="#82ca9d" name="Savings" /> 
        </BarChart>
    );
};

export default ReportDisplay;