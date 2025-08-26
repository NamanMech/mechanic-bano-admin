import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner.jsx';
import { toast } from 'react-toastify';

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', price: '', days: '', discount: '' });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const titleInputRef = useRef();

  const fetchPlans = async () => {
    try {
      // Remove any trailing slash from API_URL to avoid double slashes
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      const response = await axios.get(`${baseUrl}/subscription`);
      
      // Check if response structure matches expected format
      if (response.data && response.data.success) {
        setPlans(response.data.data || []);
      } else if (Array.isArray(response.data)) {
        // Handle case where API returns array directly
        setPlans(response.data);
      } else {
        toast.error('Unexpected response format from server');
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      toast.error('Error fetching plans.');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price || !form.days) {
      toast.error('Please fill all required fields.');
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      price: parseFloat(form.price),
      days: parseInt(form.days, 10),
      discount: parseFloat(form.discount) || 0,
    };
    try {
      // Remove any trailing slash from API_URL to avoid double slashes
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      
      if (editingId) {
        await axios.put(`${baseUrl}/subscription?id=${editingId}`, payload);
        toast.success('Plan updated successfully!');
      } else {
        await axios.post(`${baseUrl}/subscription`, payload);
        toast.success('Plan created successfully!');
      }
      setForm({ title: '', price: '', days: '', discount: '' });
      setEditingId(null);
      fetchPlans();
      if (titleInputRef.current) titleInputRef.current.focus();
    } catch (error) {
      toast.error('Error saving plan.');
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (plan) => {
    setForm({
      title: plan.title,
      price: plan.price.toString(),
      days: plan.days.toString(),
      discount: (plan.discount || '').toString(),
    });
    setEditingId(plan._id);
    setTimeout(() => {
      if (titleInputRef.current) titleInputRef.current.focus();
    }, 100);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      try {
        // Remove any trailing slash from API_URL to avoid double slashes
        const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        await axios.delete(`${baseUrl}/subscription?id=${id}`);
        toast.success('Plan deleted successfully!');
        fetchPlans();
      } catch (error) {
        toast.error('Error deleting plan.');
        console.error('Error details:', error.response?.data || error.message);
      }
    }
  };

  const handleCancelEdit = () => {
    setForm({ title: '', price: '', days: '', discount: '' });
    setEditingId(null);
    if (titleInputRef.current) titleInputRef.current.focus();
  };

  if (loading) return <Spinner />;
  
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Subscription Plans</h2>
      <form
        onSubmit={handleSubmit}
        style={{ 
          display: 'grid', 
          gap: '12px', 
          maxWidth: '400px', 
          background: '#fafafa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '18px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        aria-label={editingId ? "Edit Plan Form" : "Add Plan Form"}
      >
        <label htmlFor="planTitle" style={{ fontWeight: 'bold' }}>Plan Title *</label>
        <input
          id="planTitle"
          ref={titleInputRef}
          type="text"
          placeholder="Plan Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          disabled={saving}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <label htmlFor="planPrice" style={{ fontWeight: 'bold' }}>Price (₹) *</label>
        <input
          id="planPrice"
          type="number"
          min="0"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
          disabled={saving}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <label htmlFor="planDays" style={{ fontWeight: 'bold' }}>Validity (Days) *</label>
        <input
          id="planDays"
          type="number"
          min="1"
          step="1"
          placeholder="Validity (Days)"
          value={form.days}
          onChange={(e) => setForm({ ...form, days: e.target.value })}
          required
          disabled={saving}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <label htmlFor="planDiscount" style={{ fontWeight: 'bold' }}>Discount (%)</label>
        <input
          id="planDiscount"
          type="number"
          min="0"
          max="100"
          step="0.01"
          placeholder="Discount (%)"
          value={form.discount}
          onChange={(e) => setForm({ ...form, discount: e.target.value })}
          disabled={saving}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            disabled={saving}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
          >
            {saving ? 'Saving...' : editingId ? 'Update Plan' : 'Add Plan'}
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={handleCancelEdit} 
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#e0e0e0', 
                color: '#444', 
                border: 'none', 
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <h3 style={{ color: '#34495e', marginBottom: '15px' }}>All Plans</h3>
      {plans.length === 0 ? (
        <p>No plans available.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }} role="table" aria-label="Subscription Plans Table">
            <thead>
              <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Price (₹)</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Days</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Discount (%)</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{plan.title}</td>
                  <td style={{ padding: '12px' }}>{plan.price}</td>
                  <td style={{ padding: '12px' }}>{plan.days}</td>
                  <td style={{ padding: '12px' }}>{plan.discount ? plan.discount : 0}%</td>
                  <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleEdit(plan)} 
                      style={{ 
                        padding: '6px 12px', 
                        backgroundColor: '#ffc107', 
                        color: '#222', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      aria-label={`Edit ${plan.title} plan`}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(plan._id)} 
                      style={{ 
                        padding: '6px 12px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      aria-label={`Delete ${plan.title} plan`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
