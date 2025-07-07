import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner.jsx';
import { toast } from 'react-toastify';
import UserForm from '../components/UserForm.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Pagination from '../components/Pagination.jsx';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
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

  const handleAddClick = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
    setCurrentPage(1);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const filteredUsers = users
    .filter((user) => user.name.toLowerCase().includes(searchQuery) || user.email.toLowerCase().includes(searchQuery))
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const displayedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h2>All Users</h2>
      <button onClick={handleAddClick} className="btn-primary" style={{ marginBottom: '20px' }}>
        Add User
      </button>

      {isFormOpen && (
        <UserForm
          user={editingUser}
          fetchUsers={fetchUsers}
          setIsFormOpen={setIsFormOpen}
          setEditingUser={setEditingUser}
        />
      )}

      <SearchBar searchQuery={searchQuery} onSearch={handleSearch} onSort={handleSort} sortOrder={sortOrder} />

      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
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
              {displayedUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isSubscribed ? 'Active' : 'Inactive'}</td>
                  <td>{user.subscriptionEnd ? new Date(user.subscriptionEnd).toLocaleDateString() : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEditClick(user)} className="btn-edit" disabled={processing}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(user.email)} className="btn-delete" disabled={processing}>
                        Delete
                      </button>
                      {user.isSubscribed && (
                        <button onClick={() => handleExpire(user.email)} className="btn-edit" disabled={processing}>
                          Expire
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
