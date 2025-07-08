import React from 'react';

export default function UserTable({
  users,
  processing,
  handleEditClick,
  handleSaveInlineEdit,
  handleCancelInlineEdit,
  editingUserEmail,
  editingFormData,
  setEditingFormData
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
          {users.map((user) => {
            const isEditing = editingUserEmail === user.email;
            return (
              <tr key={user._id}>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingFormData.name}
                      onChange={(e) =>
                        setEditingFormData({ ...editingFormData, name: e.target.value })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editingFormData.email}
                      onChange={(e) =>
                        setEditingFormData({ ...editingFormData, email: e.target.value })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
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
                  {isEditing ? (
                    <>
                      <button
                        className="save-button"
                        onClick={() => handleSaveInlineEdit(user.email)}
                        disabled={processing}
                      >
                        Save
                      </button>
                      <button
                        className="cancel-button"
                        onClick={handleCancelInlineEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
