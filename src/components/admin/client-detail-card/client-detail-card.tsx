import { Briefcase, Building2, Mail, Phone, TrendingUp } from "lucide-react";
import { FunctionComponent } from "react";
import { ClientStatusBadge } from "../../status-badge/status-badge";
import { DEMO_PROJECTS } from "@/src/data/projects";
import { format } from "date-fns";
import { Client } from "@/src/store/clients";

interface Props {
  className?: string;
  client: Client;
}


const ClientDetailCard: FunctionComponent<Props> = ({
  className = '',
  client,
}) => {
  const avatarColors = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500'];
  const avatarBg = avatarColors[client.displayName.charCodeAt(0) % avatarColors.length];

  const projects = DEMO_PROJECTS.filter(p => p.clientId === client.id);
  const activeCount = projects.filter(p => p.status === 'active').length;
  const totalAgreed = projects.reduce((s, p) => s + p.agreedPayment, 0);
  const totalPaid = projects.reduce((s, p) => s + p.paidPayment, 0);
  const totalRemaining = totalAgreed - totalPaid;

  return (
    <div className={`client-detail-card bg-(--color-ink) rounded-[28px] overflow-hidden ${className}`}>
      {/* Hero section */}
      <div className="relative px-6 pt-7 pb-6 overflow-hidden">
        {/* Decorative glow */}
        <div
          className="absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'var(--color-accent-lime)' }}
        />

        {/* Avatar */}
        <div className={`w-14 h-14 rounded-2xl ${avatarBg} flex items-center justify-center text-2xl font-black text-white mb-4 shadow-lg`}>
          {client.displayName.charAt(0).toUpperCase()}
        </div>

        <h2 className="text-xl font-bold text-white leading-tight">{client.displayName}</h2>
        {client.companyName && (
          <p className="text-sm text-gray-400 mt-0.5">{client.companyName}</p>
        )}
        <div className="mt-2.5">
          <ClientStatusBadge status={client.status} />
        </div>
        <p className="text-[11px] text-gray-600 mt-3">
          Client since {client.createdAt ? format(client.createdAt instanceof Date ? client.createdAt : client.createdAt.toDate(), 'MMM d, yyyy') : '—'}
        </p>
      </div>

      {/* Contact info */}
      <div className="border-t px-6 py-4 space-y-3" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <Mail size={12} className="text-gray-400" />
          </div>
          <span className="text-sm text-gray-300 truncate">{client.email}</span>
        </div>
        {client.phone && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <Phone size={12} className="text-gray-400" />
            </div>
            <span className="text-sm text-gray-300">{client.phone}</span>
          </div>
        )}
        {client.companyName && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <Building2 size={12} className="text-gray-400" />
            </div>
            <span className="text-sm text-gray-300 truncate">{client.companyName}</span>
          </div>
        )}
      </div>

      {/* Quick stats grid */}
      <div className="border-t px-6 py-4 grid grid-cols-2 gap-3" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="rounded-[16px] p-3.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Briefcase size={11} className="text-gray-500" />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Projects</p>
          </div>
          <p className="text-2xl font-black text-white leading-none">{projects.length}</p>
          <p className="text-[10px] text-gray-500 mt-1">{activeCount} active</p>
        </div>
        <div className="rounded-[16px] p-3.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingUp size={11} className="text-gray-500" />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Value</p>
          </div>
          <p className="text-2xl font-black leading-none" style={{ color: 'var(--color-accent-lime)' }}>
            ${(totalAgreed / 1000).toFixed(0)}k
          </p>
          <p className="text-[10px] text-gray-500 mt-1">${totalPaid.toLocaleString()} paid</p>
        </div>
      </div>

      {/* Balance footer */}
      {totalRemaining > 0 && (
        <div className="border-t px-6 py-3.5 flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <span className="text-xs text-gray-500">Outstanding balance</span>
          <span className="text-sm font-bold text-amber-400">${totalRemaining.toLocaleString()}</span>
        </div>
      )}
    </div>
  )
}

export default ClientDetailCard;
ClientDetailCard.displayName = "ClientDetailCard";