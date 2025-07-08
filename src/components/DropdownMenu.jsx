import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function DropdownMenu({ user, onEdit, onDelete, onExpire, processing }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const iframeRef = useRef(null);

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
      iframeRef.current &&
      !iframeRef.current.contains(e.target) &&
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
        <iframe
          ref={iframeRef}
          style={{
            position: 'absolute',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            width: '150px',
            height: user.isSubscribed ? '150px' : '100px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            zIndex: 9999,
          }}
        ></iframe>,
        document.body
      )}

      {isOpen && iframeRef.current && createPortal(
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            padding: '0'
          }}
        >
          <button
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'white',
              color: 'black',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer'
            }}
            onClick={() => { onEdit(user); setIsOpen(false); }}
            disabled={processing}
          >
            Edit
          </button>
          <button
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'white',
              color: 'black',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer'
            }}
            onClick={() => { onDelete(user.email); setIsOpen(false); }}
            disabled={processing}
          >
            Delete
          </button>
          {user.isSubscribed && (
            <button
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer'
              }}
              onClick={() => { onExpire(user.email); setIsOpen(false); }}
              disabled={processing}
            >
              Expire
            </button>
          )}
        </div>,
        iframeRef.current?.contentDocument?.body
      )}
    </>
  );
}
