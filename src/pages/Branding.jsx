// src/components/Branding.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';

const backendURL = 'https://mechanic-bano-backend.vercel.app';

export default function Branding() {
  const [websiteName, setWebsiteName] = useState('');
  const [logoURL, setLogoURL] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/config`);
      setWebsiteName(res.data.websiteName);
      setLogoURL(res.data.logoURL);
      setLoading(false);
    } catch (error) {
      console.error('Fetch Config Error:', error);
      alert('Failed to load configuration');
      setLoading(false);
    }
  };

  const handleUpdateSiteName = async () => {
    try {
      await axios.put(`${backendURL}/api/config`, { websiteName, logoURL }, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Site name updated successfully');
    } catch (error) {
      console.error('Update Site Name Error:', error);
      alert('Failed to update site name');
    }
  };

  const handleUpdateLogo = async () => {
    try {
      await axios.put(`${backendURL}/api/config`, { websiteName, logoURL }, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Logo updated successfully');
    } catch (error) {
      console.error('Update Logo Error:', error);
      alert('Failed to update logo');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Website Branding</h2>

      <div>
        <label>Website Name:</label>
        <input
          type="text"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
        />
        <button onClick={handleUpdateSiteName}>Update Site Name</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label>Logo URL:</label>
        <input
          type="text"
          value={logoURL}
          onChange={(e) => setLogoURL(e.target.value)}
        />
        <button onClick={handleUpdateLogo}>Update Logo</button>
      </div>

      {logoURL && (
        <div style={{ marginTop: '20px' }}>
          <img src={logoURL} alt="Website Logo" style={{ width: '150px' }} />
        </div>
      )}
    </div>
  );
}
