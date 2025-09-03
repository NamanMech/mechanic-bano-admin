import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { getApiUrl, handleApiError } from '../utils/api';
import { toast } from 'react-toastify';
import '../styles/pages/pending-subscriptions.css';

export default function PendingSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(getApiUrl('pending-subscriptions'));
      if (response.data && response.data.success) {
        setSubscriptions(response.data.data || []);
      } else {
        toast.error('Unexpected response format from server');
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Error fetching subscriptions'));
    } finally {
      setLoading(false);
    }
  };

  // UPDATED APPROVE FUNCTION
  const approveSubscription = async (id) => {
    setUpdating(prev => ({ ...prev, [id]: true }));
    try {
      await axios.put(getApiUrl(`pending-subscriptions?id=${id}`), { status: 'approved' });
      const subscription = subscriptions.find(sub => sub._id === id);
      if (subscription) {
        // Updated to call /api/approve
        await axios.post(getApiUrl('approve'), {
          email: subscription.email,
          planId: subscription.planId,
        });
      }
      toast.success('✅ Subscription approved successfully!');
      await fetchSubscriptions();
    } catch (error) {
      toast.error(handleApiError(error, 'Error approving subscription'));
      console.error(error);
    } finally {
      setUpdating(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const rejectSubscription = async (id) => {
    setUpdating(prev => ({ ...prev, [id]: true }));
    try {
      await axios.put(getApiUrl(`pending-subscriptions?id=${id}`), { status: 'rejected' });
      toast.success('❌ Subscription rejected');
      await fetchSubscriptions();
    } catch (error) {
      toast.error(handleApiError(error, 'Error rejecting subscription'));
      console.error(error);
    } finally {
      setUpdating(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const renderStatus = (status) => {
    const statusStyles = {
      pending: 'status-badge status-pending',
      approved: 'status-badge status-approved',
      rejected: 'status-badge status-rejected',
    };
    const statusText = {
      pending: '⏳ PENDING',
      approved: '✅ APPROVED',
      rejected: '❌ REJECTED',
    };
    return <span className={statusStyles[status] || statusStyles.pending}>{statusText[status] || status.toUpperCase()}</span>;
  };

  const renderActions = (sub) => {
    const isUpdating = updating[sub._id];
    if (isUpdating) {
      return (
        <div className="updating-indicator">
          <div className="spinner-small"></div>
          Updating...
        </div>
      );
    }
    switch (sub.status) {
      case 'pending':
        return (
          <div className="action-buttons">
            <button onClick={() => approveSubscription(sub._id)} className="btn-success" disabled={!!isUpdating}>
              ✅ Approve
            </button>
            <button onClick={() => rejectSubscription(sub._id)} className="btn-danger" disabled={!!isUpdating}>
              ❌ Reject
            </button>
          </div>
        );
      case 'approved':
        return <div className="status-message approved">✅ Approved Successfully</div>;
      case 'rejected':
        return (
          <div className="status-message rejected">
            <div>❌ Rejected</div>
            <button onClick={() => approveSubscription(sub._id)} className="btn-success small" disabled={!!isUpdating}>
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
        <button onClick={fetchSubscriptions} className="btn-primary" disabled={loading}>
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
                      <strong>Plan:</strong> {sub.planTitle || 'N/A'}
                      <br />
                      <strong>Price:</strong> ₹{sub.planPrice || 'N/A'}
                    </div>
                  </td>
                  <td>
                    {sub.screenshotUrl ? (
                      <div className="screenshot-container">
                        <a href={sub.screenshotUrl} target="_blank" rel="noopener noreferrer" className="screenshot-link">
                          🖼️ View Screenshot
                        </a>
                      </div>
                    ) : (
                      <span className="no-screenshot">❌ Not Available</span>
                    )}
                  </td>
                  <td>
                    <div className="date-info">
                      <strong>Date:</strong> {new Date(sub.createdAt).toLocaleDateString('en-IN')}
                      <br />
                      <strong>Time:</strong> {new Date(sub.createdAt).toLocaleTimeString('en-IN')}
                    </div>
                  </td>
                  <td>{renderStatus(sub.status)}</td>
                  <td>{renderActions(sub)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
