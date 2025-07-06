// src/components/Spinner.jsx
import React from 'react';
import './Spinner.css'; // Optional: if you want to separate spinner CSS

export default function Spinner() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}
