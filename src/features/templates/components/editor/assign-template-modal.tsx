import { MaterialIcon, Modal } from '@/src/shared/components';
import { useDocumentTemplatesStore } from '../../stores/documentTemplatesStore';

interface Props {
  /** Phase title shown in the modal header */
  phaseTitle: string;
  onConfirm: (templateSlug: string) => void;
  onCancel:  () => void;
}

export default function AssignTemplateModal({ phaseTitle, onConfirm, onCancel }: Props) {
  const templates = useDocumentTemplatesStore(state => state.getActiveTemplates());

  return (
    <Modal
      onClose={onCancel}
      size="md"
      title={`Assign template — ${phaseTitle}`}
      description="Choose a template, edit it, then save it to this project phase."
    >
      <div className="px-6 pb-6 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {templates.map(tpl => (
          <button
            key={tpl.slug}
            type="button"
            onClick={() => onConfirm(tpl.slug)}
            className="group flex min-h-40 flex-col gap-4 w-full text-left p-5 rounded-[18px] border border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors">
                <MaterialIcon name={tpl.icon} size={20} className="text-gray-600" />
              </div>
              <MaterialIcon name="arrow_forward" size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 mb-1">{tpl.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{tpl.description}</p>
            </div>
            <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-700 transition-colors">
              Use template
            </span>
          </button>
        ))}
        </div>
      </div>
    </Modal>
  );
}
