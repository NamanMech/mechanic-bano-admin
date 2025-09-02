import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';

export default function PendingSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({}); // Track which items are being updated
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(`${API_URL}pending-subscriptions`);
      setSubscriptions(response.data.data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveSubscription = async (id) => {
    // Set updating state
    setUpdating(prev => ({ ...prev, [id]: 'approving' }));
    
    try {
      // First update the pending subscription status
      await axios.put(`${API_URL}pending-subscriptions?id=${id}`, {
        status: 'approved'
      });
      
      // Then activate the subscription
      const subscription = subscriptions.find(sub => sub._id === id);
      await axios.post(`${API_URL}subscription?type=subscribe`, {
        email: subscription.email,
        planId: subscription.planId
      });
      
      // Update local state immediately
      setSubscriptions(prev => 
        prev.map(sub => 
          sub._id === id 
            ? { ...sub, status: 'approved' } 
            : sub
        )
      );
      
      alert('✅ Subscription approved successfully!');
    } catch (error) {
      console.error('Error approving subscription:', error);
      alert('❌ Error approving subscription');
    } finally {
      // Remove updating state
      setUpdating(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const rejectSubscription = async (id) => {
    // Set updating state
    setUpdating(prev => ({ ...prev, [id]: 'rejecting' }));
    
    try {
      await axios.put(`${API_URL}pending-subscriptions?id=${id}`, {
        status: 'rejected'
      });
      
      // Update local state immediately
      setSubscriptions(prev => 
        prev.map(sub => 
          sub._id === id 
            ? { ...sub, status: 'rejected' } 
            : sub
        )
      );
      
      alert('❌ Subscription rejected');
    } catch (error) {
      console.error('Error rejecting subscription:', error);
      alert('❌ Error rejecting subscription');
    } finally {
      // Remove updating state
      setUpdating(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  // Function to render status badge
  const renderStatus = (status) => {
    const statusStyles = {
      pending: { backgroundColor: '#ff9800', color: 'white', padding: '4px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' },
      approved: { backgroundColor: '#4caf50', color: 'white', padding: '4px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' },
      rejected: { backgroundColor: '#f44336', color: 'white', padding: '4px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }
    };

    const statusText = {
      pending: '⏳ PENDING',
      approved: '✅ APPROVED', 
      rejected: '❌ REJECTED'
    };

    return (
      <span style={statusStyles[status] || statusStyles.pending}>
        {statusText[status] || status.toUpperCase()}
      </span>
    );
  };

  // Function to render action buttons based on status
  const renderActions = (sub) => {
    const isUpdating = updating[sub._id];
    
    if (isUpdating) {
      return (
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</div>
          {isUpdating === 'approving' ? ' Approving...' : ' Rejecting...'}
        </div>
      );
    }

    switch (sub.status) {
      case 'pending':
        return (
          <>
            <button 
              onClick={() => approveSubscription(sub._id)}
              className="btn-success"
              style={{ marginRight: '10px' }}
            >
              ✅ Approve
            </button>
            <button 
              onClick={() => rejectSubscription(sub._id)}
              className="btn-danger"
            >
              ❌ Reject
            </button>
          </>
        );
      
      case 'approved':
        return (
          <div style={{ color: '#4caf50', fontWeight: 'bold', textAlign: 'center' }}>
            ✅ Approved Successfully
          </div>
        );
      
      case 'rejected':
        return (
          <>
            <div style={{ color: '#f44336', fontWeight: 'bold', marginBottom: '5px' }}>
              ❌ Rejected
            </div>
            <button 
              onClick={() => approveSubscription(sub._id)}
              className="btn-success"
              style={{ fontSize: '12px', padding: '4px 8px' }}
            >
              ✅ Approve Now
            </button>
          </>
        );
      
      default:
        return null;
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Payment Screenshot Management</h1>
        <button 
          onClick={fetchSubscriptions}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#2196f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer' 
          }}
        >
          🔄 Refresh
        </button>
      </div>
      
      {subscriptions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h3>📷 No Screenshots Found</h3>
          <p>No payment screenshots available at the moment.</p>
        </div>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Plan Details</th>
              <th>Screenshot</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub._id} style={{ 
                backgroundColor: sub.status === 'approved' ? '#f8fff8' : sub.status === 'rejected' ? '#fff8f8' : 'white' 
              }}>
                <td>
                  <strong>{sub.email}</strong>
                </td>
                <td>
                  <div>
                    <strong>Plan:</strong> {sub.planTitle || 'N/A'}<br/>
                    <strong>Price:</strong> ₹{sub.planPrice || 'N/A'}
                  </div>
                </td>
                <td>
                  {sub.screenshotUrl ? (
                    <div style={{ textAlign: 'center' }}>
                      <a 
                        href={sub.screenshotUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          display: 'inline-block',
                          padding: '8px 15px',
                          backgroundColor: '#2196f3',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      >
                        🖼️ View Screenshot
                      </a>
                    </div>
                  ) : (
                    <span style={{ color: 'red' }}>❌ Not Available</span>
                  )}
                </td>
                <td>
                  <div>
                    <strong>Date:</strong> {new Date(sub.createdAt).toLocaleDateString('en-IN')}<br/>
                    <strong>Time:</strong> {new Date(sub.createdAt).toLocaleTimeString('en-IN')}
                  </div>
                </td>
                <td>
                  {renderStatus(sub.status)}
                </td>
                <td>
                  {renderActions(sub)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {/* Add CSS for spin animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .custom-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .custom-table th {
          background: #f5f5f5;
          padding: 15px;
          text-align: left;
          font-weight: bold;
          border-bottom: 2px solid #ddd;
        }
        
        .custom-table td {
          padding: 15px;
          border-bottom: 1px solid #eee;
          vertical-align: top;
        }
        
        .custom-table tr:hover {
          background: #f9f9f9;
        }
        
        .btn-success {
          background: #4caf50;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .btn-success:hover {
          background: #45a049;
        }
        
        .btn-danger {
          background: #f44336;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .btn-danger:hover {
          background: #da190b;
        }
      `}</style>
    </div>
  );
}
