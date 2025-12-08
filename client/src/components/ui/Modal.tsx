import React, { ReactNode, useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

/**
 * Reusable Modal Component
 * Used across admin and other sections for consistent UI
 *
 * @param isOpen - Whether modal is visible
 * @param title - Modal title/header
 * @param children - Modal content
 * @param onClose - Callback when modal should close
 * @param actions - Footer action buttons
 * @param size - Modal size (small, medium, large)
 * @param className - Additional CSS classes
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
  actions,
  size = 'medium',
  className = '',
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'modal-small',
    medium: 'modal-medium',
    large: 'modal-large',
  };

  return (
    <div className={`modal-overlay ${className}`} onClick={onClose}>
      <div
        className={`modal ${sizeClasses[size]}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            title="Close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {actions && <div className="modal-footer">{actions}</div>}
      </div>
    </div>
  );
};

export default Modal;
