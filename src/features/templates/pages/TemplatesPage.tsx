import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import { TEMPLATES } from '../templates';
import TemplateCard from '../components/template-card/template-card';

export default function TemplatesPage() {
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
            <TemplateCard
              key={tpl.slug}
              slug={tpl.slug}
              title={tpl.title}
              description={tpl.description}
              icon={tpl.icon}
              onOpen={() => navigate(tpl.path)}
            />
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
