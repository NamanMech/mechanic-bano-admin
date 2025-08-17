import React from 'react';
import { showWarningToast } from '../utils/toastUtils';

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
    // Trim leading spaces on input change but allow spaces inside string
    setFormData((prev) => ({ ...prev, [name]: value.replace(/^\s+/, '') }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName || !trimmedEmail) {
      showWarningToast('Name and Email are required');
      return;
    }
    // Pass trimmed values to handler
    handleFormSubmit({ ...formData, name: trimmedName, email: trimmedEmail });
  };

  return (
    <form onSubmit={onSubmit} aria-label={isEditing ? "Edit User Form" : "Add User Form"}>
      <input
        type="text"
        name="name"
        placeholder="Enter name"
        value={formData.name}
        onChange={handleChange}
        disabled={processing}
        aria-label="Name"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
        disabled={processing}
        aria-label="Email"
        required
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
