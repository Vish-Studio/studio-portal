import { useState, useMemo, useRef, useEffect, FunctionComponent } from 'react';
import { Search, X } from 'lucide-react';
import Avatar from '../../../common/avatar/avatar';
import { inputCls } from '../../../common/form-field/form-field';
import type { Client } from '@/src/data/clients';

interface ClientPickerProps {
  clients: Client[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const ClientPicker: FunctionComponent<ClientPickerProps> = ({ clients, selectedId, onSelect }) => {
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const selected = clients.find(c => c.id === selectedId);

  const filtered = useMemo(
    () =>
      clients.filter(c =>
        c.displayName.toLowerCase().includes(query.toLowerCase()) ||
        (c.companyName ?? '').toLowerCase().includes(query.toLowerCase()),
      ),
    [clients, query],
  );

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setQuery('');
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      {selected ? (
        <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
          <Avatar name={selected.displayName} id={selected.id} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{selected.displayName}</p>
            {selected.companyName && (
              <p className="text-xs text-gray-400 truncate">{selected.companyName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onSelect('')}
            className="text-gray-400 hover:text-gray-700 transition-colors p-0.5"
            aria-label="Clear selection"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search clients…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={`${inputCls(false)} pl-8`}
          />
          {query && filtered.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden max-h-44 overflow-y-auto">
              {filtered.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { onSelect(c.id); setQuery(''); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <Avatar name={c.displayName} id={c.id} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.displayName}</p>
                    {c.companyName && <p className="text-xs text-gray-400">{c.companyName}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
          {query && filtered.length === 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-sm z-20 px-4 py-3">
              <p className="text-sm text-gray-400">No clients match &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientPicker;
