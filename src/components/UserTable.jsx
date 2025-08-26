import React, { useState } from 'react';
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
  const [exportLoading, setExportLoading] = useState(false);

  const exportToCSV = () => {
    setExportLoading(true);
    
    try {
      const headers = ['Name', 'Email', 'Subscribed', 'Subscription End'];
      const rows = users.map(user => [
        `"${user.name.replace(/"/g, '""')}"`, // Handle quotes in names
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
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setTimeout(() => setExportLoading(false), 500); // Brief delay for smoother UX
    }
  };

  // Calculate stats for visual indicators
  const subscribedCount = users.filter(user => user.isSubscribed).length;
  const expiredCount = users.filter(user => 
    user.subscriptionEnd && new Date(user.subscriptionEnd) < new Date()
  ).length;

  return (
    <div className="table-container">
      <div className="table-header-actions">
        <div className="user-stats-quick">
          <span className="stat-badge subscribed">
            Subscribed: {subscribedCount}
          </span>
          <span className="stat-badge expired">
            Expired: {expiredCount}
          </span>
        </div>
        
        <button 
          className={`btn-primary ${exportLoading ? 'button-loading' : ''}`} 
          onClick={exportToCSV}
          disabled={exportLoading || users.length === 0}
        >
          {exportLoading ? (
            <>
              <span className="spinner-small"></span>
              Exporting...
            </>
          ) : (
            `Export CSV (${users.length})`
          )}
        </button>
      </div>

      {users.length === 0 ? (
        <div className="no-users-message">
          <p>No users found</p>
        </div>
      ) : (
        <div className="table-responsive">
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
                const daysLeft = user.subscriptionEnd
                  ? Math.ceil((new Date(user.subscriptionEnd) - new Date()) / (1000 * 60 * 60 * 24))
                  : null;
                
                let statusClass = '';
                let displayDaysLeft = '-';
                
                if (daysLeft !== null) {
                  if (daysLeft > 30) {
                    statusClass = 'status-good';
                    displayDaysLeft = `${daysLeft} days left`;
                  } else if (daysLeft > 0) {
                    statusClass = 'status-warning';
                    displayDaysLeft = `${daysLeft} days left`;
                  } else {
                    statusClass = 'status-expired';
                    displayDaysLeft = 'Expired';
                  }
                }

                return (
                  <tr key={user._id || user.email} className={isEditing ? 'editing-row' : ''}>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingFormData.name}
                          onChange={(e) =>
                            setEditingFormData({ ...editingFormData, name: e.target.value })
                          }
                          className="edit-input"
                          disabled={processing}
                        />
                      ) : (
                        <div className="user-name">
                          {user.name || <span className="no-name">No name provided</span>}
                        </div>
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
                          className="edit-input"
                          disabled={processing}
                        />
                      ) : (
                        <div className="user-email">
                          {user.email}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="subscription-status">
                        {user.isSubscribed ? (
                          <span className="status-icon active" title="Subscribed">✔️</span>
                        ) : (
                          <span className="status-icon inactive" title="Not subscribed">❌</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="subscription-details">
                        {user.subscriptionEnd ? (
                          <>
                            <div className="subscription-date">
                              {new Date(user.subscriptionEnd).toLocaleDateString()}
                            </div>
                            <div className={`days-left ${statusClass}`}>
                              {displayDaysLeft}
                            </div>
                          </>
                        ) : (
                          '-'
                        )}
                      </div>
                    </td>
                    <td>
                      {isEditing ? (
                        <div className="edit-actions">
                          <button
                            className="save-button"
                            onClick={() => handleSaveInlineEdit(user.email)}
                            disabled={processing}
                          >
                            {processing ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            className="cancel-button"
                            onClick={handleCancelInlineEdit}
                            disabled={processing}
                          >
                            Cancel
                          </button>
                        </div>
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
      )}
    </div>
  );
}
