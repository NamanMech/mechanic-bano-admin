import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';

export default function PendingSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
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
      
      alert('Subscription approved successfully!');
      fetchSubscriptions();
    } catch (error) {
      console.error('Error approving subscription:', error);
      alert('Error approving subscription');
    }
  };

  const rejectSubscription = async (id) => {
    try {
      await axios.put(`${API_URL}pending-subscriptions?id=${id}`, {
        status: 'rejected'
      });
      alert('Subscription rejected');
      fetchSubscriptions();
    } catch (error) {
      console.error('Error rejecting subscription:', error);
      alert('Error rejecting subscription');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h1>Pending Subscriptions</h1>
      
      {subscriptions.length === 0 ? (
        <p>No pending subscriptions</p>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Plan ID</th>
              <th>Screenshot</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub._id}>
                <td>{sub.email}</td>
                <td>{sub.planId}</td>
                <td>
                  <a href={sub.screenshotUrl} target="_blank" rel="noopener noreferrer">
                    View Screenshot
                  </a>
                </td>
                <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => approveSubscription(sub._id)}
                    className="btn-success"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => rejectSubscription(sub._id)}
                    className="btn-danger"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
