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
    }
  };

  const handleUpdateConfig = async () => {
    try {
      await axios.put(`${backendURL}/api/config`, { websiteName, logoURL }, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Configuration updated successfully');
      fetchConfig();
    } catch (error) {
      console.error('Update Config Error:', error);
      alert('Failed to update configuration');
    }
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Admin Panel - {websiteName}</h1>

      {logoURL ? (
        <img
          src={logoURL}
          alt="Website Logo"
          style={{ width: '150px', marginBottom: '20px' }}
          onError={(e) => { e.target.style.display = 'none'; alert('Logo failed to load'); }}
        />
      ) : (
        <p>No Logo Found</p>
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
