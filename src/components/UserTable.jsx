import React, { useState } from 'react';
import DropdownMenu from './DropdownMenu.jsx';

export default function UserTable({
  users,
  processing,
  handleEditClick,
  handleSaveInline,
  handleCancelInline,
  handleDelete,
  handleExpire,
  editingUserEmail,
  editingUserData,
  setEditingUserData,
}) {
  const [exportLoading, setExportLoading] = useState(false);

  const exportToCSV = () => {
    setExportLoading(true);
    try {
      const headers = ['Name', 'Email', 'Subscribed', 'Subscription End'];
      const rows = users.map(user => [
        `"${(user.name || '').replace(/"/g, '""')}"`, // Escape quotes in names
        user.email,
        user.isSubscribed ? 'Yes' : 'No',
        user.subscriptionEnd ? new Date(user.subscriptionEnd).toLocaleDateString() : '-',
      ]);
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setTimeout(() => setExportLoading(false), 500);
    }
  };

  const subscribedCount = users.filter(u => u.isSubscribed).length;
  const expiredCount = users.filter(u => u.subscriptionEnd ? new Date(u.subscriptionEnd) < new Date() : false).length;

  return (
    <div className="table-container">
      <div className="table-header-actions">
        <div className="user-stats-quick" aria-label="User subscription statistics">
          <span className="stat-badge subscribed" aria-live="polite">
            Subscribed: {subscribedCount}
          </span>
          <span className="stat-badge expired" aria-live="polite">
            Expired: {expiredCount}
          </span>
        </div>
        <button
          className={`btn-primary ${exportLoading ? 'button-loading' : ''}`}
          onClick={exportToCSV}
          disabled={exportLoading || users.length === 0}
          aria-label="Export users data to CSV"
          type="button"
        >
          {exportLoading
            ? <><span className="spinner-small" aria-hidden="true"></span> Exporting...</>
            : `Export CSV (${users.length})`}
        </button>
      </div>

      {users.length === 0
        ? <div className="no-users-message" role="alert"><p>No users found</p></div>
        : (
          <div className="table-responsive">
            <table className="custom-table" role="table" aria-label="User list">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Subscription</th>
                  <th scope="col">Subscription End</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const isEditing = editingUserEmail === user.email;
                  const daysLeft = user.subscriptionEnd
                    ? Math.ceil((new Date(user.subscriptionEnd) - new Date()) / (1000 * 60 * 60 * 24))
                    : null;

                  let statusClass = '';
                  let displayStatus = '-';
                  if (daysLeft !== null) {
                    if (daysLeft > 30) {
                      statusClass = 'status-good';
                      displayStatus = `${daysLeft} days left`;
                    } else if (daysLeft > 0) {
                      statusClass = 'status-warning';
                      displayStatus = `${daysLeft} days left`;
                    } else {
                      statusClass = 'status-expired';
                      displayStatus = 'Expired';
                    }
                  }

                  return (
                    <tr key={user._id || user.email} className={isEditing ? 'editing-row' : ''}>
                      <td>
                        {isEditing
                          ? <input
                              type="text"
                              className="edit-input"
                              value={editingUserData.name}
                              onChange={e => setEditingUserData({ ...editingUserData, name: e.target.value })}
                              disabled={processing}
                              aria-label="Edit user name"
                            />
                          : <div className="user-name">{user.name || <span className="no-name">No name</span>}</div>
                        }
                      </td>
                      <td>
                        {isEditing
                          ? <input
                              type="email"
                              className="edit-input"
                              value={editingUserData.email}
                              onChange={e => setEditingUserData({ ...editingUserData, email: e.target.value })}
                              disabled={processing}
                              aria-label="Edit user email"
                            />
                          : <div className="user-email">{user.email}</div>
                        }
                      </td>
                      <td>
                        <div className="subscription-status" aria-label={`Subscription status: ${user.isSubscribed ? 'Subscribed' : 'Not subscribed'}`}>
                          {user.isSubscribed
                            ? <span className="status-icon active" title="Subscribed" aria-hidden="true">✔️</span>
                            : <span className="status-icon inactive" title="Not subscribed" aria-hidden="true">❌</span>
                          }
                        </div>
                      </td>
                      <td>
                        <div className="subscription-details">
                          {user.subscriptionEnd
                            ? <>
                                <div className="subscription-date">{new Date(user.subscriptionEnd).toLocaleDateString()}</div>
                                <div className={`days-left ${statusClass}`} aria-label={`Subscription ends: ${displayStatus}`}>
                                  {displayStatus}
                                </div>
                              </>
                            : '-'
                          }
                        </div>
                      </td>
                      <td>
                        {isEditing
                          ? (
                            <div className="edit-actions">
                              <button
                                className="save-button"
                                onClick={() => handleSaveInline(user.email)}
                                disabled={processing}
                              >Save</button>
                              <button
                                className="cancel-button"
                                onClick={() => handleCancelInline()}
                                disabled={processing}
                              >Cancel</button>
                            </div>
                          )
                          : (
                            <DropdownMenu
                              user={user}
                              onEdit={handleEditClick}
                              onDelete={handleDelete}
                              onExpire={handleExpire}
                              processing={processing}
                            />
                          )
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
