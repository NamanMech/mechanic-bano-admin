import React, { useState, useEffect, useRef } from 'react';

export default function DropdownMenu({ user, onEdit, onDelete, onExpire, processing }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={menuRef}>
      <button onClick={toggleMenu} className="btn-menu">
        ☰
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={() => { onEdit(user); setIsOpen(false); }} disabled={processing}>
            Edit
          </button>
          <button onClick={() => { onDelete(user.email); setIsOpen(false); }} disabled={processing}>
            Delete
          </button>
          {user.isSubscribed && (
            <button onClick={() => { onExpire(user.email); setIsOpen(false); }} disabled={processing}>
              Expire
            </button>
          )}
        </div>
      )}
    </div>
  );
}
