import React from 'react';
import '../styles/components/audit-timeline.css';

export default function AuditTimeline({ logs }) {
  return (
    <section className="audit-log" aria-label="Audit Logs">
      <h3 className="audit-log-title">Audit Logs</h3>
      {logs.length === 0 ? (
        <p className="no-logs-message">No audit logs available.</p>
      ) : (
        <ul className="audit-log-list">
          {logs.map((log) => (
            <li key={log.id || log.timestamp} tabIndex="0" aria-live="polite" className="audit-log-item">
              <strong>{log.action}</strong> — <span>{log.email}</span> at{' '}
              <em>{new Date(log.timestamp).toLocaleString()}</em>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
