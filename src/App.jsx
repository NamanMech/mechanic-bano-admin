// src/App.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const backendURL = 'https://mechanic-bano-backend.vercel.app';

function App() {
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
      alert('Failed to fetch configuration');
      setLoading(false);
    }
  };

  const handleUpdateConfig = async () => {
    try {
      await axios.put(`${backendURL}/api/config`, { websiteName, logoURL }, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Configuration updated successfully');
    } catch (error) {
      console.error('Update Config Error:', error);
      alert('Failed to update configuration');
    }
  };

  return (
    <div className="App">
      <h1>Admin Panel</h1>

      {loading ? <p>Loading...</p> : (
        <>
          {logoURL && <img src={logoURL} alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Website Name"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <input
              type="text"
              placeholder="Logo URL"
              value={logoURL}
              onChange={(e) => setLogoURL(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <button onClick={handleUpdateConfig}>Update Config</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
