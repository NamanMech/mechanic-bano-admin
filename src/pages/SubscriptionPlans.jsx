import React, { useEffect, useState } from 'react';
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
    if (!form.title || !form.price || !form.days) return toast.error('Please fill all required fields.');

    setSaving(true);

    try {
      if (editingId) {
        await axios.put(`${API_URL}subscription?id=${editingId}`, form);
        toast.success('Plan updated successfully!');
      } else {
        await axios.post(`${API_URL}subscription`, form);
        toast.success('Plan created successfully!');
      }

      setForm({ title: '', price: '', days: '', discount: '' });
      setEditingId(null);
      fetchPlans();
    } catch (error) {
      toast.error('Error saving plan.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (plan) => {
    setForm({
      title: plan.title,
      price: plan.price,
      days: plan.days,
      discount: plan.discount,
    });
    setEditingId(plan._id);
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

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h2>Subscription Plans</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Plan Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Validity (Days)"
          value={form.days}
          onChange={(e) => setForm({ ...form, days: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Discount (%)"
          value={form.discount}
          onChange={(e) => setForm({ ...form, discount: e.target.value })}
        />

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : editingId ? 'Update Plan' : 'Add Plan'}
        </button>
      </form>

      <h3>All Plans</h3>
      {plans.length === 0 ? (
        <p>No plans available.</p>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Days</th>
              <th>Discount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan._id}>
                <td>{plan.title}</td>
                <td>{plan.price}</td>
                <td>{plan.days}</td>
                <td>{plan.discount || 0}%</td>
                <td>
                  <button onClick={() => handleEdit(plan)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(plan._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
