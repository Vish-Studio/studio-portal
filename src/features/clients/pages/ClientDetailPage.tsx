import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Briefcase, Pencil } from '@/src/shared/components/material-icon/material-lucide-icons';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import FormSidebar, { FormSidebarActions, FormSidebarError, getFormErrorMessage } from '@/src/shared/components/form-sidebar/form-sidebar';
import { ProjectCard } from '@/src/features/projects';
import ClientDetailCard from '../components/client-detail-card/client-detail-card';
import { useClientsStore } from '../stores/clientStore';
import type { ClientStatus } from '../types';
import { useTeamStore } from '@/src/features/team';
import { useProjectsStore } from '@/src/features/projects';
import Fab from '@/src/shared/components/button-fab/button-fab';
import { Breadcrumb, Button, FormField, Option, Select, TextInput } from '@/src/shared/components';
import { useUIStore } from '@/src/app/stores/uiStore';
import { FEEDBACK_MESSAGES } from '@/src/app/messages';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClientFormValues {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  location: string;
  companySize: string;
  status: ClientStatus;
}

// ─── Client Detail Page ───────────────────────────────────────────────────────

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { clients, subscribeClients, updateClient } = useClientsStore();
  const showToast = useUIStore(state => state.showToast);
  const { projects: allProjects } = useProjectsStore();
  const { members } = useTeamStore();
  const client = clients.find(c => c.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => subscribeClients(), [subscribeClients]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ClientFormValues>({
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      website: '',
      industry: '',
      location: '',
      companySize: '',
      status: 'active',
    },
  });

  const watchedClientForm = watch();
  const hasClientChanges = !!client && isEditing && (
    watchedClientForm.fullName !== client.fullName ||
    watchedClientForm.companyName !== (client.companyName ?? '') ||
    watchedClientForm.email !== client.email ||
    watchedClientForm.phone !== (client.phone ?? '') ||
    watchedClientForm.website !== (client.website ?? '') ||
    watchedClientForm.industry !== (client.industry ?? '') ||
    watchedClientForm.location !== (client.location ?? '') ||
    watchedClientForm.companySize !== (client.companySize ?? '') ||
    watchedClientForm.status !== client.status
  );

  useEffect(() => {
    if (!client || isEditing) return;
    reset({
      fullName: client.fullName,
      companyName: client.companyName ?? '',
      email: client.email,
      phone: client.phone ?? '',
      website: client.website ?? '',
      industry: client.industry ?? '',
      location: client.location ?? '',
      companySize: client.companySize ?? '',
      status: client.status,
    });
  }, [client, isEditing, reset]);

  const onSubmit = async (data: ClientFormValues) => {
    if (!client) return;
    setSubmitError(null);
    try {
      await updateClient(client.id, data);
      reset(data);
      setIsEditing(false);
      setEditSidebarOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : FEEDBACK_MESSAGES.sidebar.clientUpdateToast;
      setSubmitError(message);
      showToast({ status: 'error', title: FEEDBACK_MESSAGES.sidebar.clientUpdateToast, message });
    }
  };

  const onInvalidSubmit = (invalidErrors: unknown) => {
    setSubmitError(getFormErrorMessage(invalidErrors as Record<string, unknown>));
  };

  const handleCancel = () => {
    reset({
      fullName: client?.fullName ?? '',
      companyName: client?.companyName ?? '',
      email: client?.email ?? '',
      phone: client?.phone ?? '',
      website: client?.website ?? '',
      industry: client?.industry ?? '',
      location: client?.location ?? '',
      companySize: client?.companySize ?? '',
      status: client?.status ?? 'active',
    });
    setIsEditing(false);
    setEditSidebarOpen(false);
    setSubmitError(null);
  };

  const openEdit = () => {
    reset({
      fullName: client.fullName,
      companyName: client.companyName ?? '',
      email: client.email,
      phone: client.phone ?? '',
      website: client.website ?? '',
      industry: client.industry ?? '',
      location: client.location ?? '',
      companySize: client.companySize ?? '',
      status: client.status,
    });
    setIsEditing(true);
    setSubmitError(null);
    setEditSidebarOpen(true);
  };

  const openMobileEdit = () => {
    reset({
      fullName: client?.fullName ?? '',
      companyName: client?.companyName ?? '',
      email: client?.email ?? '',
      phone: client?.phone ?? '',
      website: client?.website ?? '',
      industry: client?.industry ?? '',
      location: client?.location ?? '',
      companySize: client?.companySize ?? '',
      status: client?.status ?? 'active',
    });
    setIsEditing(true);
    setSubmitError(null);
    setEditSidebarOpen(true);
  };

  // ── Not found ──
  if (!client) {
    return (
      <DashboardLayout title="Client">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 rounded-full bg-(--color-surface) flex items-center justify-center">
            <Briefcase size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Client not found.</p>
          <Link to="/admin/clients" className="text-sm font-semibold text-gray-900 underline underline-offset-4">
            Back to Clients
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const projects = allProjects.filter(p => p.clientId === id);
  const activeCount = projects.filter(p => p.status === 'active').length;
  const totalAgreed = projects.reduce((s, p) => s + p.agreedPayment, 0);
  const totalPaid = projects.reduce((s, p) => s + p.paidPayment, 0);
  const totalRemaining = totalAgreed - totalPaid;
  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col gap-4 md:gap-7">
        <Breadcrumb
          previousLink="/admin/clients"
          previousPageName="Clients"
          currentPageName={client.fullName}
          action={
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={openEdit}
              iconLeft={<Pencil size={14} />}
              className="hidden md:inline-flex"
            >
              Edit client
            </Button>
          }
        />

        <ClientDetailCard client={client} projects={projects} />


        {/* Projects detail*/}
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-1">
          <div className="lg-col-span-2">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-(--color-ink)">Projects</h2>
                <p className="text-xs font-medium text-gray-400">
                  {projects.length} project{projects.length !== 1 ? 's' : ''} · {activeCount} active
                </p>
              </div>
              {projects.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                    ${totalPaid.toLocaleString()} collected
                  </span>
                  {totalRemaining > 0 && (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600">
                      ${totalRemaining.toLocaleString()} outstanding
                    </span>
                  )}
                </div>
              )}
            </div>

            {projects.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-[18px] p-14 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-(--color-surface) flex items-center justify-center">
                  <Briefcase size={20} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-500">No projects yet</p>
                <p className="text-xs text-gray-400">
                  Projects for {client.fullName} will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} allMembers={members} variant="surface" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Fab icon={Pencil} ariaLabel="Edit client" onClick={openMobileEdit} className="md:hidden" />

      {editSidebarOpen && (
        <FormSidebar
          isOpen={editSidebarOpen}
          onClose={handleCancel}
          title="Edit Client"
          description={client.fullName}
        >
          <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="client-detail-sidebar-form flex min-h-0 flex-1 flex-col">
            <div className="client-detail-sidebar-fields flex-1 space-y-5 overflow-y-auto px-6 py-6">
              <FormSidebarError title={FEEDBACK_MESSAGES.sidebar.clientUpdateFailed} message={submitError} />

              <FormField label="Full Name" required error={errors.fullName?.message}>
                <TextInput
                  {...register('fullName', { required: 'Name is required' })}
                  hasError={!!errors.fullName}
                />
              </FormField>

              <FormField label="Company Name" error={errors.companyName?.message}>
                <TextInput {...register('companyName')} hasError={!!errors.companyName} />
              </FormField>

              <FormField label="Email Address" required error={errors.email?.message}>
                <TextInput
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                  hasError={!!errors.email}
                />
              </FormField>

              <FormField label="Phone Number" error={errors.phone?.message}>
                <TextInput
                  type="tel"
                  {...register('phone', {
                    pattern: { value: /^[+\d\s\-()+.]{7,20}$/, message: 'Enter a valid phone number' },
                  })}
                  hasError={!!errors.phone}
                />
              </FormField>

              <FormField label="Website" error={errors.website?.message}>
                <TextInput type="url" {...register('website')} hasError={!!errors.website} />
              </FormField>

              <FormField label="Industry" error={errors.industry?.message}>
                <TextInput {...register('industry')} hasError={!!errors.industry} />
              </FormField>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField label="Location" error={errors.location?.message}>
                  <TextInput {...register('location')} hasError={!!errors.location} />
                </FormField>
                <FormField label="Company Size" error={errors.companySize?.message}>
                  <TextInput {...register('companySize')} hasError={!!errors.companySize} />
                </FormField>
              </div>

              <FormField label="Status" required error={errors.status?.message}>
                <Select {...register('status', { required: true })} hasError={!!errors.status}>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="lost">Lost</Option>
                </Select>
              </FormField>
            </div>

            <FormSidebarActions
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              isDirty={isDirty || hasClientChanges}
              submitLabel="Save"
            />
          </form>
        </FormSidebar>
      )}
    </DashboardLayout>
  );
};

export default ClientDetail;
