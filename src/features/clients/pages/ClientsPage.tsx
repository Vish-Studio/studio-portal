import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserCheck, UserMinus, UserRoundX, Users } from '@/src/shared/components/material-icon/material-lucide-icons';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import TableTab, { type TabItem } from '@/src/shared/components/table-tab/table-tab';
import FormSidebar, { FormSidebarActions } from '@/src/shared/components/form-sidebar/form-sidebar';
import Fab from '@/src/shared/components/button-fab/button-fab';
import StatCard from '@/src/shared/components/stat-card/stat-card';
import { Button, Checkbox, ConfirmDialog, FormField, Option, Select, TextInput } from '@/src/shared/components';
import { useClientsStore } from '../stores/clientStore';
import { useUIStore } from '@/src/app/stores/uiStore';
import type { Client, ClientStatus } from '../types';
import ClientListItem from '../components/client-list-item/client-list-item';
import { generateTemporaryPassword } from '@/src/lib/temporary-password';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'active' | 'inactive' | 'lost';
type SortKey = 'name' | 'newest';

interface ClientFormValues {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  status: ClientStatus;
  generatePassword: boolean;
  temporaryPassword: string;
}

interface TemporaryAccess {
  name: string;
  email: string;
  temporaryPassword: string;
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
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  const [temporaryAccess, setTemporaryAccess] = useState<TemporaryAccess | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ClientFormValues>({
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      status: 'active',
      generatePassword: true,
      temporaryPassword: generateTemporaryPassword(),
    },
  });
  const generatePassword = watch('generatePassword');

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
    setTemporaryAccess(null);
    setSubmitError(null);
    reset({
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      status: 'active',
      generatePassword: true,
      temporaryPassword: generateTemporaryPassword(),
    });
    setSidebarOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setTemporaryAccess(null);
    setSubmitError(null);
    reset({
      fullName: client.fullName,
      companyName: client.companyName ?? '',
      email: client.email,
      phone: client.phone ?? '',
      status: client.status,
      generatePassword: false,
      temporaryPassword: '',
    });
    setSidebarOpen(true);
  };

  const onSubmit = async (data: ClientFormValues) => {
    setSubmitError(null);
    try {
      if (editingClient) {
        await updateClient(editingClient.id, data);
        setSidebarOpen(false);
      } else {
        const result = await addClient(data);
        if (result) {
          setTemporaryAccess({
            name: data.fullName,
            email: result.email,
            temporaryPassword: result.temporaryPassword,
          });
          reset({
            fullName: '',
            companyName: '',
            email: '',
            phone: '',
            status: 'active',
            generatePassword: true,
            temporaryPassword: generateTemporaryPassword(),
          });
        }
      }
    } catch (err: unknown) {
      setSubmitError((err as Error).message ?? 'Something went wrong. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!deleteClient) return;
    await removeClient(deleteClient.id);
    setDeleteClient(null);
  };

  return (
    <DashboardLayout title="Clients">
      <div className="flex flex-col gap-3 w-full mx-auto py-6 md:py-10">
        <div className="clients-stats grid gap-3 grid-cols-2 xl:grid-cols-4">
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
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map(client => (
              <ClientListItem
                key={client.id}
                client={client}
                onOpen={item => navigate(`/admin/clients/${item.id}`)}
                onEdit={openEdit}
                onDelete={setDeleteClient}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <Fab onClick={openAdd} ariaLabel="Add client" />

      {/* Client Form Sidebar */}
      <FormSidebar
        isOpen={sidebarOpen}
        onClose={() => {
          setSidebarOpen(false);
          setTemporaryAccess(null);
        }}
        title={editingClient ? 'Edit Client' : 'New Client'}
        description={
          editingClient
            ? `Editing ${editingClient.fullName}`
            : 'Fill in the details below to add a new client.'
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {submitError && (
              <div className="rounded-[16px] border border-red-100 bg-red-50 px-4 py-3">
                <p className="type-label font-semibold text-red-700">Failed to create client</p>
                <p className="type-muted mt-1 text-red-600">{submitError}</p>
              </div>
            )}

            {temporaryAccess ? (
              <div className="clients-temporary-access rounded-[18px] border border-green-100 bg-green-50 p-4">
                <p className="type-card-title text-green-700">Client login created</p>
                <p className="type-muted mt-1 text-green-700/70">
                  Share this temporary password with {temporaryAccess.name}. They can sign in and change it from settings.
                </p>
                <div className="clients-temporary-access-details mt-4 rounded-[14px] bg-white p-3">
                  <p className="type-label text-gray-400">Email</p>
                  <p className="type-card-title mt-1 break-all text-(--color-ink)">{temporaryAccess.email}</p>
                  <p className="type-label mt-3 text-gray-400">Temporary password</p>
                  <p className="type-card-title mt-1 break-all text-(--color-ink)">{temporaryAccess.temporaryPassword}</p>
                </div>
                <Button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(`${temporaryAccess.email}\n${temporaryAccess.temporaryPassword}`)}
                  className="clients-temporary-access-copy mt-3 w-full"
                >
                  Copy login details
                </Button>
              </div>
            ) : null}

            <FormField label="Full Name" required error={errors.fullName?.message}>
              <TextInput
                {...register('fullName', { required: 'Name is required' })}
                placeholder="e.g. Sarah Mitchell"
                hasError={!!errors.fullName}
              />
            </FormField>

            <FormField label="Company Name" error={errors.companyName?.message}>
              <TextInput
                {...register('companyName')}
                placeholder="e.g. Acme Corp"
                hasError={!!errors.companyName}
              />
            </FormField>

            <FormField label="Email Address" required error={errors.email?.message}>
              <TextInput
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                })}
                type="email"
                placeholder="hello@company.com"
                hasError={!!errors.email}
              />
            </FormField>

            <FormField label="Phone Number" error={errors.phone?.message}>
              <TextInput
                {...register('phone', {
                  pattern: { value: /^[+\d\s\-()+.]{7,20}$/, message: 'Enter a valid phone number' },
                })}
                type="tel"
                placeholder="+1 (555) 000-0000"
                hasError={!!errors.phone}
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

            {!editingClient ? (
              <div className="clients-password-section rounded-[18px] border border-gray-100 bg-(--color-surface-alt) p-4">
                <label className="clients-password-toggle flex items-center gap-3">
                  <Checkbox {...register('generatePassword')} />
                  <span className="type-card-title text-(--color-ink)">Generate temporary password</span>
                </label>
                <div className="clients-password-field mt-4">
                  <FormField label="Temporary Password" required error={errors.temporaryPassword?.message}>
                    <div className="clients-password-row flex gap-2">
                      <TextInput
                        {...register('temporaryPassword', {
                          required: 'Temporary password is required',
                          minLength: { value: 6, message: 'Password must be at least 6 characters' },
                        })}
                        type="text"
                        readOnly={generatePassword}
                        hasError={!!errors.temporaryPassword}
                        className={generatePassword ? 'bg-white text-gray-500' : ''}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setValue('temporaryPassword', generateTemporaryPassword(), { shouldDirty: true, shouldValidate: true })}
                        className="clients-password-generate"
                      >
                        Generate
                      </Button>
                    </div>
                  </FormField>
                </div>
              </div>
            ) : null}

          </div>

          <FormSidebarActions
            onCancel={() => setSidebarOpen(false)}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
            submitLabel={editingClient ? 'Save Changes' : 'Add Client'}
          />
        </form>
      </FormSidebar>

      <ConfirmDialog
        isOpen={!!deleteClient}
        title="Remove client?"
        message={deleteClient ? `Remove ${deleteClient.fullName}? This cannot be undone.` : ''}
        confirmLabel="Remove Client"
        onConfirm={handleDelete}
        onCancel={() => setDeleteClient(null)}
      />
    </DashboardLayout>
  );
}
