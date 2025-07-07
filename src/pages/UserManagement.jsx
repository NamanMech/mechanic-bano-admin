import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner.jsx';
import UserTable from '../components/UserTable.jsx';
import UserForm from '../components/UserForm.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Pagination from '../components/Pagination.jsx';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

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
        await axios.put(`${API_URL}user?email=${editingUser.email}&type=update`, formData);
        toast.success('User updated successfully');
      } else {
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

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h2>All Users</h2>
      <button onClick={handleAddClick} className="btn-primary" style={{ marginBottom: '20px' }}>
        Add User
      </button>

      {isFormOpen && (
        <UserForm
          formData={formData}
          setFormData={setFormData}
          handleFormSubmit={handleFormSubmit}
          isEditing={editingUser !== null}
          onCancel={() => setIsFormOpen(false)}
          processing={processing}
        />
      )}

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <UserTable
        users={paginatedUsers}
        processing={processing}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onExpire={handleExpire}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
