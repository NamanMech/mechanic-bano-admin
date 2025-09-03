import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', price: '', days: '', discount: '' });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const titleInputRef = useRef();
  const getBaseUrl = () => (API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL);

  // Fetch plans from backend
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${getBaseUrl()}/subscription-plans`);
      if (response.data) {
        if (Array.isArray(response.data)) {
          setPlans(response.data);
        } else if (response.data.success && Array.isArray(response.data.data)) {
          setPlans(response.data.data);
        } else {
          toast.error('Unexpected response format from server');
          console.error('Unexpected response:', response);
          setPlans([]);
        }
      }
    } catch (error) {
      toast.error('Error fetching plans.');
      console.error('Error details:', error.response?.data || error.message);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form for create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || form.price === '' || form.days === '') {
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
        await axios.put(
          `${getBaseUrl()}/subscription-plans?id=${editingId}`,
          JSON.stringify(payload),
          { headers: { 'Content-Type': 'application/json' } }
        );
        toast.success('Plan updated successfully!');
      } else {
        await axios({
          method: 'post',
          url: `${getBaseUrl()}/subscription-plans`,
          data: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Plan created successfully!');
      }
      setForm({ title: '', price: '', days: '', discount: '' });
      setEditingId(null);
      await fetchPlans();
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error saving plan.';
      toast.error(errorMessage);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setSaving(false);
    }
  };

  // Edit existing plan
  const handleEdit = (plan) => {
    setForm({
      title: plan.title,
      price: plan.price.toString(),
      days: plan.days.toString(),
      discount: plan.discount ? plan.discount.toString() : '',
    });
    setEditingId(plan._id);
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Delete existing plan
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await axios.delete(`${getBaseUrl()}/subscription-plans?id=${id}`);
      toast.success('Plan deleted successfully!');
      await fetchPlans();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting plan.';
      toast.error(errorMessage);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    setForm({ title: '', price: '', days: '', discount: '' });
    setEditingId(null);
    if (titleInputRef.current) titleInputRef.current.focus();
  };

  if (loading)
    return (
      <div className="spinner-container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <Spinner message="Loading plans..." />
      </div>
    );

  return (
    <div className="subscription-plans" style={{ maxWidth: 700, margin: '0 auto' }}>
      <form onSubmit={handleSubmit} noValidate style={{ marginBottom: '2rem' }}>
        <h2>{editingId ? 'Edit Subscription Plan' : 'Add Subscription Plan'}</h2>
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          name="title"
          value={form.title}
          onChange={handleInputChange}
          ref={titleInputRef}
          disabled={saving}
          required
          placeholder="Enter plan title"
        />
        <label htmlFor="price">Price (₹) *</label>
        <input
          id="price"
          type="number"
          name="price"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleInputChange}
          disabled={saving}
          required
          placeholder="Enter price"
        />
        <label htmlFor="days">Duration (Days) *</label>
        <input
          id="days"
          type="number"
          name="days"
          min="1"
          value={form.days}
          onChange={handleInputChange}
          disabled={saving}
          required
          placeholder="Number of days plan lasts"
        />
        <label htmlFor="discount">Discount (%)</label>
        <input
          id="discount"
          type="number"
          name="discount"
          min="0"
          max="100"
          step="0.01"
          value={form.discount}
          onChange={handleInputChange}
          disabled={saving}
          placeholder="Enter discount percentage (optional)"
        />
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={saving}>
            {saving ? (editingId ? 'Updating...' : 'Creating...') : editingId ? 'Update Plan' : 'Create Plan'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
              style={{ marginLeft: '1rem', backgroundColor: '#888' }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <section>
        <h2>Existing Subscription Plans</h2>
        {plans.length === 0 ? (
          <p>No subscription plans found.</p>
        ) : (
          <table className="custom-table" aria-label="Subscription Plans Table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Price (₹)</th>
                <th scope="col">Days</th>
                <th scope="col">Discount (%)</th>
                <th scope="col" style={{ minWidth: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan._id}>
                  <td>{plan.title}</td>
                  <td>₹{Number(plan.price).toFixed(2)}</td>
                  <td>{plan.days}</td>
                  <td>{plan.discount || 0}%</td>
                  <td>
                    <button type="button" onClick={() => handleEdit(plan)} disabled={saving}>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(plan._id)}
                      disabled={saving}
                      style={{ marginLeft: '0.5rem' }}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
