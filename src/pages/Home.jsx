import React from 'react';

export default function Home() {
  return (
    <main
      style={{
        textAlign: 'center',
        marginTop: '5rem',
        maxWidth: '480px',
        margin: '60px auto',
        padding: '32px 18px',
        background: '#f5f6fa',
        borderRadius: '12px',
        boxShadow: '0 2px 14px rgba(44,62,80,0.07)',
      }}
      aria-label="Admin Panel Welcome"
    >
      <h1 style={{
        fontSize: '2.25rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#2c3e50'
      }}>
        Welcome to Mechanic Bano Admin Panel
      </h1>
      <p style={{
        fontSize: '1.125rem',
        color: '#34495e'
      }}>
        Manage your tutorials, PDFs, and subscriptions here.
      </p>
    </main>
  );
}
