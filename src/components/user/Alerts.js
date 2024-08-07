// src/components/Reports.js
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Reports = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data for reports
    fetch('/api/reportData')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching report data:', error));
  }, []);

  return (
    <div>
      <h2>Financial Reports</h2>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" fill="#8884d8" />
        <Bar dataKey="uv" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default Reports;