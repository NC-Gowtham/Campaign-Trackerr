import React, { useMemo } from 'react';

function SummaryItem({ count, title }) {
  return (
    <div className="summary-item">
      <div className="count">{count}</div>
      <div className="title">{title}</div>
    </div>
  );
}

export default function Dashboard({ campaigns }) {

  const stats = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter(c => c.status === 'Active').length;
    const paused = campaigns.filter(c => c.status === 'Paused').length;
    const completed = campaigns.filter(c => c.status === 'Completed').length;
    return { total, active, paused, completed };
  }, [campaigns]);

  return (
    <div className="card">
      <h3>Dashboard Summary</h3>
      <div className="dashboard-summary">
        <SummaryItem count={stats.total} title="Total Campaigns" />
        <SummaryItem count={stats.active} title="Active" />
        <SummaryItem count={stats.paused} title="Paused" />
        <SummaryItem count={stats.completed} title="Completed" />
      </div>
    </div>
  );
}