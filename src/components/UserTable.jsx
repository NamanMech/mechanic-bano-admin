import React from 'react';
import DropdownMenu from './DropdownMenu.jsx';

export default function UserTable({
  users,
  processing,
  handleEditClick,
  handleSaveInlineEdit,
  handleCancelInlineEdit,
  handleDelete,
  handleExpire,
  editingUserEmail,
  editingFormData,
  setEditingFormData
}) {
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Subscribed', 'Subscription End'];
    const rows = users.map(user => [
      user.name,
      user.email,
      user.isSubscribed ? 'Yes' : 'No',
      user.subscriptionEnd ? new Date(user.subscriptionEnd).toLocaleDateString() : '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users_export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="table-container">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button className="btn-primary" onClick={exportToCSV}>Export CSV</button>
      </div>

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
                    <DropdownMenu
                      user={user}
                      onEdit={handleEditClick}
                      onDelete={handleDelete}
                      onExpire={handleExpire}
                      processing={processing}
                    />
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
