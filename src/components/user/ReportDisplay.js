import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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