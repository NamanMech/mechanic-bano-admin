import React from 'react';
import { showWarningToast } from '../utils/toastUtils';

export default function UserForm({
  formData,
  setFormData,
  handleFormSubmit,
  isEditing,
  processing,
  setIsFormOpen,
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
    <div
      className="form-modal-overlay"
      onClick={() => !processing && setIsFormOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="userFormTitle"
      tabIndex={-1}
    >
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2 id="userFormTitle">{isEditing ? 'Edit User' : 'Add New User'}</h2>
          <button
            className="close-button"
            onClick={() => setIsFormOpen(false)}
            disabled={processing}
            aria-label="Close form"
            type="button"
          >
            &times;
          </button>
        </div>
        <form onSubmit={onSubmit} aria-label={isEditing ? 'Edit User Form' : 'Add User Form'}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              disabled={processing}
              aria-required="true"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              disabled={processing}
              aria-required="true"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button" disabled={processing}>
              {processing ? (
                <span className="button-loading">
                  <span className="spinner-small" aria-hidden="true"></span>
                  {isEditing ? 'Updating...' : 'Adding...'}
                </span>
              ) : (
                <span>{isEditing ? 'Update User' : 'Add User'}</span>
              )}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setIsFormOpen(false)}
              disabled={processing}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
