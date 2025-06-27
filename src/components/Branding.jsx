// src/components/Branding.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';

const backendURL = 'https://mechanic-bano-backend.vercel.app';

function Branding() {
  const [websiteName, setWebsiteName] = useState('');
  const [logoURL, setLogoURL] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/config`);
      setWebsiteName(res.data.websiteName);
      setLogoURL(res.data.logoURL);
    } catch (error) {
      console.error('Error fetching config:', error);
      alert('Failed to load configuration');
    }
  };

  const handleUpdateSiteName = async () => {
    alert('Updating site name: ' + websiteName);
    try {
      await axios.put(`${backendURL}/api/config`, { websiteName });
      alert('Site name updated successfully');
      fetchConfig(); // To refresh the data
    } catch (error) {
      console.error('Error updating site name:', error);
      alert('Failed to update site name');
    }
  };

  const handleUpdateLogo = async () => {
    alert('Updating logo: ' + logoURL);
    try {
      await axios.put(`${backendURL}/api/config`, { logoURL });
      alert('Logo updated successfully');
      fetchConfig(); // To refresh the data
    } catch (error) {
      console.error('Error updating logo:', error);
      alert('Failed to update logo');
    }
  };

  return (
    <div className="branding">
      <h2>Update Branding</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Website Name"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
        />
        <button onClick={handleUpdateSiteName}>Update Site Name</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Logo URL"
          value={logoURL}
          onChange={(e) => setLogoURL(e.target.value)}
        />
        <button onClick={handleUpdateLogo}>Update Logo</button>
      </div>

      {logoURL && (
        <img
          src={logoURL}
          alt="Website Logo"
          style={{ width: '150px', marginTop: '20px' }}
        />
      )}
    </div>
  );
}

export default Branding;
