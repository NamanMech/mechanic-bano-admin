// src/pages/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner.jsx';
import { toast } from 'react-toastify';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [menuUser, setMenuUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}user`);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [users, searchTerm]);

  const handleSearch = (term) => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleSort = () => {
    const sorted = [...filteredUsers].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === 'asc') return nameA > nameB ? 1 : -1;
      else return nameA < nameB ? 1 : -1;
    });
    setFilteredUsers(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

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

  const toggleMenu = (email) => {
    setMenuUser(menuUser === email ? null : email);
  };

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h2>All Users</h2>

      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', marginBottom: '10px', flex: '1 1 200px', marginRight: '10px' }}
        />

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={handleSort} className="btn-primary">Sort ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})</button>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{ padding: '8px', borderRadius: '4px' }}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      </div>

      {paginatedUsers.length === 0 ? (
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
            {paginatedUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isSubscribed ? 'Active' : 'Inactive'}</td>
                <td>{user.subscriptionEnd ? new Date(user.subscriptionEnd).toLocaleDateString() : '-'}</td>
                <td style={{ position: 'relative' }}>
                  <button
                    onClick={() => toggleMenu(user.email)}
                    className="btn-menu"
                    disabled={processing}
                  >
                    ☰ Menu
                  </button>

                  {menuUser === user.email && (
                    <div
                      className="dropdown-menu"
                      style={{ top: '30px', right: '0' }}
                    >
                      <button onClick={() => handleDelete(user.email)} disabled={processing}>
                        {processing ? 'Processing...' : 'Delete'}
                      </button>
                      {user.isSubscribed && (
                        <button onClick={() => handleExpire(user.email)} disabled={processing}>
                          {processing ? 'Processing...' : 'Expire Subscription'}
                        </button>
                      )}
                      <button onClick={() => setMenuUser(null)}>Close</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="btn-primary"
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <span style={{ padding: '10px 20px' }}>Page {currentPage} of {totalPages}</span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="btn-primary"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
