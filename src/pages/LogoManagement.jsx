// Admin Panel: src/pages/LogoManagement.jsx 

import React, { useEffect, useState } from 'react'; import axios from 'axios';

export default function LogoManagement() { const [logoUrl, setLogoUrl] = useState(''); const [loading, setLoading] = useState(false);

const fetchLogo = async () => { try { const response = await axios.get(import.meta.env.VITE_API_URL + 'logo'); if (response.data && response.data.url) { setLogoUrl(response.data.url); } } catch (error) { alert('Error fetching logo'); } };

useEffect(() => { fetchLogo(); }, []);

const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); try { await axios.put(import.meta.env.VITE_API_URL + 'logo', { url: logoUrl }); alert('Logo updated successfully'); } catch (error) { alert('Error updating logo'); } finally { setLoading(false); } };

return ( <div style={{ padding: '20px' }}> <h1>Logo Management</h1> <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}> <input type="text" placeholder="Enter GitHub Raw Logo URL" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} required /> <button type="submit" disabled={loading}> {loading ? 'Saving...' : 'Update Logo'} </button> </form> {logoUrl && ( <div style={{ marginTop: '20px' }}> <p>Preview:</p> <img src={logoUrl} alt="Site Logo" style={{ maxWidth: '200px' }} /> </div> )} </div> ); }
