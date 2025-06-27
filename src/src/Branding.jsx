// src/Branding.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const backendURL = 'https://mechanic-bano-backend.vercel.app';

function Branding() {
  const [websiteName, setWebsiteName] = useState('Mechanic Bano');
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
      console.error('Fetch Config Error:', error);
    }
  };

  const handleUpdateConfig = async () => {
    try {
      await axios.put(`${backendURL}/api/config`, { websiteName, logoURL }, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Configuration updated successfully');
      fetchConfig(); // Refresh UI
    } catch (error) {
      console.error('Update Config Error:', error);
      alert('Failed to update configuration');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Admin Panel - {websiteName}</h1>

      {logoURL && (
        <img
          src={logoURL}
          alt="Website Logo"
          style={{ width: '150px', marginBottom: '20px' }}
          onError={(e) => { e.target.src = ''; }} // agar image error ho to hata do
        />
      )}

      <div>
        <input
          type="text"
          placeholder="Website Name"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Logo URL"
          value={logoURL}
          onChange={(e) => setLogoURL(e.target.value)}
        />
        <button onClick={handleUpdateConfig}>Update Branding</button>
      </div>
    </div>
  );
}

export default Branding;
