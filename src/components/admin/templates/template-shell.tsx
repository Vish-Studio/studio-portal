import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';

interface TemplateShellProps {
  title:    string;
  children: React.ReactNode;
}

export default function TemplateShell({ title, children }: TemplateShellProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* ── Topbar — matches app topbar style ── */}
      <div className="print:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-4 sm:pb-6">
        <div className="flex items-center justify-between gap-4">

          {/* Left: back + title */}
          <div className="flex items-center gap-3">
            <Link
              to="/admin/templates"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 transition-colors shrink-0"
            >
              <ArrowLeft size={15} />
            </Link>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 leading-none mb-0.5">Templates</p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">{title}</h2>
            </div>
          </div>

          {/* Right: print button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-700 transition-colors"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Print / Export PDF</span>
            <span className="sm:hidden">Print</span>
          </button>
        </div>
      </div>

      {/* ── Document ── */}
      <div className="flex-1 py-8 px-4 print:p-0">
        <div
          className="mx-auto max-w-195 bg-[#F5EFE4] print:max-w-none print:shadow-none"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Shared document sub-components ──────────────────────────────────────────

export function DocDivider({ className = '' }: { className?: string }) {
  return <div className={`border-b border-[#C8BFB0] ${className}`} />;
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-black tracking-[0.22em] uppercase text-center text-gray-800 mb-4">
      {children}
    </h2>
  );
}

export function BodyText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[13px] leading-[1.75] text-gray-700 ${className}`}>
      {children}
    </p>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[13px] text-gray-700 leading-relaxed">
          <span className="mt-1.75 w-1 h-1 rounded-full bg-gray-700 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
