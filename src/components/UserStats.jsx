import React from 'react';

export default function UserStats({ users }) {
  const total = users.length;
  const subscribed = users.filter((u) => u.isSubscribed).length;
  const expired = total - subscribed;
  const subscribedPercentage = total > 0 ? Math.round((subscribed / total) * 100) : 0;
  const expiredPercentage = total > 0 ? Math.round((expired / total) * 100) : 0;

  return (
    <section className="user-stats-container" aria-label="User statistics summary">
      <h3 className="stats-title">User Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card total-users" tabIndex={0} aria-describedby="totalUsersDesc">
          <div className="stat-icon" aria-hidden="true">
            {/* User icon SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h4 id="totalUsersDesc">Total Users</h4>
            <p className="stat-number">{total}</p>
          </div>
        </div>

        <div className="stat-card subscribed-users" tabIndex={0} aria-describedby="subscribedUsersDesc">
          <div className="stat-icon" aria-hidden="true">
            {/* Subscribed icon SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h4 id="subscribedUsersDesc">Subscribed</h4>
            <p className="stat-number">{subscribed}</p>
            <div className="stat-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill subscribed-fill" 
                  style={{width: `${subscribedPercentage}%`}}
                  aria-valuenow={subscribedPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  role="progressbar"
                  aria-label={`${subscribedPercentage}% of users are subscribed`}
                ></div>
              </div>
              <span className="percentage">{subscribedPercentage}%</span>
            </div>
          </div>
        </div>

        <div className="stat-card expired-users" tabIndex={0} aria-describedby="expiredUsersDesc">
          <div className="stat-icon" aria-hidden="true">
            {/* Expired icon SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h4 id="expiredUsersDesc">Expired</h4>
            <p className="stat-number">{expired}</p>
            <div className="stat-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill expired-fill" 
                  style={{width: `${expiredPercentage}%`}}
                  aria-valuenow={expiredPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  role="progressbar"
                  aria-label={`${expiredPercentage}% of users have expired subscriptions`}
                ></div>
              </div>
              <span className="percentage">{expiredPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
