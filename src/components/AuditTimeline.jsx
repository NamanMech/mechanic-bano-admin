import React from 'react';

export default function AuditTimeline({ logs }) {
  return (
    <section className="audit-timeline" aria-label="Audit Logs">
      <h3>Audit Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log.id || log.timestamp}>
            <strong>{log.action}</strong> — <span>{log.email}</span> at{' '}
            <em>{new Date(log.timestamp).toLocaleString()}</em>
          </li>
        ))}
      </ul>
    </section>
  );
}
