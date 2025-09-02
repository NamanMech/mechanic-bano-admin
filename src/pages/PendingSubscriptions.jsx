import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { getApiUrl, handleApiError } from '../utils/api';
import { toast } from 'react-toastify';

export default function PendingSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(getApiUrl('pending-subscriptions'));
      
      if (response.data && response.data.success) {
        setSubscriptions(response.data.data || []);
      } else {
        toast.error('Unexpected response format from server');
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Error fetching subscriptions');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const approveSubscription = async (id) => {
    setUpdating(prev => ({ ...prev, [id]: 'approving' }));
    
    try {
      // First update the pending subscription status
      await axios.put(getApiUrl(`pending-subscriptions?id=${id}`), {
        status: 'approved'
      });
      
      // Then activate the subscription
      const subscription = subscriptions.find(sub => sub._id === id);
      await axios.post(getApiUrl('subscription?type=subscribe'), {
        email: subscription.email,
        planId: subscription.planId
      });
      
      // Refresh the list
      await fetchSubscriptions();
      
      toast.success('✅ Subscription approved successfully!');
    } catch (error) {
      const errorMessage = handleApiError(error, 'Error approving subscription');
      toast.error(errorMessage);
    } finally {
      setUpdating(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const rejectSubscription = async (id) => {
    setUpdating(prev => ({ ...prev, [id]: 'rejecting' }));
    
    try {
      await axios.put(getApiUrl(`pending-subscriptions?id=${id}`), {
        status: 'rejected'
      });
      
      // Refresh the list
      await fetchSubscriptions();
      
      toast.success('❌ Subscription rejected');
    } catch (error) {
      const errorMessage = handleApiError(error, 'Error rejecting subscription');
      toast.error(errorMessage);
    } finally {
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
      pending: 'status-badge status-pending',
      approved: 'status-badge status-approved', 
      rejected: 'status-badge status-rejected'
    };

    const statusText = {
      pending: '⏳ PENDING',
      approved: '✅ APPROVED', 
      rejected: '❌ REJECTED'
    };

    return (
      <span className={statusStyles[status] || statusStyles.pending}>
        {statusText[status] || status.toUpperCase()}
      </span>
    );
  };

  // Function to render action buttons based on status
  const renderActions = (sub) => {
    const isUpdating = updating[sub._id];
    
    if (isUpdating) {
      return (
        <div className="updating-indicator">
          <div className="spinner-small"></div>
          {isUpdating === 'approving' ? ' Approving...' : ' Rejecting...'}
        </div>
      );
    }

    switch (sub.status) {
      case 'pending':
        return (
          <div className="action-buttons">
            <button 
              onClick={() => approveSubscription(sub._id)}
              className="btn-success"
            >
              ✅ Approve
            </button>
            <button 
              onClick={() => rejectSubscription(sub._id)}
              className="btn-danger"
            >
              ❌ Reject
            </button>
          </div>
        );
      
      case 'approved':
        return (
          <div className="status-message approved">
            ✅ Approved Successfully
          </div>
        );
      
      case 'rejected':
        return (
          <div className="status-message rejected">
            <div>❌ Rejected</div>
            <button 
              onClick={() => approveSubscription(sub._id)}
              className="btn-success small"
            >
              ✅ Approve Now
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Payment Screenshot Management</h1>
        <button 
          onClick={fetchSubscriptions}
          className="btn-primary"
        >
          🔄 Refresh
        </button>
      </div>
      
      {subscriptions.length === 0 ? (
        <div className="empty-state">
          <h3>📷 No Screenshots Found</h3>
          <p>No payment screenshots available at the moment.</p>
        </div>
      ) : (
        <div className="table-container">
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
                <tr key={sub._id} className={`status-${sub.status}`}>
                  <td>
                    <strong>{sub.email}</strong>
                  </td>
                  <td>
                    <div className="plan-details">
                      <strong>Plan:</strong> {sub.planTitle || 'N/A'}<br/>
                      <strong>Price:</strong> ₹{sub.planPrice || 'N/A'}
                    </div>
                  </td>
                  <td>
                    {sub.screenshotUrl ? (
                      <div className="screenshot-container">
                        <a 
                          href={sub.screenshotUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="screenshot-link"
                        >
                          🖼️ View Screenshot
                        </a>
                      </div>
                    ) : (
                      <span className="no-screenshot">❌ Not Available</span>
                    )}
                  </td>
                  <td>
                    <div className="date-info">
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
        </div>
      )}
    </div>
  );
}
