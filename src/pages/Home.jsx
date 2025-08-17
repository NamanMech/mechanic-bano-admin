import React from 'react';

export default function Home() {
  return (
    <main
      className="text-center mt-20"
      style={{
        maxWidth: 480,
        margin: '60px auto',
        padding: '32px 18px',
        background: '#f5f6fa',
        borderRadius: '12px',
        boxShadow: '0 2px 14px rgba(44,62,80,0.07)',
      }}
      aria-label="Admin Panel Welcome"
    >
      <h1 className="text-4xl font-bold mb-4" style={{ color: '#2c3e50' }}>
        Welcome to Mechanic Bano Admin Panel
      </h1>
      <p className="text-lg" style={{ color: '#34495e' }}>
        Manage your tutorials, PDFs, and subscriptions here.
      </p>
    </main>
  );
}
