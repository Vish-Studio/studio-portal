import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import Layout from '../../components/common/layout/layout';
import { RowActionsMenu } from '../../components/common/table/table';
import TableTab, { type TabItem } from '../../components/common/table-tab/table-tab';
import FormSidebar, { FormSidebarFooter } from '../../components/common/form-sidebar/form-sidebar';
import FormField, { inputCls } from '../../components/common/form-field/form-field';
import Select from '../../components/common/select/select';
import Option from '../../components/common/select/option';
import Fab from '../../components/common/button-fab/button-fab';
import { ClientStatusBadge } from '../../components/common/status-badge/status-badge';
import { useClientsStore } from '../../store/clients';
import { useUIStore } from '../../store/ui';
import type { Client, ClientStatus } from '../../store/clients';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'active' | 'inactive' | 'lost';
type SortKey = 'name' | 'newest';

interface ClientFormValues {
  displayName: string;
  companyName: string;
  email: string;
  phone: string;
  status: ClientStatus;
}

// ─── Clients Page ─────────────────────────────────────────────────────────────

export default function Clients() {
  const navigate = useNavigate();
  const { clients, addClient, updateClient, removeClient } = useClientsStore();
  const { searchQuery } = useUIStore();

  const [activeTab, setActiveTab] = useState<FilterKey>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ClientFormValues>({
    defaultValues: { displayName: '', companyName: '', email: '', phone: '', status: 'active' },
  });

  // ── Tab counts ──
  const tabCounts = useMemo(() => ({
    all: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
    lost: clients.filter(c => c.status === 'lost').length,
  }), [clients]);

  const tabs: TabItem[] = [
    { key: 'all', label: 'All', count: tabCounts.all },
    { key: 'active', label: 'Active', count: tabCounts.active },
    { key: 'inactive', label: 'Inactive', count: tabCounts.inactive },
    { key: 'lost', label: 'Lost', count: tabCounts.lost },
  ];

  // ── Filtered rows — tab first, then global search ──
  const filtered = useMemo(() => {
    let list = clients;
    if (activeTab !== 'all') list = list.filter(c => c.status === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.displayName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.companyName ?? '').toLowerCase().includes(q) ||
        (c.phone ?? '').includes(q),
      );
    }
    return [...list].sort((a, b) => {
      const result = sortKey === 'newest'
        ? a.createdAt.toMillis() - b.createdAt.toMillis()
        : a.displayName.localeCompare(b.displayName, undefined, { sensitivity: 'base' });

      return sortDirection === 'asc' ? result : -result;
    });
  }, [clients, activeTab, searchQuery, sortKey, sortDirection]);

  // ── Sidebar helpers ──
  const openAdd = () => {
    setEditingClient(null);
    reset({ displayName: '', companyName: '', email: '', phone: '', status: 'active' });
    setSidebarOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    reset({
      displayName: client.displayName,
      companyName: client.companyName ?? '',
      email: client.email,
      phone: client.phone ?? '',
      status: client.status,
    });
    setSidebarOpen(true);
  };

  const onSubmit = (data: ClientFormValues) => {
    if (editingClient) {
      updateClient(editingClient.id, data);
    } else {
      const now = { toMillis: () => Date.now(), toDate: () => new Date() };
      addClient({ id: 'c_' + Date.now(), role: 'client', createdAt: now, ...data });
    }
    setSidebarOpen(false);
  };

  const handleDelete = (client: Client) => {
    if (confirm(`Remove ${client.displayName}?`)) removeClient(client.id);
  };

  return (
    <Layout title="Clients">
      <div className="flex flex-col gap-3 w-full mx-auto py-6 md:py-10">
        <div className="sticky top-0 z-20 -mx-4 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <TableTab
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={key => setActiveTab(key as FilterKey)}
            sortValue={sortKey}
            sortOptions={[
              { key: 'name', label: 'Name' },
              { key: 'newest', label: 'Date created' },
            ]}
            onSortChange={key => setSortKey(key as SortKey)}
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
            actionLabel="Add Client"
            onAction={openAdd}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[18px] border border-gray-100 bg-white py-16 text-center">
            <p className="text-sm font-semibold text-gray-500">
              {searchQuery ? `No clients match "${searchQuery}".` : 'No clients yet.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="hidden grid-cols-[minmax(220px,1fr)_minmax(170px,0.7fr)_120px_110px_32px] items-center gap-3 px-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400 md:grid">
              <span>Client</span>
              <span>Contact</span>
              <span>Created</span>
              <span className="text-right">Status</span>
              <span />
            </div>

            {filtered.map(client => {
              const circleBg: Record<ClientStatus, string> = { active: 'bg-green-500', inactive: 'bg-amber-400', lost: 'bg-red-400' };

              return (
                <div
                  key={client.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/admin/clients/${client.id}`)}
                  onKeyDown={event => { if (event.key === 'Enter') navigate(`/admin/clients/${client.id}`); }}
                  className="grid gap-3 rounded-[18px] border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 cursor-pointer md:grid-cols-[minmax(220px,1fr)_minmax(170px,0.7fr)_120px_110px_32px] md:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${circleBg[client.status]} text-sm font-bold text-white`}>
                      {client.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-(--color-ink)">{client.displayName}</p>
                      <p className="truncate text-xs font-medium text-gray-400">{client.companyName || 'No company'}</p>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-gray-600">{client.email}</p>
                    <p className="mt-0.5 truncate text-xs font-medium text-gray-400">{client.phone || 'No phone'}</p>
                  </div>

                  <span className="text-xs font-semibold text-gray-400">
                    {client.createdAt?.toDate ? format(client.createdAt.toDate(), 'MMM d, yyyy') : '—'}
                  </span>

                  <div className="flex items-center justify-between gap-3 md:justify-end">
                    <ClientStatusBadge status={client.status} />
                    <div onClick={event => event.stopPropagation()}>
                      <RowActionsMenu
                        actions={[
                          { label: 'Edit client', icon: <Pencil size={14} />, onClick: () => openEdit(client) },
                          { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => handleDelete(client), variant: 'danger' },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <Fab onClick={openAdd} ariaLabel="Add client" />

      {/* Client Form Sidebar */}
      <FormSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={editingClient ? 'Edit Client' : 'New Client'}
        description={
          editingClient
            ? `Editing ${editingClient.displayName}`
            : 'Fill in the details below to add a new client.'
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

            <FormField label="Full Name" required error={errors.displayName?.message}>
              <input
                {...register('displayName', { required: 'Name is required' })}
                placeholder="e.g. Sarah Mitchell"
                className={inputCls(!!errors.displayName)}
              />
            </FormField>

            <FormField label="Company Name" error={errors.companyName?.message}>
              <input
                {...register('companyName')}
                placeholder="e.g. Acme Corp"
                className={inputCls(!!errors.companyName)}
              />
            </FormField>

            <FormField label="Email Address" required error={errors.email?.message}>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                })}
                type="email"
                placeholder="hello@company.com"
                className={inputCls(!!errors.email)}
              />
            </FormField>

            <FormField label="Phone Number" error={errors.phone?.message}>
              <input
                {...register('phone', {
                  pattern: { value: /^[+\d\s\-()+.]{7,20}$/, message: 'Enter a valid phone number' },
                })}
                type="tel"
                placeholder="+1 (555) 000-0000"
                className={inputCls(!!errors.phone)}
              />
            </FormField>

            <FormField label="Status" required error={errors.status?.message}>
              <Select
                {...register('status', { required: 'Status is required' })}
                hasError={!!errors.status}
              >
                <Option value="active">Active — recurring client</Option>
                <Option value="inactive">Inactive — no longer active</Option>
                <Option value="lost">Lost — churned</Option>
              </Select>
            </FormField>

          </div>

          <FormSidebarFooter>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-black hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50"
            >
              {editingClient ? 'Save Changes' : 'Add Client'}
            </button>
          </FormSidebarFooter>
        </form>
      </FormSidebar>
    </Layout>
  );
}
