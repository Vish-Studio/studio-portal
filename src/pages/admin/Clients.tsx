import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Pencil, Trash2, UserCheck, UserMinus, UserRoundX, Users } from 'lucide-react';
import Layout from '../../components/common/layout/layout';
import { RowActionsMenu } from '../../components/common/table/table';
import TableTab, { type TabItem } from '../../components/common/table-tab/table-tab';
import FormSidebar, { FormSidebarFooter } from '../../components/common/form-sidebar/form-sidebar';
import FormField, { inputCls } from '../../components/common/form-field/form-field';
import Select from '../../components/common/select/select';
import Option from '../../components/common/select/option';
import Fab from '../../components/common/button-fab/button-fab';
import Button from '../../components/common/button/button';
import StatCard from '../../components/common/stat-card/stat-card';
import { ClientStatusBadge } from '../../components/common/status-badge/status-badge';
import { useClientsStore } from '../../store/clients';
import { useUIStore } from '../../store/ui';
import type { Client, ClientStatus } from '../../store/clients';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'active' | 'inactive' | 'lost';
type SortKey = 'name' | 'newest';

interface ClientFormValues {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  status: ClientStatus;
}

// ─── Clients Page ─────────────────────────────────────────────────────────────

export default function Clients() {
  const navigate = useNavigate();
  const {
    clients,
    loading,
    error,
    subscribeClients,
    addClient,
    updateClient,
    removeClient,
  } = useClientsStore();
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
    defaultValues: { fullName: '', companyName: '', email: '', phone: '', status: 'active' },
  });

  useEffect(() => subscribeClients(), [subscribeClients]);

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
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.companyName ?? '').toLowerCase().includes(q) ||
        (c.phone ?? '').includes(q),
      );
    }
    return [...list].sort((a, b) => {
      const result = sortKey === 'newest'
        ? (a.createdAt?.toMillis() ?? 0) - (b.createdAt?.toMillis() ?? 0)
        : a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' });

      return sortDirection === 'asc' ? result : -result;
    });
  }, [clients, activeTab, searchQuery, sortKey, sortDirection]);

  // ── Sidebar helpers ──
  const openAdd = () => {
    setEditingClient(null);
    reset({ fullName: '', companyName: '', email: '', phone: '', status: 'active' });
    setSidebarOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    reset({
      fullName: client.fullName,
      companyName: client.companyName ?? '',
      email: client.email,
      phone: client.phone ?? '',
      status: client.status,
    });
    setSidebarOpen(true);
  };

  const onSubmit = async (data: ClientFormValues) => {
    if (editingClient) {
      await updateClient(editingClient.id, data);
    } else {
      await addClient(data);
    }
    setSidebarOpen(false);
  };

  const handleDelete = async (client: Client) => {
    if (confirm(`Remove ${client.fullName}?`)) await removeClient(client.id);
  };

  return (
    <Layout title="Clients">
      <div className="flex flex-col gap-3 w-full mx-auto py-6 md:py-10">
        <div className="clients-stats grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            size="sm"
            variant="lime"
            icon={<Users size={17} />}
            label="Total Clients"
            value={tabCounts.all}
            badge={`${tabCounts.active} active`}
            badgeLabel="in CRM"
          />
          <StatCard
            size="sm"
            variant="surface"
            icon={<UserCheck size={17} />}
            label="Active"
            value={tabCounts.active}
            badge="Active"
            badgeLabel="current clients"
          />
          <StatCard
            size="sm"
            variant="white"
            icon={<UserMinus size={17} />}
            label="Inactive"
            value={tabCounts.inactive}
            badge="Inactive"
            badgeLabel="on pause"
          />
          <StatCard
            size="sm"
            variant="dark"
            icon={<UserRoundX size={17} />}
            label="Lost"
            value={tabCounts.lost}
            badge="Lost"
            badgeLabel="closed leads"
          />
        </div>

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

        {error && (
          <div className="clients-error rounded-[16px] border border-red-100 bg-red-50 px-4 py-3">
            <p className="type-label text-red-600">{error}</p>
          </div>
        )}

        {loading && filtered.length === 0 ? (
          <div className="clients-loading rounded-[18px] border border-gray-100 bg-white py-16 text-center">
            <p className="type-card-title text-gray-500">Loading clients...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[18px] border border-gray-100 bg-white py-16 text-center">
            <p className="type-card-title text-gray-500">
              {searchQuery ? `No clients match "${searchQuery}".` : 'No clients yet.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="type-eyebrow hidden grid-cols-[minmax(220px,1fr)_minmax(170px,0.7fr)_120px_110px_32px] items-center gap-3 px-4 text-gray-400 md:grid">
              <span>Client</span>
              <span>Contact</span>
              <span>Created</span>
              <span className="text-right">Status</span>
            </div>

            {filtered.map(client => {
              const circleBg: Record<ClientStatus, string> = { active: 'bg-green', inactive: 'bg-amber-400', lost: 'bg-red-400' };

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
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${circleBg[client.status]} text-xs font-bold text-white`}>
                      {client.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="type-card-title truncate text-(--color-ink)">{client.fullName}</p>
                      <p className="type-muted truncate text-gray-400">{client.companyName || 'No company'}</p>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="type-label truncate text-gray-600">{client.email}</p>
                    <p className="type-muted mt-0.5 truncate text-gray-400">{client.phone || 'No phone'}</p>
                  </div>

                  <span className="type-label text-gray-400">
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
            ? `Editing ${editingClient.fullName}`
            : 'Fill in the details below to add a new client.'
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

            <FormField label="Full Name" required error={errors.fullName?.message}>
              <input
                {...register('fullName', { required: 'Name is required' })}
                placeholder="e.g. Sarah Mitchell"
                className={inputCls(!!errors.fullName)}
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
            <Button
              type="button"
              onClick={() => setSidebarOpen(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex-1"
            >
              {editingClient ? 'Save Changes' : 'Add Client'}
            </Button>
          </FormSidebarFooter>
        </form>
      </FormSidebar>
    </Layout>
  );
}
