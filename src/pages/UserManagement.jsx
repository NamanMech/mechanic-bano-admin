import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner.jsx';
import { toast } from 'react-toastify';
import UserForm from '../components/UserForm.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Pagination from '../components/Pagination.jsx';
import UserTable from '../components/UserTable.jsx';
import AuditTimeline from '../components/AuditTimeline.jsx';
import UserStats from '../components/UserStats.jsx';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [editingUserEmail, setEditingUserEmail] = useState(null);
  const [editingFormData, setEditingFormData] = useState({ name: '', email: '' });

  const [auditLogs, setAuditLogs] = useState([]);

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

  const isDuplicateEmail = (email) => {
    return users.some((user) => user.email === email);
  };

  const logAction = (action, email) => {
    const timestamp = new Date().toLocaleString();
    setAuditLogs((prev) => [{ action, email, timestamp }, ...prev]);
  };

  const handleDelete = async (email) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setProcessing(true);
      try {
        await axios.delete(`${API_URL}user?email=${email}`);
        toast.success('User deleted successfully');
        logAction('Deleted User', email);
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
        logAction('Expired Subscription', email);
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
    if (!formData.name || !formData.email) {
      toast.error('Please fill all fields');
      return;
    }

    if (!formData._id && isDuplicateEmail(formData.email)) {
      toast.error('Email already exists');
      return;
    }

    setProcessing(true);
    try {
      if (formData._id) {
        await axios.put(`${API_URL}user?email=${formData.email}&type=update`, formData);
        toast.success('User updated successfully');
        logAction('Updated User', formData.email);
      } else {
        await axios.post(`${API_URL}user`, formData);
        toast.success('User added successfully');
        logAction('Added User', formData.email);
      }
      fetchUsers();
      setIsFormOpen(false);
      setFormData({ name: '', email: '' });
    } catch (error) {
      toast.error('Error saving user');
    } finally {
      setProcessing(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUserEmail(user.email);
    setEditingFormData({ name: user.name, email: user.email });
  };

  const handleCancelInlineEdit = () => {
    setEditingUserEmail(null);
    setEditingFormData({ name: '', email: '' });
  };

  const handleSaveInlineEdit = async (originalEmail) => {
    if (!editingFormData.name || !editingFormData.email) {
      toast.error('Please fill all fields');
      return;
    }

    if (
      editingFormData.email !== originalEmail &&
      isDuplicateEmail(editingFormData.email)
    ) {
      toast.error('Email already exists');
      return;
    }

    setProcessing(true);
    try {
      await axios.put(`${API_URL}user?email=${originalEmail}&type=update`, editingFormData);
      toast.success('User updated successfully');
      logAction('Inline Edit', editingFormData.email);
      fetchUsers();
      handleCancelInlineEdit();
    } catch (error) {
      toast.error('Error updating user');
    } finally {
      setProcessing(false);
    }
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOrder === 'asc') return a.name.localeCompare(b.name);
    else return b.name.localeCompare(a.name);
  });

  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const displayedUsers = sortedUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h2>All Users</h2>

      <button onClick={() => setIsFormOpen(true)} className="btn-primary" style={{ marginBottom: '20px' }}>
        Add User
      </button>

      <UserStats users={users} />

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSortToggle={handleSortToggle}
        sortOrder={sortOrder}
      />

      {isFormOpen && (
        <UserForm
          formData={formData}
          setFormData={setFormData}
          handleFormSubmit={handleFormSubmit}
          isEditing={formData._id !== undefined}
          processing={processing}
          setIsFormOpen={setIsFormOpen}
        />
      )}

      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <>
          <UserTable
            users={displayedUsers}
            processing={processing}
            handleEditClick={handleEditClick}
            handleSaveInlineEdit={handleSaveInlineEdit}
            handleCancelInlineEdit={handleCancelInlineEdit}
            handleDelete={handleDelete}
            handleExpire={handleExpire}
            editingUserEmail={editingUserEmail}
            editingFormData={editingFormData}
            setEditingFormData={setEditingFormData}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </>
      )}

      <AuditTimeline logs={auditLogs} />
    </div>
  );
}
