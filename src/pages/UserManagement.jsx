import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner.jsx';
import { toast } from 'react-toastify';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}user`);
      setUsers(response.data);
    } catch (error) {
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (email) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setProcessing(true);
      try {
        await axios.delete(`${API_URL}user?email=${email}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Error deleting user');
      } finally {
        setProcessing(false);
        setSelectedUserId(null);
      }
    }
  };

  const handleExpire = async (email) => {
    if (confirm('Are you sure you want to expire this subscription?')) {
      setProcessing(true);
      try {
        await axios.put(`${API_URL}subscription?type=expire&email=${email}`);
        toast.success('Subscription expired successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Error expiring subscription');
      } finally {
        setProcessing(false);
        setSelectedUserId(null);
      }
    }
  };

  const handleMenuClick = (userId, event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 160; // approx menu width
    const menuHeight = 100; // approx menu height

    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY;

    // Check if menu overflows the screen width
    if (left + menuWidth > window.innerWidth) {
      left = window.innerWidth - menuWidth - 10; // 10px padding from right
    }

    // Check if menu overflows the screen height
    if (top + menuHeight > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - menuHeight; // Show menu above the button
    }

    setMenuPosition({ top, left });
    setSelectedUserId(userId);
  };

  useEffect(() => {
    const handleClickOutside = () => setSelectedUserId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
                  <button
                    className="btn-menu"
                    onClick={(event) => handleMenuClick(user._id, event)}
                    disabled={processing}
                  >
                    Menu
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedUserId && (
        <div
          className="dropdown-menu"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            position: 'absolute'
          }}
        >
          <button onClick={() => handleDelete(selectedUserId)} disabled={processing}>
            {processing ? 'Processing...' : 'Delete'}
          </button>
          <button onClick={() => handleExpire(selectedUserId)} disabled={processing}>
            {processing ? 'Processing...' : 'Expire Subscription'}
          </button>
        </div>
      )}
    </div>
  );
}
