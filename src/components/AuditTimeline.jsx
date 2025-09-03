import React from 'react';

export default function AuditTimeline({ logs }) {
  return (
    <section className="audit-log" aria-label="Audit Logs">
      <h3>Audit Logs</h3>
      {logs.length === 0 ? (
        <p className="no-logs-message">No audit logs available.</p>
      ) : (
        <ul>
          {logs.map((log) => (
            <li key={log.id || log.timestamp} tabIndex="0" aria-live="polite" style={{marginBottom: '0.5rem'}}>
              <strong>{log.action}</strong> — <span>{log.email}</span> at{' '}
              <em>{new Date(log.timestamp).toLocaleString()}</em>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
