import React from 'react';
import DropdownMenu from './DropdownMenu.jsx';

export default function UserTable({
  users,
  processing,
  handleEditClick,
  handleDelete,
  handleExpire
}) {
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subscription</th>
            <th>Subscription End</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.isSubscribed ? (
                  <span className="status-icon active">✔️</span>
                ) : (
                  <span className="status-icon inactive">❌</span>
                )}
              </td>
              <td>
                {user.subscriptionEnd
                  ? new Date(user.subscriptionEnd).toLocaleDateString()
                  : '-'}
              </td>
              <td>
                <DropdownMenu
                  user={user}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                  onExpire={handleExpire}
                  processing={processing}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
