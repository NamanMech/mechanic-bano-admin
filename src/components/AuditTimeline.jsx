import React from 'react';

export default function AuditTimeline({ logs }) {
  return (
    <div className="audit-timeline">
      <h3>Audit Logs</h3>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            <strong>{log.action}</strong> — <span>{log.email}</span> at <em>{log.timestamp}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
