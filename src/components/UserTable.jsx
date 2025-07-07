import React from 'react';

export default function UserTable({
  users,
  processing,
  handleEditClick,
  handleDelete,
  handleExpire,
  menuStates,
  handleMenuToggle,
  menuPositions,
}) {
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
            <td>
              {user.subscriptionEnd
                ? new Date(user.subscriptionEnd).toLocaleDateString()
                : '-'}
            </td>
            <td style={{ position: 'relative' }}>
              <button
                onClick={(e) => handleMenuToggle(e, user.email)}
                className="dropdown-trigger"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {menuStates[user.email] && (
                <div
                  className="dropdown-menu"
                  style={{
                    top: menuPositions[user.email]?.y || 0,
                    left: menuPositions[user.email]?.x || 0,
                  }}
                >
                  <button
                    onClick={() => handleEditClick(user)}
                    disabled={processing}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.email)}
                    disabled={processing}
                  >
                    Delete
                  </button>
                  {user.isSubscribed && (
                    <button
                      onClick={() => handleExpire(user.email)}
                      disabled={processing}
                    >
                      Expire
                    </button>
                  )}
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
