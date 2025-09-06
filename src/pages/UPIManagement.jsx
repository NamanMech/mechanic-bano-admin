import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import '../styles/pages/upi-management.css';

export default function UPIManagement() {
  const [upiId, setUpiId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrFile, setQrFile] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const getBaseUrl = () => (API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL);

  const fetchUpiData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${getBaseUrl()}/general?type=upi`);
      setUpiId(response.data?.data?.upiId || '');
      setQrCode(response.data?.data?.qrCode || '');
    } catch (error) {
      toast.error('Error fetching UPI data');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpiData();
  }, []);

  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setQrFile(file);
    
    // Preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setQrCode(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('upiId', upiId);
      
      if (qrFile) {
        formData.append('qrCodeFile', qrFile);
      } else if (qrCode && !qrCode.startsWith('data:image')) {
        // If qrCode is a URL (from previous upload), keep it
        formData.append('qrCode', qrCode);
      }

      await axios.put(`${getBaseUrl()}/general?type=upi`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('UPI data updated successfully!');
      setQrFile(null); // Reset file state
      fetchUpiData(); // Refetch data to get the updated QR code URL
    } catch (error) {
      toast.error('Error updating UPI data');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner message="Loading UPI data..." />;

  return (
    <div className="container upi-management">
      <h1>UPI Management</h1>
      <form onSubmit={handleSubmit} className="upi-form" aria-label="Update UPI data form">
        <div className="form-group">
          <label htmlFor="upiId">UPI ID</label>
          <input
            id="upiId"
            type="text"
            placeholder="Enter UPI ID (e.g., yourname@ybl)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            required
            disabled={saving}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="qrCodeFile">QR Code</label>
          <input
            id="qrCodeFile"
            type="file"
            accept="image/*"
            onChange={handleQrUpload}
            disabled={saving}
          />
        </div>
        
        {qrCode && (
          <div className="form-group">
            <label>QR Code Preview</label>
            <img src={qrCode} alt="UPI QR Code" className="qr-preview" />
          </div>
        )}
        
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save UPI Data'}
        </button>
      </form>
    </div>
  );
}
