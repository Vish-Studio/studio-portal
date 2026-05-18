import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import { MaterialIcon } from '@/src/shared/components';
import { TEMPLATES } from '../data/templates';

export default function Templates() {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Templates">
      <div className="flex flex-col gap-6 pb-10">

        {/* ── Intro ── */}
        <p className="text-sm text-gray-400 font-medium max-w-xl">
          Ready-to-use professional document templates. Click any template to open the full document view — then print or export to PDF.
        </p>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map(tpl => (
            <button
              key={tpl.slug}
              type="button"
              onClick={() => navigate(tpl.path)}
              className="group text-left bg-white border border-gray-100 rounded-[18px] p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-150 flex flex-col gap-4"
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-2xl bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0">
                <MaterialIcon name={tpl.icon} size={20} className="text-gray-600" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 mb-1">{tpl.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{tpl.description}</p>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 group-hover:text-gray-700 transition-colors">
                <span>Open template</span>
                <MaterialIcon name="arrow_forward" size={14} />
              </div>
            </button>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
