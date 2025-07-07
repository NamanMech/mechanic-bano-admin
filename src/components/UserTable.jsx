import React from 'react';
import DropdownMenu from './DropdownMenu.jsx';

export default function UserTable({ users, processing, onEdit, onDelete, onExpire }) {
  return (
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
              <DropdownMenu
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
                onExpire={onExpire}
                processing={processing}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
