import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Pagination from '../components/Pagination.jsx';
import UserTable from '../components/UserTable.jsx';
import UserStats from '../components/UserStats.jsx';
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from '../utils/toastUtils';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingUserEmail, setEditingUserEmail] = useState(null);
  const [editingFormData, setEditingFormData] = useState({ name: '', email: '' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  const getBaseUrl = () => (API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterStartDate, filterEndDate, pageSize]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${getBaseUrl()}/user`);
      setUsers(response.data || []);
    } catch (error) {
      showErrorToast('Error fetching users');
      console.error('Fetch users error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setProcessing(true);
    try {
      await axios.delete(`${getBaseUrl()}/user?email=${encodeURIComponent(email)}`);
      showSuccessToast('User deleted successfully');
      await fetchUsers();
    } catch (error) {
      showErrorToast('Error deleting user');
      console.error('Delete user error:', error.response?.data || error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleExpire = async (email) => {
    if (!window.confirm('Are you sure you want to expire this subscription?')) return;
    setProcessing(true);
    try {
      await axios.put(`${getBaseUrl()}/subscription?type=expire&email=${encodeURIComponent(email)}`);
      showSuccessToast('Subscription expired successfully');
      await fetchUsers();
    } catch (error) {
      showErrorToast('Error expiring subscription');
      console.error('Expire subscription error:', error.response?.data || error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUserEmail(user.email);
    setEditingFormData({ name: user.name || '', email: user.email || '' });
  };

  const handleCancelInlineEdit = () => {
    setEditingUserEmail(null);
    setEditingFormData({ name: '', email: '' });
  };

  const handleSaveInlineEdit = async (originalEmail) => {
    if (!editingFormData.name.trim() || !editingFormData.email.trim()) {
      showWarningToast('Name and Email are required');
      return;
    }
    setProcessing(true);
    try {
      await axios.put(
        `${getBaseUrl()}/user?email=${encodeURIComponent(originalEmail)}&type=update`,
        editingFormData
      );
      showSuccessToast('User updated successfully');
      await fetchUsers();
      handleCancelInlineEdit();
    } catch (error) {
      showErrorToast('Error updating user');
      console.error('Update user error:', error.response?.data || error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Filter users based on search, status and date filters
  const filteredUsers = users.filter((user) => {
    if (!user) return false;
    const name = user.name || '';
    const email = user.email || '';
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'subscribed' && user.isSubscribed) ||
      (filterStatus === 'expired' && !user.isSubscribed);
    const subscriptionEnd = user.subscriptionEnd ? new Date(user.subscriptionEnd) : null;
    const matchesDate =
      (!filterStartDate && !filterEndDate) ||
      (subscriptionEnd &&
        (!filterStartDate || subscriptionEnd >= new Date(filterStartDate)) &&
        (!filterEndDate || subscriptionEnd <= new Date(filterEndDate)));
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort filtered users by name
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const nameA = a?.name || '';
    const nameB = b?.name || '';
    return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const displayedUsers = sortedUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading)
    return (
      <div className="spinner-container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <Spinner message="Loading users..." />
      </div>
    );
  if (!users.length)
    return (
      <p className="text-center" style={{ marginTop: 20 }}>
        No users found.
      </p>
    );

  return (
    <div className="user-management" style={{ maxWidth: 1000, margin: '0 auto', padding: '1rem' }}>
      <UserStats users={users} />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSortToggle={handleSortToggle}
        sortOrder={sortOrder}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterStartDate={filterStartDate}
        setFilterStartDate={setFilterStartDate}
        filterEndDate={filterEndDate}
        setFilterEndDate={setFilterEndDate}
        clearFilters={() => {
          setSearchQuery('');
          setFilterStatus('all');
          setFilterStartDate('');
          setFilterEndDate('');
        }}
      />
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
        totalItems={sortedUsers.length}
      />
    </div>
  );
}
