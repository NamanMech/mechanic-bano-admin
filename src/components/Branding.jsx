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
      console.error('Failed to load configuration', error);
      alert('Failed to load configuration');
    }
  };

  const updateSiteName = async () => {
    try {
      await axios.put(`${backendURL}/api/config`, { websiteName });
      alert('Site name updated successfully');
      fetchConfig();
    } catch (error) {
      console.error('Failed to update site name', error);
      alert('Failed to update site name');
    }
  };

  const updateLogo = async () => {
    try {
      await axios.put(`${backendURL}/api/config`, { logoURL });
      alert('Logo updated successfully');
      fetchConfig();
    } catch (error) {
      console.error('Failed to update logo', error);
      alert('Failed to update logo');
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="branding">
      <h2>Update Branding</h2>

      <div>
        <input
          type="text"
          placeholder="Website Name"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
        />
        <button onClick={updateSiteName}>Update Site Name</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Logo URL"
          value={logoURL}
          onChange={(e) => setLogoURL(e.target.value)}
        />
        <button onClick={updateLogo}>Update Logo</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Preview</h3>
        {logoURL && (
          <img
            src={logoURL}
            alt="Website Logo"
            style={{ width: '150px', marginTop: '10px' }}
          />
        )}
      </div>
    </div>
  );
}
