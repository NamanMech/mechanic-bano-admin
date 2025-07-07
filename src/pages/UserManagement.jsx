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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

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
    let top = rect.bottom + window.scrollY + 5;
    let left = rect.left + window.scrollX;

    const menuWidth = 160;
    if (left + menuWidth > window.innerWidth) {
      left = window.innerWidth - menuWidth - 10;
    }

    setMenuOpen((prev) => (prev === email ? null : email));
    setMenuPosition({ top, left });
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

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === 'isSubscribed') {
      aValue = aValue ? 1 : 0;
      bValue = bValue ? 1 : 0;
    } else {
      aValue = aValue?.toString().toLowerCase();
      bValue = bValue?.toString().toLowerCase();
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Calculation
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h2>All Users</h2>

      <div className="search-bar" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%',
            maxWidth: '400px',
          }}
        />
      </div>

      {currentUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <>
          <table className="custom-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                  Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
                </th>
                <th onClick={() => requestSort('email')} style={{ cursor: 'pointer' }}>
                  Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
                </th>
                <th onClick={() => requestSort('isSubscribed')} style={{ cursor: 'pointer' }}>
                  Subscription Status {sortConfig.key === 'isSubscribed' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
                </th>
                <th>Subscription End</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
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

          <div className="pagination" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button onClick={goToPrevPage} disabled={currentPage === 1} className="btn-primary">
              Previous
            </button>

            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num + 1}
                onClick={() => goToPage(num + 1)}
                className={`btn-primary ${currentPage === num + 1 ? 'active-page' : ''}`}
              >
                {num + 1}
              </button>
            ))}

            <button onClick={goToNextPage} disabled={currentPage === totalPages} className="btn-primary">
              Next
            </button>
          </div>
        </>
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
