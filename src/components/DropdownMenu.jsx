import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function DropdownMenu({ user, onEdit, onDelete, onExpire, processing }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 160;
    const screenWidth = window.innerWidth;

    let left = rect.left + window.scrollX;

    // Prevent overflow on right side
    if (left + menuWidth > screenWidth) {
      left = screenWidth - menuWidth - 10;
    }

    // Prevent overflow on left side
    left = Math.max(10, left);

    setMenuPosition({
      top: rect.bottom + window.scrollY + 5,
      left,
    });

    setIsOpen(!isOpen);
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

  const menu = (
    <div
      ref={menuRef}
      className="dropdown-menu-fixed"
      style={{
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
      }}
    >
      <button onClick={() => { onEdit(user); setIsOpen(false); }} disabled={processing}>Edit</button>
      <button onClick={() => { onDelete(user.email); setIsOpen(false); }} disabled={processing}>Delete</button>
      {user.isSubscribed && (
        <button onClick={() => { onExpire(user.email); setIsOpen(false); }} disabled={processing}>Expire</button>
      )}
    </div>
  );

  return (
    <>
      <button ref={buttonRef} onClick={handleToggleMenu} className="dropdown-trigger">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {isOpen && createPortal(menu, document.body)}
    </>
  );
}
