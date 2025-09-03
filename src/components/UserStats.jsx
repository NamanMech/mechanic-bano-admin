import React from 'react';
import '../styles/components/user-stats.css';

export default function UserStats({ users }) {
  const now = new Date();

  // Subscribed: isSubscribed true AND ya to subscriptionEnd nahi hai (unlimited), ya aaj ke baad wali hai
  const subscribed = users.filter(
    (u) =>
      u.isSubscribed &&
      (!u.subscriptionEnd || new Date(u.subscriptionEnd) > now)
  ).length;

  // Expired: isSubscribed false OR subscriptionEnd date aaj se pehle ya barabar ho
  const expired = users.filter(
    (u) =>
      !u.isSubscribed ||
      (u.subscriptionEnd && new Date(u.subscriptionEnd) <= now)
  ).length;

  const total = users.length;
  const subscribedPercentage = total > 0 ? Math.round((subscribed / total) * 100) : 0;
  const expiredPercentage = total > 0 ? Math.round((expired / total) * 100) : 0;

  return (
    <section className="user-stats-container" aria-label="User statistics summary">
      <h3 className="stats-title">User Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card total-users" tabIndex={0} aria-describedby="totalUsersDesc">
          <div className="stat-icon" aria-hidden="true">
            {/* SVG Icon */}
          </div>
          <div className="stat-content">
            <h4 id="totalUsersDesc">Total Users</h4>
            <p className="stat-number">{total}</p>
          </div>
        </div>
        <div className="stat-card subscribed-users" tabIndex={0} aria-describedby="subscribedUsersDesc">
          <div className="stat-icon" aria-hidden="true">
            {/* SVG Icon */}
          </div>
          <div className="stat-content">
            <h4 id="subscribedUsersDesc">Subscribed</h4>
            <p className="stat-number">{subscribed}</p>
            <div
              className="stat-progress"
              role="progressbar"
              aria-valuenow={subscribedPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`${subscribedPercentage}% of users are subscribed`}
            >
              <div className="progress-bar">
                <div className="progress-fill subscribed-fill" style={{ width: `${subscribedPercentage}%` }}></div>
              </div>
              <span className="percentage">{subscribedPercentage}%</span>
            </div>
          </div>
        </div>
        <div className="stat-card expired-users" tabIndex={0} aria-describedby="expiredUsersDesc">
          <div className="stat-icon" aria-hidden="true">
            {/* SVG Icon */}
          </div>
          <div className="stat-content">
            <h4 id="expiredUsersDesc">Expired</h4>
            <p className="stat-number">{expired}</p>
            <div
              className="stat-progress"
              role="progressbar"
              aria-valuenow={expiredPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`${expiredPercentage}% of users have expired subscriptions`}
            >
              <div className="progress-bar">
                <div className="progress-fill expired-fill" style={{ width: `${expiredPercentage}%` }}></div>
              </div>
              <span className="percentage">{expiredPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
