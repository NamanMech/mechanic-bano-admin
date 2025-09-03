import React from 'react';
import '../styles/pages/home.css';

export default function Home() {
  return (
    <main className="container" aria-label="Admin Panel Welcome">
      <div className="welcome-card">
        <h1>Welcome to Mechanic Bano Admin Panel</h1>
        <p>Manage your tutorials, PDFs, and subscriptions here.</p>
      </div>
    </main>
  );
}
