import React from 'react';
import { showSuccessToast, showErrorToast, showWarningToast } from '../utils/toastUtils';

export default function UserForm({
  formData,
  setFormData,
  handleFormSubmit,
  isEditing,
  processing,
  setIsFormOpen
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      showWarningToast('Name and Email are required');
      return;
    }

    handleFormSubmit(e); // actual API call with toasts already handled in UserManagement
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Enter name"
        value={formData.name}
        onChange={handleChange}
        disabled={processing}
      />
      <input
        type="email"
        name="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
        disabled={processing}
      />
      <button type="submit" className="save-button" disabled={processing}>
        {isEditing ? 'Update' : 'Add'}
      </button>
      <button
        type="button"
        className="cancel-button"
        onClick={() => setIsFormOpen(false)}
        disabled={processing}
      >
        Cancel
      </button>
    </form>
  );
}
