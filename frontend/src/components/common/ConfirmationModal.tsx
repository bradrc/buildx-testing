import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconColor: 'text-red-600',
      btnColor: 'bg-red-600 hover:bg-red-700',
      bgColor: 'bg-red-50',
    },
    warning: {
      iconColor: 'text-amber-600',
      btnColor: 'bg-amber-600 hover:bg-amber-700',
      bgColor: 'bg-amber-50',
    },
    info: {
      iconColor: 'text-blue-600',
      btnColor: 'bg-blue-600 hover:bg-blue-700',
      bgColor: 'bg-blue-50',
    },
  };

  const styles = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className={`p-3 rounded-full ${styles.bgColor} mb-4`}>
          <AlertTriangle className={`w-8 h-8 ${styles.iconColor}`} />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8">
          {message}
        </p>
        
        <div className="flex justify-center space-x-3 w-full">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${styles.btnColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
