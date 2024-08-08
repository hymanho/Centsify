import axios from 'axios';

export const fetchReportData = async (reportType, start, end) => {
    try {
        const response = await axios.get(`/api/reports/${reportType}`, { params: { start, end } });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch report data:', error);
    }
};
