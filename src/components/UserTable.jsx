import React from 'react';

export default function UserTable({ users, onEdit, onDelete, onExpire, processing }) {
  return (
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
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isSubscribed ? 'Active' : 'Inactive'}</td>
              <td>{user.subscriptionEnd ? new Date(user.subscriptionEnd).toLocaleDateString() : '-'}</td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => onEdit(user)} className="btn-edit" disabled={processing}>
                    Edit
                  </button>
                  <button onClick={() => onDelete(user.email)} className="btn-delete" disabled={processing}>
                    Delete
                  </button>
                  {user.isSubscribed && (
                    <button onClick={() => onExpire(user.email)} className="btn-edit" disabled={processing}>
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
  );
}
