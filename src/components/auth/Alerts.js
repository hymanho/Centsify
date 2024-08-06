import React, { useState, useEffect } from 'react';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // Here, fetch alert data
        fetch('/api/alerts')
            .then(response => response.json())
            .then(data => setAlerts(data))
            .catch(error => console.error('Error fetching alerts:', error));
    }, []);

    return (
        <div>
            <h2>Alerts</h2>
            {alerts.map((alert, index) => (
                <div key={index}>
                    <p>{alert.message}</p>
                </div>
            ))}
        </div>
    );
};

export default Alerts;
