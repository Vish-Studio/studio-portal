import React from 'react';
import { AlertTriangle, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';
import Modal from '../modal/modal';
import Button from '../button/button';

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
    <div className={`confirm-dialog-icon w-11 h-11 rounded-2xl flex items-center justify-center ${isDanger ? 'bg-red-50' : 'bg-gray-100'}`}>
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
        <div className="confirm-dialog-actions flex w-full gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="confirm-dialog-cancel flex-1"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onConfirm}
            className={`confirm-dialog-confirm flex-1 ${isDanger ? 'bg-red-500 text-white hover:bg-red-600 disabled:hover:bg-red-500' : ''}`}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      {typeof message !== 'string' && (
        <div className="confirm-dialog-message px-6 py-4 text-sm text-gray-500 font-medium">{message}</div>
      )}
    </Modal>
  );
}
