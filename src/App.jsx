import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const backendURL = 'https://mechanic-bano-backend.vercel.app';

function App() {
  const [websiteName, setWebsiteName] = useState('');
  const [logoURL, setLogoURL] = useState('');
  const [newWebsiteName, setNewWebsiteName] = useState('');
  const [newLogoURL, setNewLogoURL] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/config`);
      setWebsiteName(res.data.websiteName);
      setLogoURL(res.data.logoURL);
      setNewWebsiteName(res.data.websiteName);
      setNewLogoURL(res.data.logoURL);
    } catch (error) {
      console.error('Fetch Config Error:', error);
    }
  };

  const handleUpdateConfig = async () => {
    try {
      await axios.put(`${backendURL}/api/config`, {
        websiteName: newWebsiteName,
        logoURL: newLogoURL,
      });
      alert('Configuration updated successfully');
      fetchConfig();
    } catch (error) {
      console.error('Update Config Error:', error);
      alert('Failed to update configuration');
    }
  };

  return (
    <div className="App">
      <h1>Admin Panel</h1>

      {logoURL && <img src={logoURL} alt="Website Logo" style={{ width: '150px', marginBottom: '20px' }} />}
      <h2>Website Name: {websiteName}</h2>

      <div style={{ marginTop: '30px' }}>
        <h2>Update Website Branding</h2>
        <input
          type="text"
          placeholder="Website Name"
          value={newWebsiteName}
          onChange={(e) => setNewWebsiteName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Logo URL"
          value={newLogoURL}
          onChange={(e) => setNewLogoURL(e.target.value)}
          required
        />
        <button onClick={handleUpdateConfig}>Update Branding</button>
      </div>
    </div>
  );
}

export default App;
