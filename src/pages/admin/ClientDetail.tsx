import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ArrowLeft, Briefcase } from 'lucide-react';
import Layout from '../../components/layout/layout';
import CardContent from '../../components/card-content/card-content';
import FormField, { inputCls, selectCls } from '../../components/form-field/form-field';
import MaterialIcon from '../../components/ui/material-icon';
import ProjectCard from '../../components/project-card/project-card';
import ClientDetailCard from '../../components/admin/client-detail-card/client-detail-card';
import { useClientsStore } from '../../store/clients';
import type { ClientStatus } from '../../store/clients';
import { useTeamStore } from '../../store/team';
import { useProjectsStore } from '../../store/projects';
import Breadcrumb from '@/src/components/breadcrumb/breadcrumb';
import ButtonIcon from '@/src/components/button-icon/button-icon';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClientFormValues {
  displayName: string;
  companyName: string;
  email: string;
  phone: string;
  status: ClientStatus;
}

// ─── Disabled-aware input class ───────────────────────────────────────────────

const fieldCls = (hasError: boolean) =>
  inputCls(hasError) +
  ' disabled:bg-transparent disabled:border-transparent disabled:px-0 disabled:py-1 disabled:cursor-default disabled:text-gray-900 disabled:shadow-none disabled:focus:ring-0 disabled:focus:bg-transparent';

const fieldSelectCls = (hasError: boolean) =>
  selectCls(hasError) +
  ' disabled:bg-transparent disabled:border-transparent disabled:px-0 disabled:py-1 disabled:cursor-default disabled:text-gray-900 disabled:appearance-none disabled:shadow-none disabled:focus:ring-0';

// ─── Client Detail Page ───────────────────────────────────────────────────────

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { clients, updateClient } = useClientsStore();
  const { projects: allProjects } = useProjectsStore();
  const { members } = useTeamStore();
  const client = clients.find(c => c.id === id);

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ClientFormValues>({
    values: client
      ? {
        displayName: client.displayName,
        companyName: client.companyName ?? '',
        email: client.email,
        phone: client.phone ?? '',
        status: client.status,
      }
      : undefined,
  });

  const onSubmit = (data: ClientFormValues) => {
    if (!client) return;
    updateClient(client.id, data);
    reset(data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  // ── Not found ──
  if (!client) {
    return (
      <Layout title="Client">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 rounded-full bg-(--color-surface) flex items-center justify-center">
            <Briefcase size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Client not found.</p>
          <Link to="/admin/clients" className="text-sm font-semibold text-gray-900 underline underline-offset-4">
            Back to Clients
          </Link>
        </div>
      </Layout>
    );
  }

  const projects      = allProjects.filter(p => p.clientId === id);
  const activeCount   = projects.filter(p => p.status === 'active').length;
  const totalAgreed   = projects.reduce((s, p) => s + p.agreedPayment, 0);
  const totalPaid     = projects.reduce((s, p) => s + p.paidPayment, 0);
  const totalRemaining = totalAgreed - totalPaid;

  return (
    <Layout>
      <div className="flex-1 flex flex-col gap-4 md:gap-10">
        <Breadcrumb
          previousLink="/admin/clients"
          previousPageName="Clients"
          currentPageName={client.displayName} />

        {/* Client detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ">
          <ClientDetailCard client={client} />

          <CardContent
            iconName="manage_accounts"
            title="Client Details"
            variant="white"
            action={
              isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-[12px] font-semibold text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    form="client-edit-form"
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="text-[12px] font-semibold text-white bg-(--color-ink) hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {isSubmitting ? 'Saving…' : 'Save'}
                  </button>
                </div>
              ) : (
                <ButtonIcon iconName="edit" clickHandler={() => setIsEditing(true)} />
              )
            }
          >
            <form
              id="client-edit-form"
              onSubmit={handleSubmit(onSubmit)}
              className="px-4 md:px-6 py-4 md:py-5 space-y-4"
            >
              <FormField label="Full Name" required={isEditing} error={errors.displayName?.message}>
                <input
                  {...register('displayName', { required: isEditing ? 'Name is required' : false })}
                  disabled={!isEditing}
                  className={fieldCls(!!errors.displayName)}
                />
              </FormField>

              <FormField label="Company Name" error={errors.companyName?.message}>
                <input
                  {...register('companyName')}
                  disabled={!isEditing}
                  className={fieldCls(!!errors.companyName)}
                />
              </FormField>

              <FormField label="Email Address" required={isEditing} error={errors.email?.message}>
                <input
                  type="email"
                  {...register('email', {
                    required: isEditing ? 'Email is required' : false,
                    pattern: isEditing
                      ? { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
                      : undefined,
                  })}
                  disabled={!isEditing}
                  className={fieldCls(!!errors.email)}
                />
              </FormField>

              <FormField label="Phone Number" error={errors.phone?.message}>
                <input
                  type="tel"
                  {...register('phone', {
                    pattern: isEditing
                      ? { value: /^[+\d\s\-()+.]{7,20}$/, message: 'Enter a valid phone number' }
                      : undefined,
                  })}
                  disabled={!isEditing}
                  className={fieldCls(!!errors.phone)}
                />
              </FormField>

              <FormField label="Status" required={isEditing} error={errors.status?.message}>
                <select
                  {...register('status', { required: isEditing })}
                  disabled={!isEditing}
                  className={fieldSelectCls(!!errors.status)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="lost">Lost</option>
                </select>
              </FormField>

              {isEditing && (
                <p className="text-[11px] text-gray-400">
                  Member since{' '}
                  {client.createdAt?.toDate
                    ? format(client.createdAt.toDate(), 'MMM d, yyyy')
                    : '—'}
                </p>
              )}
            </form>
          </CardContent>
        </div>


        {/* Projects detail*/}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:gap-6">
          <div className="lg-col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-(--color-ink)">Projects</h2>
              <div className="flex flex-col items-end gap-1">
                <p className="text-xs text-gray-400 mt-0.5">
                  {projects.length} project{projects.length !== 1 ? 's' : ''} &middot; {activeCount} active
                </p>
                {projects.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-gray-400">
                      ${totalPaid.toLocaleString()} collected
                    </span>
                    {totalRemaining > 0 && (
                      <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        ${totalRemaining.toLocaleString()} outstanding
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-[18px] p-14 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-(--color-surface) flex items-center justify-center">
                  <Briefcase size={20} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-500">No projects yet</p>
                <p className="text-xs text-gray-400">
                  Projects for {client.displayName} will appear here.
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
    </Layout>
  );
};

export default ClientDetail;
