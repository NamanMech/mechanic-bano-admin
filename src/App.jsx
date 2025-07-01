import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import YouTubeVideoManagement from './pages/YouTubeVideoManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4 space-x-4">
          <Link to="/" className="text-blue-500">Home</Link>
          <Link to="/youtube" className="text-blue-500">YouTube Video Management</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/youtube" element={<YouTubeVideoManagement />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  )
}
