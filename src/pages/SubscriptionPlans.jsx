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
    <div style={{ 
      maxWidth: 800, 
      margin: '0 auto', 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      color: 'white' // Ensure text is visible on dark background
    }}>
      <h2 style={{ 
        color: 'white', 
        marginBottom: '20px', 
        textAlign: 'center',
        fontSize: '2rem'
      }}>
        {editingId ? 'Edit Subscription Plan' : 'Subscription Plans Management'}
      </h2>
      
      <div style={{ 
        background: '#2c2c2c', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        border: '1px solid #444'
      }}>
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: '15px', 
          color: '#ffa726',
          fontSize: '1.5rem'
        }}>
          {editingId ? 'Edit Plan' : 'Add New Plan'}
        </h3>
        
        <form onSubmit={handleSubmit} aria-label={editingId ? "Edit Plan Form" : "Add Plan Form"}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px' 
          }}>
            <div>
              <label htmlFor="planTitle" style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: 'white'
              }}>
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
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #555', 
                  borderRadius: '4px',
                  backgroundColor: '#1e1e1e',
                  color: 'white'
                }}
              />
            </div>
            
            <div>
              <label htmlFor="planPrice" style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: 'white'
              }}>
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
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #555', 
                  borderRadius: '4px',
                  backgroundColor: '#1e1e1e',
                  color: 'white'
                }}
              />
            </div>
            
            <div>
              <label htmlFor="planDays" style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: 'white'
              }}>
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
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #555', 
                  borderRadius: '4px',
                  backgroundColor: '#1e1e1e',
                  color: 'white'
                }}
              />
            </div>
            
            <div>
              <label htmlFor="planDiscount" style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: 'white'
              }}>
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
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #555', 
                  borderRadius: '4px',
                  backgroundColor: '#1e1e1e',
                  color: 'white'
                }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button 
              type="submit" 
              disabled={saving}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#1e88e5', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1
              }}
            >
              {saving ? 'Saving...' : editingId ? 'Update Plan' : 'Add Plan'}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                disabled={saving}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
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
      </div>
      
      <div style={{ 
        background: '#2c2c2c', 
        borderRadius: '8px', 
        overflow: 'hidden', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        border: '1px solid #444'
      }}>
        <div style={{ 
          padding: '15px 20px', 
          backgroundColor: '#343a40', 
          color: 'white',
          borderBottom: '1px solid #444'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.5rem' }}>All Plans</h3>
        </div>
        
        {plans.length === 0 ? (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: '#aaa' 
          }}>
            No subscription plans available. Add your first plan above.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              color: 'white'
            }} 
            role="table" 
            aria-label="Subscription Plans Table">
              <thead>
                <tr style={{ backgroundColor: '#343a40' }}>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #444',
                    color: 'white'
                  }}>Title</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #444',
                    color: 'white'
                  }}>Price (₹)</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #444',
                    color: 'white'
                  }}>Days</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #444',
                    color: 'white'
                  }}>Discount (%)</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    borderBottom: '2px solid #444',
                    color: 'white'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan._id} style={{ 
                    borderBottom: '1px solid #444',
                    backgroundColor: plan._id === editingId ? '#3d3d3d' : 'transparent'
                  }}>
                    <td style={{ padding: '12px' }}>{plan.title}</td>
                    <td style={{ padding: '12px' }}>₹{Number(plan.price).toFixed(2)}</td>
                    <td style={{ padding: '12px' }}>{plan.days}</td>
                    <td style={{ padding: '12px' }}>{plan.discount || 0}%</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleEdit(plan)} 
                          style={{ 
                            padding: '6px 12px', 
                            backgroundColor: '#28a745', 
                            color: 'white', 
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
