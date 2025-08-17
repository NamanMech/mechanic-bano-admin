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
      const response = await axios.get(`${API_URL}subscription`);
      setPlans(response.data);
    } catch (error) {
      toast.error('Error fetching plans.');
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
      if (editingId) {
        await axios.put(`${API_URL}subscription?id=${editingId}`, payload);
        toast.success('Plan updated successfully!');
      } else {
        await axios.post(`${API_URL}subscription`, payload);
        toast.success('Plan created successfully!');
      }
      setForm({ title: '', price: '', days: '', discount: '' });
      setEditingId(null);
      fetchPlans();
      if (titleInputRef.current) titleInputRef.current.focus();
    } catch (error) {
      toast.error('Error saving plan.');
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
        await axios.delete(`${API_URL}subscription?id=${id}`);
        toast.success('Plan deleted successfully!');
        fetchPlans();
      } catch (error) {
        toast.error('Error deleting plan.');
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
    <div className="container" style={{ maxWidth: 700, margin: '0 auto', padding: '20px' }}>
      <h2>Subscription Plans</h2>
      <form
        onSubmit={handleSubmit}
        className="form"
        style={{ display: 'grid', gap: '12px', maxWidth: '400px', background: '#fafafa', padding: '16px', borderRadius: '8px', marginBottom: '18px' }}
        aria-label={editingId ? "Edit Plan Form" : "Add Plan Form"}
      >
        <label htmlFor="planTitle">Plan Title *</label>
        <input
          id="planTitle"
          ref={titleInputRef}
          type="text"
          placeholder="Plan Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          disabled={saving}
        />
        <label htmlFor="planPrice">Price *</label>
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
        />
        <label htmlFor="planDays">Validity (Days) *</label>
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
        />
        <label htmlFor="planDiscount">Discount (%)</label>
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
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update Plan' : 'Add Plan'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ background: '#e0e0e0', color: '#444', fontWeight: 'bold' }}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <h3>All Plans</h3>
      {plans.length === 0 ? (
        <p>No plans available.</p>
      ) : (
        <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label="Subscription Plans Table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price (₹)</th>
              <th>Days</th>
              <th>Discount (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan._id}>
                <td>{plan.title}</td>
                <td>{plan.price}</td>
                <td>{plan.days}</td>
                <td>{plan.discount ? plan.discount : 0}%</td>
                <td>
                  <button onClick={() => handleEdit(plan)} className="btn-edit" aria-label={`Edit ${plan.title} plan`}>Edit</button>
                  <button onClick={() => handleDelete(plan._id)} className="btn-delete" aria-label={`Delete ${plan.title} plan`}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
