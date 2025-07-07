import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

export default function DropdownMenu({ user, onEdit, onDelete, onExpire, processing }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  const toggleMenu = (e) => {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: rect.bottom + window.scrollY });
    setIsOpen(!isOpen);
  };

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
    <>
      <button onClick={toggleMenu} className="dropdown-trigger">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && ReactDOM.createPortal(
        <div
          className="dropdown-menu"
          ref={menuRef}
          style={{
            position: 'fixed',
            top: menuPosition.y,
            left: menuPosition.x,
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          <button onClick={() => { onEdit(user); setIsOpen(false); }} disabled={processing}>
            Edit
          </button>
          <button onClick={() => { onDelete(user.email); setIsOpen(false); }} disabled={processing}>
            Delete
          </button>
          <button onClick={() => { onExpire(user.email); setIsOpen(false); }} disabled={processing}>
            Expire
          </button>
        </div>,
        document.body
      )}
    </>
  );
}
