// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import YouTubeVideoManagement from './pages/YouTubeVideoManagement';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-4xl font-bold mb-2 text-center text-blue-600">Mechanic Bano Admin Panel</h1>
          <p className="text-center text-gray-600 mb-4">Welcome to Mechanic Bano Dashboard</p>
          <nav className="flex justify-center space-x-4">
            <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Home</Link>
            <Link to="/youtube" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Manage YouTube Videos</Link>
          </nav>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/youtube" element={<YouTubeVideoManagement />} />
        </Routes>
      </div>
    </Router>
  );
}
