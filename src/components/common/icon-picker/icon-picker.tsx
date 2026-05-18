import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import MaterialIcon from '../material-icon/material-icon';

// ─── Curated icon catalogue ───────────────────────────────────────────────────

interface IconOption {
  name:  string;
  label: string;
}

export const TIMELINE_ICONS: IconOption[] = [
  // Milestones & progress
  { name: 'flag',              label: 'Milestone'    },
  { name: 'star',              label: 'Star'         },
  { name: 'celebration',       label: 'Celebration'  },
  { name: 'rocket_launch',     label: 'Launch'       },
  { name: 'campaign',          label: 'Announce'     },
  { name: 'trophy',            label: 'Achievement'  },
  // Work process
  { name: 'search',            label: 'Discovery'    },
  { name: 'design_services',   label: 'Design'       },
  { name: 'code',              label: 'Development'  },
  { name: 'bug_report',        label: 'QA'           },
  { name: 'deployed_code',     label: 'Deploy'       },
  { name: 'edit',              label: 'Revision'     },
  { name: 'task_alt',          label: 'Task done'    },
  { name: 'lightbulb',         label: 'Idea'         },
  { name: 'build',             label: 'Build'        },
  // Documents & legal
  { name: 'description',       label: 'Document'     },
  { name: 'draw',              label: 'Contract'     },
  { name: 'receipt',           label: 'Invoice'      },
  { name: 'feedback',          label: 'Feedback'     },
  { name: 'reviews',           label: 'Review'       },
  { name: 'request_quote',     label: 'Quote'        },
  // People & meetings
  { name: 'person_add',        label: 'Onboarding'   },
  { name: 'groups',            label: 'Team'         },
  { name: 'handshake',         label: 'Partnership'  },
  { name: 'meeting_room',      label: 'Meeting'      },
  // Finance
  { name: 'payments',          label: 'Payment'      },
  { name: 'attach_money',      label: 'Money'        },
  // Scheduling & delivery
  { name: 'schedule',          label: 'Schedule'     },
  { name: 'calendar_month',    label: 'Date'         },
  { name: 'upload',            label: 'Delivery'     },
  { name: 'check_circle',      label: 'Complete'     },
  // Communication
  { name: 'mail',              label: 'Email'        },
  { name: 'notifications',     label: 'Notification' },
  { name: 'chat',              label: 'Message'      },
];

// ─── IconPicker ───────────────────────────────────────────────────────────────

interface IconPickerProps {
  value:    string;
  onChange: (icon: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const ref  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const selectedLabel = TIMELINE_ICONS.find(i => i.name === value)?.label ?? value;

  return (
    <div ref={ref} className={`icon-picker relative ${open ? 'z-[300]' : ''}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="icon-picker-trigger flex items-center gap-2 w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <div className="icon-picker-preview w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
          <MaterialIcon name={value || 'flag'} size={16} className="text-gray-600" />
        </div>
        <span className="text-sm text-gray-700 font-medium flex-1 text-left">{selectedLabel}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown grid */}
      {open && (
        <div className="icon-picker-menu absolute left-0 top-full z-[400] mt-2 w-72 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 px-1">
            Choose icon
          </p>
          <div className="icon-picker-grid grid grid-cols-6 gap-1 max-h-52 overflow-y-auto">
            {TIMELINE_ICONS.map(opt => (
              <button
                key={opt.name}
                type="button"
                title={opt.label}
                onClick={() => { onChange(opt.name); setOpen(false); }}
                className={`icon-picker-option flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  value === opt.name
                    ? 'bg-gray-900 text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <MaterialIcon
                  name={opt.name}
                  size={18}
                  className={value === opt.name ? 'text-white' : 'text-gray-600'}
                />
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2 px-1">{selectedLabel}</p>
        </div>
      )}
    </div>
  );
}
