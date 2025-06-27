// src/pages/Branding.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';

const backendURL = 'https://mechanic-bano-backend.vercel.app';

function Branding() {
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

  const updateSiteName = async () => {
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

  const updateLogo = async () => {
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="branding-page">
      <h1>Update Site Branding</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Site Name</h2>
        <input
          type="text"
          placeholder="Website Name"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
        />
        <button onClick={updateSiteName}>Update Site Name</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Website Logo</h2>
        <input
          type="text"
          placeholder="Logo URL"
          value={logoURL}
          onChange={(e) => setLogoURL(e.target.value)}
        />
        <button onClick={updateLogo}>Update Logo</button>
      </div>

      <div>
        <h3>Preview:</h3>
        {logoURL && <img src={logoURL} alt="Website Logo" style={{ width: '150px' }} />}
      </div>
    </div>
  );
}

export default Branding;
