import { Link, useNavigate } from 'react-router-dom';
import { FileText, Presentation, FileCheck2, FileHeart, PenTool, User, Users } from 'lucide-react';
import { format } from 'date-fns';
import ContentCard from '../../common/card-content/card-content';
import ButtonIcon from '../../common/button-icon/button-icon';
import type { StudioDocument } from '@/src/data/documents';

interface DocumentOverviewProps {
  documents: StudioDocument[];
  limit?: number;
}

function DocIcon({ type }: { type: string }) {
  const cls = 'w-4 h-4 text-gray-500';
  switch (type) {
    case 'quotation': return <span className="text-sm font-extrabold text-gray-500">Q</span>;
    case 'proposal': return <Presentation className={cls} />;
    case 'invoice': return <FileCheck2 className={cls} />;
    case 'onboarding': return <FileHeart className={cls} />;
    case 'contract': return <PenTool className={cls} />;
    default: return <FileText className={cls} />;
  }
}

function AuthorBadge({ type, name }: { type: 'client' | 'member'; name: string }) {
  if (type === 'client') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 shrink-0">
        <User size={10} />{name}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-(--color-surface) text-gray-500 shrink-0">
      <Users size={10} />{name}
    </span>
  );
}

export default function DocumentOverview({ documents, limit = 5 }: DocumentOverviewProps) {
  const navigate = useNavigate();
  const sorted = [...documents]
    .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0))
    .slice(0, limit);

  return (
    <ContentCard
      iconName="description"
      title="Documents"
      className="h-full"
      action={
        <ButtonIcon
          iconName="arrow_outward"
          clickHandler={() => navigate('/admin/documents')}
          aria-label="Go to documents page"
        />
      }
    >
      {sorted.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-10">
          <p className="text-sm text-gray-400 font-medium">No documents yet</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {sorted.map(doc => (
            <Link
              key={doc.id}
              to="/admin/documents"
              className="px-4 md:px-6 py-3 hover:bg-(--color-surface) transition-colors group flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-(--color-surface) flex items-center justify-center shrink-0">
                <DocIcon type={doc.type} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-(--color-ink) truncate group-hover:text-gray-600 transition-colors">
                  {doc.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{doc.type}</span>
                  {doc.author && <AuthorBadge type={doc.author.type} name={doc.author.name} />}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-gray-400 tabular-nums">
                  {doc.createdAt ? format(doc.createdAt.toMillis(), 'MMM d') : '—'}
                </p>
                <p className="text-[10px] text-gray-400 tabular-nums mt-0.5">
                  {doc.createdAt ? format(doc.createdAt.toMillis(), 'h:mm a') : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </ContentCard>
  );
}
