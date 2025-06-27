// src/App.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const backendURL = 'https://mechanic-bano-backend.vercel.app';

function App() {
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
    const res = await axios.put(`${backendURL}/api/config`, { websiteName, logoURL }, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.data.success) {
      alert('Configuration updated successfully');
    } else {
      alert('Failed to update configuration: ' + res.data.message);
    }
  } catch (error) {
    console.error('Update Config Error:', error);
    alert('Failed to update configuration');
  }
};
  
  return (
    <div className="App">
      <h1>Admin Panel - {websiteName}</h1>

      {logoURL && <img src={logoURL} alt="Website Logo" style={{ width: '150px', marginBottom: '20px' }} />}

      <div style={{ marginTop: '20px' }}>
        <h2>Update Website Branding</h2>
        <input type="text" placeholder="Website Name" value={websiteName} onChange={(e) => setWebsiteName(e.target.value)} />
        <input type="text" placeholder="Logo URL" value={logoURL} onChange={(e) => setLogoURL(e.target.value)} />
        <button onClick={handleUpdateConfig}>Update Branding</button>
      </div>
    </div>
  );
}

export default App;
