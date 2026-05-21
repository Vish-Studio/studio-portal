import { useState, type SyntheticEvent } from 'react';
import { Button, FormField, MaterialIcon, Modal, TextInput } from '@/src/shared/components';
import type { StudioDocument } from '../../types';

interface SignDocumentModalProps {
  document: StudioDocument;
  onSign: (name: string) => void;
  onClose: () => void;
}

export default function SignDocumentModal({ document, onSign, onClose }: SignDocumentModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSign(name.trim());
  };

  return (
    <Modal
      onClose={onClose}
      title="Sign Contract"
      description={`Electronically signing: ${document.title}`}
      headerIcon={
        <div className="sign-document-modal-icon flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50">
          <MaterialIcon name="draw" size={22} className="sign-document-modal-icon-symbol text-violet-500" />
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="sign-document-modal-form flex flex-col gap-4 px-6 py-5">
        <FormField label="Full Legal Name" required>
          <TextInput
            required
            autoFocus
            value={name}
            onChange={event => setName(event.target.value)}
            type="text"
            placeholder="Your full name"
          />
        </FormField>
        <div className="sign-document-modal-actions flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="sign-document-modal-cancel flex-1">
            Cancel
          </Button>
          <Button type="submit" className="sign-document-modal-submit flex-1">
            Confirm & Sign
          </Button>
        </div>
      </form>
    </Modal>
  );
}
