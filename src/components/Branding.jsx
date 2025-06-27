import { useEffect, useState } from 'react';
import axios from 'axios';

const backendURL = 'https://mechanic-bano-backend.vercel.app';

const Branding = () => {
  const [websiteName, setWebsiteName] = useState('');
  const [logoURL, setLogoURL] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/config`);
      alert(`Fetch Success: ${JSON.stringify(res.data)}`);
      setWebsiteName(res.data.websiteName);
      setLogoURL(res.data.logoURL);
      setLoading(false);
    } catch (error) {
      alert(`Fetch Error: ${error.message}`);
      setLoading(false);
    }
  };

  const updateSiteName = async () => {
    try {
      alert(`Updating Site Name: ${websiteName}`);

      const res = await axios.put(`${backendURL}/api/config`, { websiteName, logoURL }, {
        headers: { 'Content-Type': 'application/json' }
      });

      alert(`Response: ${JSON.stringify(res.data)}`);

      if (res.status === 200) {
        alert('Site name updated successfully');
      } else {
        alert('Failed to update site name');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      alert('Failed to update site name');
    }
  };

  const updateLogo = async () => {
    try {
      alert(`Updating Logo: ${logoURL}`);

      const res = await axios.put(`${backendURL}/api/config`, { websiteName, logoURL }, {
        headers: { 'Content-Type': 'application/json' }
      });

      alert(`Response: ${JSON.stringify(res.data)}`);

      if (res.status === 200) {
        alert('Logo updated successfully');
      } else {
        alert('Failed to update logo');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      alert('Failed to update logo');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="branding">
      <h2>Update Branding</h2>

      <div>
        <label>Website Name: </label>
        <input type="text" value={websiteName} onChange={(e) => setWebsiteName(e.target.value)} />
        <button onClick={updateSiteName}>Update Site Name</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label>Logo URL: </label>
        <input type="text" value={logoURL} onChange={(e) => setLogoURL(e.target.value)} />
        <button onClick={updateLogo}>Update Logo</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {logoURL && <img src={logoURL} alt="Website Logo" style={{ width: '150px' }} />}
      </div>
    </div>
  );
};

export default Branding;
