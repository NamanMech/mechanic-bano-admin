import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', price: '', days: '', discount: '' });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const titleInputRef = useRef();

  // Format API URL helper
  const formatApiUrl = (endpoint = '') => {
    const baseUrl = API_URL.replace(/\/+$/, ''); // Remove trailing slashes
    const cleanEndpoint = endpoint.replace(/^\/+/, ''); // Remove leading slashes
    return `${baseUrl}/${cleanEndpoint}`;
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(formatApiUrl('/subscription'));
      
      if (response.data && Array.isArray(response.data)) {
        setPlans(response.data);
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setPlans(response.data.data);
      } else {
        toast.error('Unexpected response format from server');
        console.error('Unexpected response:', response);
        setPlans([]);
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
        await axios.put(formatApiUrl(`/subscription?id=${editingId}`), payload);
        toast.success('Plan updated successfully!');
      } else {
        await axios.post(formatApiUrl('/subscription'), payload);
        toast.success('Plan created successfully!');
      }
      
      setForm({ title: '', price: '', days: '', discount: '' });
      setEditingId(null);
      await fetchPlans();
      
      if (titleInputRef.current) titleInputRef.current.focus();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error saving plan.';
      toast.error(errorMessage);
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      await axios.delete(formatApiUrl(`/subscription?id=${id}`));
      toast.success('Plan deleted successfully!');
      await fetchPlans();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting plan.';
      toast.error(errorMessage);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const handleCancelEdit = () => {
    setForm({ title: '', price: '', days: '', discount: '' });
    setEditingId(null);
    if (titleInputRef.current) titleInputRef.current.focus();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <Spinner />;
  
  return (
    <div className="container">
      <h1>
        {editingId ? 'Edit Subscription Plan' : 'Subscription Plans Management'}
      </h1>
      
      <div className="subscription-form-container">
        <h2>
          {editingId ? 'Edit Plan' : 'Add New Plan'}
        </h2>
        
        <form onSubmit={handleSubmit} className="subscription-form" aria-label={editingId ? "Edit Plan Form" : "Add Plan Form"}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="planTitle">
                Plan Title *
              </label>
              <input
                id="planTitle"
                name="title"
                ref={titleInputRef}
                type="text"
                placeholder="e.g., Premium Plan"
                value={form.title}
                onChange={handleInputChange}
                required
                disabled={saving}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="planPrice">
                Price (₹) *
              </label>
              <input
                id="planPrice"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={handleInputChange}
                required
                disabled={saving}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="planDays">
                Validity (Days) *
              </label>
              <input
                id="planDays"
                name="days"
                type="number"
                min="1"
                step="1"
                placeholder="30"
                value={form.days}
                onChange={handleInputChange}
                required
                disabled={saving}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="planDiscount">
                Discount (%)
              </label>
              <input
                id="planDiscount"
                name="discount"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="0"
                value={form.discount}
                onChange={handleInputChange}
                disabled={saving}
              />
            </div>
          </div>
          
          <div className="form-buttons">
            <button 
              type="submit" 
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : editingId ? 'Update Plan' : 'Add Plan'}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                disabled={saving}
                className="cancel-button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="subscription-plans-container">
        <div className="table-header">
          <h2>All Plans</h2>
        </div>
        
        {plans.length === 0 ? (
          <div className="no-plans-message">
            No subscription plans available. Add your first plan above.
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table" role="table" aria-label="Subscription Plans Table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price (₹)</th>
                  <th>Days</th>
                  <th>Discount (%)</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan._id} className={plan._id === editingId ? 'editing-row' : ''}>
                    <td>{plan.title}</td>
                    <td>₹{Number(plan.price).toFixed(2)}</td>
                    <td>{plan.days}</td>
                    <td>{plan.discount || 0}%</td>
                    <td className="actions-cell">
                      <div className="actions-container">
                        <button 
                          onClick={() => handleEdit(plan)} 
                          className="btn-edit"
                          aria-label={`Edit ${plan.title} plan`}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(plan._id)} 
                          className="btn-delete"
                          aria-label={`Delete ${plan.title} plan`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
