import React from 'react';

export default function UserForm({ formData, setFormData, handleFormSubmit, isEditing, processing, setIsFormOpen }) {
  return (
    <form onSubmit={handleFormSubmit} className="user-form">
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        disabled={isEditing}
      />
      <button type="submit" disabled={processing}>
        {processing ? 'Saving...' : isEditing ? 'Update User' : 'Add User'}
      </button>
      <button type="button" onClick={() => setIsFormOpen(false)} className="cancel-button" disabled={processing}>
        Cancel
      </button>
    </form>
  );
}
