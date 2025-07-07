import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function DropdownMenu({ user, onEdit, onDelete, onExpire, processing }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 5,
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

      {isOpen && createPortal(
        <>
          {/* Color Lock Style Injected Directly in Portal */}
          <style>{`
            .dropdown-menu-fixed {
              background-color: white !important;
              color: black !important;
              border: 1px solid #ccc;
              border-radius: 4px;
              z-index: 9999;
              display: flex;
              flex-direction: column;
              min-width: 120px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }
            .dropdown-menu-fixed button {
              background-color: white !important;
              color: black !important;
              padding: 10px;
              border: none;
              text-align: left;
              cursor: pointer;
              width: 100%;
            }
            .dropdown-menu-fixed button:hover {
              background-color: #f2f2f2 !important;
              color: black !important;
            }
          `}</style>

          <div
            ref={menuRef}
            className="dropdown-menu-fixed"
            style={{
              position: 'absolute',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`
            }}
          >
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
            {user.isSubscribed && (
              <button
                onClick={() => { onExpire(user.email); setIsOpen(false); }}
                disabled={processing}
              >
                Expire
              </button>
            )}
          </div>
        </>,
        document.body
      )}
    </>
  );
}
