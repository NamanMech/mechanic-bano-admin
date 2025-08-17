import React from 'react';
import './Spinner.css'; // Make sure to include the updated CSS below

export default function Spinner() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }} role="status" aria-live="polite">
      <div className="spinner-ring" aria-hidden="true"></div>
      <p style={{ marginTop: '18px', fontSize: '16px', color: '#333' }}>Loading...</p>
    </div>
  );
}
