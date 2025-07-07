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
    <div className="dropdown" ref={menuRef} style={{ position: 'relative' }}>
      <button onClick={toggleMenu} className="dropdown-trigger">
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

      {isOpen && (
        <div className="dropdown-menu" style={{ position: 'absolute', top: '30px', right: '0' }}>
          <button
            onClick={() => { onEdit(user); setIsOpen(false); }}
            disabled={processing}
          >
            Edit
          </button>
          <button
            onClick={() => { onDelete(user.email); setIsOpen(false); }}
            disabled={processing}
          >
            Delete
          </button>
          <button
            onClick={() => { onExpire(user.email); setIsOpen(false); }}
            disabled={processing}
          >
            Expire
          </button>
        </div>
      )}
    </div>
  );
}
