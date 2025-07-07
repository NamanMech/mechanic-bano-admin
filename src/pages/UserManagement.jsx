import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner.jsx';
import { toast } from 'react-toastify';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

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
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (editingUser) {
        // Update user
        await axios.put(`${API_URL}user?email=${editingUser.email}`, formData);
        toast.success('User updated successfully');
      } else {
        // Add user
        await axios.post(`${API_URL}user`, formData);
        toast.success('User added successfully');
      }
      fetchUsers();
      setIsFormOpen(false);
      setEditingUser(null);
      setFormData({ name: '', email: '' });
    } catch (error) {
      toast.error('Error saving user');
    } finally {
      setProcessing(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email });
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '' });
    setIsFormOpen(true);
  };

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h2>All Users</h2>
      <button onClick={handleAddClick} className="btn-primary" style={{ marginBottom: '20px' }}>
        Add User
      </button>

      {isFormOpen && (
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={editingUser !== null} // Email should not change while updating
          />
          <button type="submit" disabled={processing}>
            {processing ? 'Saving...' : editingUser ? 'Update User' : 'Add User'}
          </button>
          <button type="button" onClick={() => setIsFormOpen(false)} className="cancel-button">
            Cancel
          </button>
        </form>
      )}

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
                    onClick={() => handleEditClick(user)}
                    className="btn-edit"
                    style={{ marginRight: '5px' }}
                    disabled={processing}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.email)}
                    className="btn-delete"
                    style={{ marginRight: '5px' }}
                    disabled={processing}
                  >
                    Delete
                  </button>
                  {user.isSubscribed && (
                    <button
                      onClick={() => handleExpire(user.email)}
                      className="btn-edit"
                      disabled={processing}
                    >
                      Expire
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
