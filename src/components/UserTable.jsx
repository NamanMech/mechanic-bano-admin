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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dropdown Menu Rendered Outside the Table */}
      {Object.entries(menuStates).map(([email, isOpen]) =>
        isOpen ? (
          <div
            key={email}
            className="dropdown-menu show"
            style={{
              position: 'fixed',
              top: menuPositions[email]?.y || 0,
              left: menuPositions[email]?.x || 0,
              backgroundColor: '#fff',
              color: '#000',
              border: '1px solid #ccc',
              borderRadius: '4px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              minWidth: '120px',
            }}
          >
            <button onClick={() => handleEditClick(users.find(u => u.email === email))} disabled={processing}>
              Edit
            </button>
            <button onClick={() => handleDelete(email)} disabled={processing}>
              Delete
            </button>
            <button
              onClick={() => handleExpire(email)}
              disabled={processing || !users.find(u => u.email === email)?.isSubscribed}
            >
              {users.find(u => u.email === email)?.isSubscribed ? 'Expire' : 'Expired'}
            </button>
          </div>
        ) : null
      )}
    </div>
  );
}
