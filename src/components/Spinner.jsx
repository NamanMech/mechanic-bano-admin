import React from 'react';
import './Spinner.css'; // We'll update this CSS

export default function Spinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner-ring" aria-hidden="true"></div>
      <p className="spinner-message">{message}</p>
    </div>
  );
}
