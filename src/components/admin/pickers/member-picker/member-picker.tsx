import { useState, useMemo, useRef, useEffect, FunctionComponent } from 'react';
import { Search, X } from 'lucide-react';
import Avatar from '../../../common/avatar/avatar';
import { inputCls } from '../../../common/form-field/form-field';
import type { TeamMember } from '@/src/data/team';

interface MemberPickerProps {
  members: TeamMember[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const MemberPicker: FunctionComponent<MemberPickerProps> = ({ members, selectedIds, onToggle }) => {
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = members.filter(m => selectedIds.includes(m.id));
  const filtered = useMemo(
    () =>
      members.filter(
        m =>
          !selectedIds.includes(m.id) &&
          (m.name.toLowerCase().includes(query.toLowerCase()) ||
            m.role.toLowerCase().includes(query.toLowerCase())),
      ),
    [members, selectedIds, query],
  );

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setQuery('');
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} className="member-picker flex flex-col gap-2">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="member-picker-selected flex flex-wrap gap-1.5">
          {selected.map(m => (
            <div key={m.id} className="member-picker-chip flex items-center gap-1.5 bg-gray-100 rounded-full pl-1 pr-2 py-1">
              <Avatar name={m.name} id={m.id} size="xs" />
              <span className="text-xs font-medium text-gray-700 leading-none">
                {m.name.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={() => onToggle(m.id)}
                className="text-gray-400 hover:text-gray-700 transition-colors ml-0.5"
                aria-label={`Remove ${m.name}`}
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="member-picker-search relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search team members…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={`${inputCls(false)} pl-8`}
        />
        {query && filtered.length > 0 && (
          <div className="member-picker-menu absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden max-h-48 overflow-y-auto">
            {filtered.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => { onToggle(m.id); setQuery(''); }}
                className="member-picker-option w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
              >
                <Avatar name={m.name} id={m.id} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.role}</p>
                </div>
              </button>
            ))}
          </div>
        )}
        {query && filtered.length === 0 && (
          <div className="member-picker-empty absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-sm z-20 px-4 py-3">
            <p className="text-sm text-gray-400">No members match &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberPicker;
