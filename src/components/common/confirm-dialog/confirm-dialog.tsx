import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from '../modal/modal';

export interface ConfirmDialogProps {
  isOpen:        boolean;
  title:         string;
  message:       React.ReactNode;
  confirmLabel?: string;
  cancelLabel?:  string;
  variant?:      'danger' | 'default';
  onConfirm:     () => void;
  onCancel:      () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  variant      = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  const icon = (
    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${isDanger ? 'bg-red-50' : 'bg-gray-100'}`}>
      {isDanger
        ? <Trash2 size={20} className="text-red-500" />
        : <AlertTriangle size={20} className="text-gray-500" />
      }
    </div>
  );

  return (
    <Modal
      onClose={onCancel}
      size="sm"
      headerIcon={icon}
      title={title}
      description={typeof message === 'string' ? message : undefined}
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
              isDanger
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-black hover:bg-gray-800 text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      }
    >
      {typeof message !== 'string' && (
        <div className="px-6 py-4 text-sm text-gray-500 font-medium">{message}</div>
      )}
    </Modal>
  );
}
