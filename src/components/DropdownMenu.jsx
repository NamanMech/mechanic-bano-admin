import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function DropdownMenu({ user, onEdit, onDelete, onExpire, processing }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({ x: rect.left, y: rect.bottom + window.scrollY });
      setIsOpen(!isOpen);
    }
  };

  const handleClickOutside = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      !buttonRef.current.contains(e.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <button ref={buttonRef} onClick={toggleMenu} className="dropdown-trigger">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          className="dropdown-menu"
          style={{
            top: `${menuPosition.y}px`,
            left: `${menuPosition.x}px`,
          }}
        >
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
        </div>,
        document.body
      )}
    </>
  );
}
