// src/components/UserStats.jsx
import React from 'react';

export default function UserStats({ users }) {
  const total = users.length;
  const subscribed = users.filter((u) => u.isSubscribed).length;
  const expired = total - subscribed;

  return (
    <div className="stats-container">
      <div className="stat-card total">
        <h4>Total Users</h4>
        <p>{total}</p>
      </div>
      <div className="stat-card subscribed">
        <h4>Subscribed</h4>
        <p>{subscribed}</p>
      </div>
      <div className="stat-card expired">
        <h4>Expired</h4>
        <p>{expired}</p>
      </div>
    </div>
  );
}
