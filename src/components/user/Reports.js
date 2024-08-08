import React, { useEffect, useState } from 'react';
import ReportDisplay from './ReportDisplay'; // Import the new component

const Reports = () => {
  const [data, setData] = useState([]);
  const [reportType, setReportType] = useState('monthly');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');

  useEffect(() => {
    const url = `/api/reportData?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching report data:', error));
  }, [reportType, startDate, endDate]);

  return (
    <div>
      <h2>Financial Reports</h2>
      <select value={reportType} onChange={e => setReportType(e.target.value)}>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
        <option value="category">Category</option>
      </select>
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      <ReportDisplay data={data} /> {/* Use the ReportDisplay component */}
    </div>
  );
};

export default Reports;
