import React from 'react';

export default function UserForm({ formData, setFormData, onSubmit, onCancel, processing, editingUser }) {
  return (
    <form onSubmit={onSubmit}>
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
        disabled={editingUser !== null}
      />
      <button type="submit" disabled={processing}>
        {processing ? 'Saving...' : editingUser ? 'Update User' : 'Add User'}
      </button>
      <button type="button" onClick={onCancel} className="cancel-button" disabled={processing}>
        Cancel
      </button>
    </form>
  );
}
