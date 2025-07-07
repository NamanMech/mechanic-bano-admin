import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function DropdownMenu({ user, onEdit, onDelete, onExpire, processing }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyles, setMenuStyles] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const handleToggleMenu = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuStyles({
        top: rect.bottom + window.scrollY + 5, // 5px gap from button
        left: rect.left + window.scrollX
      });
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
      <button ref={buttonRef} onClick={handleToggleMenu} className="dropdown-trigger">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="dropdown-menu"
            style={{
              position: 'absolute',
              top: `${menuStyles.top}px`,
              left: `${menuStyles.left}px`
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
