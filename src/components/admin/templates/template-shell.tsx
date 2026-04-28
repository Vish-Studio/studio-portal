import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';

interface TemplateShellProps {
  title:    string;
  children: React.ReactNode;
}

export default function TemplateShell({ title, children }: TemplateShellProps) {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Toolbar (hidden on print) ── */}
      <div className="print:hidden sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/templates"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={15} />
          </Link>
          <span className="text-sm font-semibold text-gray-700">{title}</span>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-700 transition-colors"
        >
          <Printer size={14} />
          Print / Export PDF
        </button>
      </div>

      {/* ── Document ── */}
      <div className="py-8 px-4 print:p-0">
        <div
          className="mx-auto max-w-[780px] bg-[#F5EFE4] print:max-w-none print:shadow-none"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

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
          <span className="mt-[7px] w-1 h-1 rounded-full bg-gray-700 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LabelRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-0.5">{label}</p>
      <p className="text-[13px] font-semibold text-gray-800">{value}</p>
    </div>
  );
}
