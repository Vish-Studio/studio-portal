import { useState, type SyntheticEvent } from 'react';
import { MaterialIcon } from '@/src/shared/components';
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
    <div className="sign-document-modal fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="sign-document-modal-panel w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="sign-document-modal-icon mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50">
          <MaterialIcon name="draw" size={22} className="sign-document-modal-icon-symbol text-violet-500" />
        </div>
        <h3 className="sign-document-modal-title mb-1 text-xl font-extrabold text-gray-900">Sign Contract</h3>
        <p className="sign-document-modal-description mb-6 text-sm font-medium text-gray-500">
          Electronically signing:{' '}
          <span className="sign-document-modal-document-title font-bold text-gray-900">{document.title}</span>
        </p>
        <form onSubmit={handleSubmit} className="sign-document-modal-form flex flex-col gap-4">
          <div className="sign-document-modal-field">
            <label className="sign-document-modal-label mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Full Legal Name
            </label>
            <input
              required
              autoFocus
              value={name}
              onChange={event => setName(event.target.value)}
              type="text"
              className="sign-document-modal-input w-full rounded-[12px] border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 transition-colors focus:border-gray-400 focus:outline-none"
              placeholder="Your full name"
            />
          </div>
          <div className="sign-document-modal-actions flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="sign-document-modal-cancel flex-1 rounded-full bg-gray-100 py-3 text-xs font-extrabold uppercase tracking-widest text-gray-900 transition-colors hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sign-document-modal-submit flex-1 rounded-full bg-black py-3 text-xs font-extrabold uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
            >
              Confirm & Sign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
