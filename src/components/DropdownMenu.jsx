import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function DropdownMenu({ user, onEdit, onDelete, onExpire, processing }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [alignRight, setAlignRight] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 140; // estimated width
    const shouldAlignRight = window.innerWidth - rect.right < menuWidth;
    setMenuPosition({
      top: rect.bottom + window.scrollY + 5,
      left: shouldAlignRight ? rect.right - menuWidth + window.scrollX : rect.left + window.scrollX,
    });
    setAlignRight(shouldAlignRight);
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

  const handleEdit = () => {
    onEdit(user);
    setIsOpen(false);
  };

  const handleDeleteClick = () => {
    if (confirm(`Are you sure you want to delete user: ${user.email}?`)) {
      onDelete(user.email);
      setIsOpen(false);
    }
  };

  const handleExpireClick = () => {
    if (confirm(`Expire subscription for: ${user.email}?`)) {
      onExpire(user.email);
      setIsOpen(false);
    }
  };

  const menu = (
    <div
      ref={menuRef}
      className={`dropdown-menu-fixed dropdown-clean ${alignRight ? 'align-right' : ''}`}
      style={{
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
      }}
      role="menu"
    >
      <button onClick={handleEdit} disabled={processing} aria-label="Edit user" role="menuitem">
        Edit
      </button>
      <button onClick={handleDeleteClick} disabled={processing} aria-label="Delete user" role="menuitem">
        Delete
      </button>
      {user.isSubscribed && (
        <button onClick={handleExpireClick} disabled={processing} aria-label="Expire subscription" role="menuitem">
          Expire
        </button>
      )}
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggleMenu}
        className="dropdown-trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Open user actions menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" >
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {isOpen && createPortal(menu, document.body)}
    </>
  );
}
