import Modal from '../../common/modal/modal';
import MaterialIcon from '../../common/material-icon/material-icon';
import { TEMPLATES } from '../../../data/templates';

interface Props {
  /** Phase title shown in the modal header */
  phaseTitle: string;
  onConfirm: (templateSlug: string) => void;
  onCancel:  () => void;
}

export default function AssignTemplateModal({ phaseTitle, onConfirm, onCancel }: Props) {
  return (
    <Modal
      onClose={onCancel}
      size="md"
      title={`Assign template — ${phaseTitle}`}
      description="Choose which template to attach to this project phase."
    >
      <div className="px-6 pb-6 pt-2 flex flex-col gap-2">
        {TEMPLATES.map(tpl => (
          <button
            key={tpl.slug}
            type="button"
            onClick={() => onConfirm(tpl.slug)}
            className="flex items-center gap-4 w-full text-left px-4 py-3 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50 transition-all hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <MaterialIcon name={tpl.icon} size={18} className="text-gray-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900">{tpl.title}</p>
              <p className="text-xs text-gray-400 truncate">{tpl.description}</p>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
