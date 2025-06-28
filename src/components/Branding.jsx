import { useEffect, useState } from 'react';
import axios from 'axios';

const backendURL = 'https://mechanic-bano-backend.vercel.app';
const githubLogoURL = 'https://raw.githubusercontent.com/NamanMech/mechanic-bano-admin/main/src/assets/logo.png';

function Branding() {
  const [websiteName, setWebsiteName] = useState('');
  const [logoURL, setLogoURL] = useState(githubLogoURL);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/config`);
      setWebsiteName(res.data.websiteName);
    } catch (error) {
      alert('Failed to load configuration');
    }
  };

  const handleUpdateSiteName = async () => {
    alert(`Updating site name: ${websiteName}`);
    try {
      await axios.post(`${backendURL}/api/config/update-site-name`, { websiteName }, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Site name updated successfully');
    } catch (error) {
      alert('Failed to update site name');
    }
  };

  return (
    <div>
      <h2>Website Branding</h2>
      <div style={{ marginBottom: '20px' }}>
        <img src={logoURL} alt="Website Logo" style={{ width: '150px' }} />
      </div>
      <input
        type="text"
        placeholder="Website Name"
        value={websiteName}
        onChange={(e) => setWebsiteName(e.target.value)}
      />
      <button onClick={handleUpdateSiteName}>Update Site Name</button>
    </div>
  );
}

export default Branding;
