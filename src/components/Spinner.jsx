import React from 'react';
import '../styles/components/spinner.css';


export default function Spinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-container" role="status" aria-live="polite" aria-label={message}>
      <div className="spinner-ring" aria-hidden="true"></div>
      <p className="spinner-message">{message}</p>
    </div>
  );
}
