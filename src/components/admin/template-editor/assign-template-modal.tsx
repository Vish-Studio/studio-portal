import Modal from '../../common/modal/modal';
import MaterialIcon from '../../common/material-icon/material-icon';
import { TEMPLATES } from '../../../data/templates';
import { STAGE_META } from '../../../data/projects';
import type { StageKey } from '../../../data/projects';

interface Props {
  phaseKey:  StageKey;
  onConfirm: (templateSlug: string) => void;
  onCancel:  () => void;
}

// Natural slug suggestions per phase
const PHASE_SUGGESTIONS: Partial<Record<StageKey, string[]>> = {
  discovery:   ['project-proposal', 'quotation'],
  onboarding:  ['quotation', 'contract'],
  contract:    ['contract'],
  invoice:     ['invoice', 'overdue-invoice'],
  design:      ['project-proposal'],
  development: ['project-proposal'],
  qa:          ['invoice'],
  launch:      ['invoice', 'contract'],
};

export default function AssignTemplateModal({ phaseKey, onConfirm, onCancel }: Props) {
  const suggested = PHASE_SUGGESTIONS[phaseKey] ?? [];

  return (
    <Modal
      onClose={onCancel}
      size="md"
      title={`Assign template — ${STAGE_META[phaseKey].label}`}
      description="Choose which template to attach to this project phase."
    >
      <div className="px-6 pb-6 pt-2 flex flex-col gap-2">
        {suggested.length > 0 && (
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Suggested</p>
        )}
        {TEMPLATES.map(tpl => {
          const isSuggested = suggested.includes(tpl.slug);
          return (
            <button
              key={tpl.slug}
              type="button"
              onClick={() => onConfirm(tpl.slug)}
              className={`flex items-center gap-4 w-full text-left px-4 py-3 rounded-2xl border transition-all hover:shadow-sm ${
                isSuggested
                  ? 'border-gray-900 bg-gray-50 hover:bg-gray-100'
                  : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isSuggested ? 'bg-gray-900' : 'bg-gray-100'
              }`}>
                <MaterialIcon name={tpl.icon} size={18} className={isSuggested ? 'text-white' : 'text-gray-500'} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900">{tpl.title}</p>
                <p className="text-xs text-gray-400 truncate">{tpl.description}</p>
              </div>
              {isSuggested && (
                <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full shrink-0">
                  Suggested
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
