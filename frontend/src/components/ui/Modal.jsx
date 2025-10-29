import { X } from 'lucide-react';
import { useEffect } from 'react';

/**
 * Modal component with backdrop and close functionality
 * @param {boolean} isOpen - Controls modal visibility
 * @param {Function} onClose - Close handler
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {string} size - Modal size: 'sm' | 'md' | 'lg' | 'xl'
 */
function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
