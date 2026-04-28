import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import Layout from '../../components/common/layout/layout';
import TableData, { RowActions, type Column } from '../../components/common/table/table';
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
    return list;
  }, [clients, activeTab, searchQuery]);

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

  // ── Table columns ──
  const columns: Column<Client>[] = [
    {
      key: 'displayName',
      label: 'Name',
      render: row => {
        const circleBg: Record<string, string> = { active: 'bg-green-500', inactive: 'bg-amber-400', lost: 'bg-red-400' };
        return (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${circleBg[row.status] ?? 'bg-gray-400'} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
              {row.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{row.displayName}</p>
              <p className="text-[11px] text-gray-400 font-mono truncate">{row.id}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'companyName',
      label: 'Company',
      hideBelow: 'md',
      render: row => <span className="text-sm text-gray-600">{row.companyName || '—'}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      hideBelow: 'lg',
      render: row => <span className="text-sm text-gray-500">{row.email}</span>,
    },
    {
      key: 'phone',
      label: 'Phone',
      hideBelow: 'lg',
      render: row => <span className="text-sm text-gray-500">{row.phone || '—'}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created',
      hideBelow: 'md',
      render: row => (
        <span className="text-sm text-gray-400 tabular-nums">
          {row.createdAt?.toDate ? format(row.createdAt.toDate(), 'MMM d, yyyy') : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: row => <ClientStatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      width: 'w-10 md:w-auto',
      render: row => (
        <RowActions
          actions={[
            { label: 'View client', icon: <ExternalLink size={14} />, onClick: () => navigate(`/admin/clients/${row.id}`) },
            { label: 'Edit client', icon: <Pencil size={14} />, onClick: () => openEdit(row) },
            { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => handleDelete(row), variant: 'danger' },
          ]}
        />
      ),
    },
  ];

  return (
    <Layout title="Clients" fullHeight>
      <div className="flex-1 min-h-0 flex flex-col gap-3 w-full mx-auto pb-6">
        <TableTab
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={key => setActiveTab(key as FilterKey)}
          actionLabel="Add Client"
          onAction={openAdd}
        />

        <div className="flex-1 min-h-0">
          <TableData<Client>
            columns={columns}
            data={filtered}
            className="h-full"
            emptyMessage={searchQuery ? `No clients match "${searchQuery}".` : 'No clients yet.'}
            onRowClick={row => navigate(`/admin/clients/${row.id}`)}
          />
        </div>
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
