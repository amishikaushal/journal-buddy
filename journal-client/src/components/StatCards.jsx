import { useState, useEffect } from 'react';
import './StatCards.css';

const StatCards = () => {
  const [stats, setStats] = useState({
    totalEntries: 0,
    averageMood: 0,
    averageSentiment: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:5050/api/journal/stats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
      })
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  return (
    <div className="stat-cards-container">
      <div className="stat-card">
        <h3>Total Entries</h3>
        <p className="stat-number">{stats.totalEntries}</p>
      </div>
      <div className="stat-card">
        <h3>Average Mood</h3>
        <p className="stat-number">{stats.averageMood || 'N/A'}</p>
      </div>
      <div className="stat-card">
        <h3>Sentiment Score</h3>
        <p className="stat-number">{stats.averageSentiment?.toFixed(2) || 'N/A'}</p>
      </div>
    </div>
  );
};

export default StatCards;