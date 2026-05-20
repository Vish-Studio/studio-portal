import { MaterialIcon } from '@/src/shared/components';

interface TemplateCardProps {
  slug: string;
  title: string;
  description: string;
  icon: string;
  onOpen: () => void;
}

export default function TemplateCard({ slug, title, description, icon, onOpen }: TemplateCardProps) {
  return (
    <button
      key={slug}
      type="button"
      onClick={onOpen}
      className="template-card group flex flex-col gap-4 rounded-[18px] border border-gray-100 bg-white p-6 text-left transition-all duration-150 hover:border-gray-300 hover:shadow-sm"
    >
      <div className="template-card-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-100 transition-colors group-hover:bg-gray-200">
        <MaterialIcon name={icon} size={20} className="template-card-icon-symbol text-gray-600" />
      </div>

      <div className="template-card-copy min-w-0 flex-1">
        <p className="template-card-title mb-1 text-sm font-bold text-gray-900">{title}</p>
        <p className="template-card-description text-xs leading-relaxed text-gray-400">{description}</p>
      </div>

      <div className="template-card-cta flex items-center gap-1.5 text-xs font-semibold text-gray-400 transition-colors group-hover:text-gray-700">
        <span>Open template</span>
        <MaterialIcon name="arrow_forward" size={14} />
      </div>
    </button>
  );
}
