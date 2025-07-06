import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner.jsx';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://mechanic-bano-backend.vercel.app/api/users');
      setUsers(response.data);
    } catch (error) {
      alert('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (email) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`https://mechanic-bano-backend.vercel.app/api/users?email=${email}`);
        alert('User deleted successfully');
        fetchUsers();
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  const handleExpire = async (email) => {
    if (confirm('Are you sure you want to expire this subscription?')) {
      try {
        await axios.put(`https://mechanic-bano-backend.vercel.app/api/expireSubscription?email=${email}`);
        alert('Subscription expired successfully');
        fetchUsers();
      } catch (error) {
        alert('Error expiring subscription');
      }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subscription Status</th>
              <th>Subscription End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isSubscribed ? 'Active' : 'Inactive'}</td>
                <td>{user.subscriptionEnd ? new Date(user.subscriptionEnd).toLocaleDateString() : '-'}</td>
                <td>
                  <button onClick={() => handleDelete(user.email)} className="btn-delete" style={{ marginRight: '5px' }}>
                    Delete
                  </button>
                  {user.isSubscribed && (
                    <button onClick={() => handleExpire(user.email)} className="btn-edit">
                      Expire Subscription
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
