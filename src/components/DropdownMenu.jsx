import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function DropdownMenu({ user, onEdit, onDelete, onExpire, processing }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const calculatePosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0 };
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 140;
    const viewportWidth = window.innerWidth;
    return {
      top: rect.bottom + window.scrollY + 5,
      left:
        viewportWidth - rect.right < menuWidth
          ? rect.right - menuWidth + window.scrollX
          : rect.left + window.scrollX,
    };
  };

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setMenuPosition(calculatePosition());
    setIsOpen((open) => !open);
  };

  const handleClickOutside = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleAction = (action) => {
    setIsOpen(false);
    action();
  };

  const actions = [
    {
      label: 'Edit',
      onClick: () => onEdit(user),
      disabled: processing,
    },
    {
      label: 'Delete',
      onClick: () => {
        if (window.confirm(`Delete user: ${user.email}?`)) onDelete(user.email);
      },
      disabled: processing,
    },
    ...(user.isSubscribed
      ? [
          {
            label: 'Expire',
            onClick: () => {
              if (window.confirm(`Expire subscription for: ${user.email}?`)) onExpire(user.email);
            },
            disabled: processing,
          },
        ]
      : []),
  ];

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggleMenu}
        className="dropdown-trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="User actions"
        disabled={processing}
        type="button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="dropdown-menu-fixed"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              position: 'absolute',
              zIndex: 1000,
            }}
            role="menu"
            tabIndex={-1}
          >
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleAction(action.onClick)}
                disabled={action.disabled}
                aria-label={action.label}
                role="menuitem"
                type="button"
                className="dropdown-menu-item"
              >
                {action.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
