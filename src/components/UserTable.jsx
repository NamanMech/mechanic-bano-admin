import React, { useState, useEffect, useRef } from 'react';

export default function UserTable({ users, onEdit, onDelete, onExpire }) {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    if (menuOpenId === id) {
      setMenuOpenId(null);
    } else {
      setMenuOpenId(id);
    }
  };

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
            <td style={{ position: 'relative' }}>
              <button
                className="dropdown-trigger"
                onClick={() => toggleMenu(user._id)}
              >
                ≡
              </button>

              {menuOpenId === user._id && (
                <div className="dropdown-menu" ref={menuRef} style={{ right: 0 }}>
                  <button onClick={() => { onEdit(user); setMenuOpenId(null); }}>Edit</button>
                  <button onClick={() => { onDelete(user.email); setMenuOpenId(null); }}>Delete</button>
                  {user.isSubscribed && (
                    <button onClick={() => { onExpire(user.email); setMenuOpenId(null); }}>Expire</button>
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
