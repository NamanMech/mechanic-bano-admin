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
  const [pageSize, setPageSize] = useState(5);

  const [editingUserEmail, setEditingUserEmail] = useState(null);
  const [editingFormData, setEditingFormData] = useState({ name: '', email: '' });

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}user`);
      setUsers(response.data);
    } catch (error) {
      showErrorToast('Error fetching users');
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
        showSuccessToast('User deleted successfully');
        fetchUsers();
      } catch (error) {
        showErrorToast('Error deleting user');
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
        showSuccessToast('Subscription expired successfully');
        fetchUsers();
      } catch (error) {
        showErrorToast('Error expiring subscription');
      } finally {
        setProcessing(false);
      }
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
      showWarningToast('Name and Email are required');
      return;
    }
    setProcessing(true);
    try {
      await axios.put(
        `${API_URL}user?email=${originalEmail}&type=update`,
        editingFormData
      );
      showSuccessToast('User updated successfully');
      fetchUsers();
      handleCancelInlineEdit();
    } catch (error) {
      showErrorToast('Error updating user');
    } finally {
      setProcessing(false);
    }
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Filtering Logic with Date + Status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

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
      />

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
    </div>
  );
}
