import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

export default function UPIManagement() {
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchUpiId();
  }, []);

  const fetchUpiId = async () => {
    try {
      const response = await axios.get(`${API_URL}general?type=upi`);
      setUpiId(response.data.data.upiId || '');
    } catch (error) {
      toast.error('Error fetching UPI ID');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_URL}general?type=upi`, { upiId });
      toast.success('UPI ID updated successfully!');
    } catch (error) {
      toast.error('Error updating UPI ID');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h1>UPI ID Management</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="upiId">UPI ID</label>
          <input
            id="upiId"
            type="text"
            placeholder="Enter UPI ID (e.g., yourname@ybl)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save UPI ID'}
        </button>
      </form>
    </div>
  );
}
