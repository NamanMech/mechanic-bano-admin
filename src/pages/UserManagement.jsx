import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner.jsx';
import { toast } from 'react-toastify';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
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
        setMenuOpen(null);
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
        setMenuOpen(null);
      }
    }
  };

  const handleMenuToggle = (event, email) => {
    const rect = event.target.getBoundingClientRect();
    if (menuOpen === email) {
      setMenuOpen(null);
    } else {
      setMenuOpen(email);
      setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    }
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h2>All Users</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or email"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
                <td style={{ position: 'relative' }}>
                  <button
                    onClick={(e) => handleMenuToggle(e, user.email)}
                    className="btn-menu"
                    disabled={processing}
                  >
                    {menuOpen === user.email ? 'Close' : 'Menu'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {menuOpen && (
        <div
          className="dropdown-menu"
          style={{ position: 'absolute', top: menuPosition.top, left: menuPosition.left }}
          ref={menuRef}
        >
          <button
            onClick={() => handleDelete(menuOpen)}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Delete User'}
          </button>
          {users.find((u) => u.email === menuOpen)?.isSubscribed && (
            <button
              onClick={() => handleExpire(menuOpen)}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Expire Subscription'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
