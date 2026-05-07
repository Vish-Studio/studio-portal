import { type ReactNode, useState } from 'react';
import Layout from '../components/common/layout/layout';
import Button from '../components/common/button/button';
import Checkbox from '../components/common/checkbox/checkbox';
import Chips from '../components/common/chips/chips';
import MaterialIcon from '../components/common/material-icon/material-icon';
import Toggle from '../components/common/toggle/toggle';
import { useSettingsStore, type SettingsSection } from '../store/settings';

const inputClassName =
  'w-full rounded-2xl border border-transparent bg-(--color-surface) px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-gray-200 focus:bg-white focus:ring-4 focus:ring-gray-100';

const sections: Array<{ key: SettingsSection; icon: string; label: string; description: string }> = [
  { key: 'profile', icon: 'person', label: 'Profile details', description: 'Name, role and phone number' },
  { key: 'email', icon: 'mail', label: 'Email', description: 'Primary and recovery email' },
  { key: 'password', icon: 'lock', label: 'Password', description: 'Update account password' },
  { key: 'newsletters', icon: 'mark_email_read', label: 'Newsletters', description: 'Email preferences' },
];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
      {children}
    </label>
  );
}

function PreferenceRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-gray-100 py-4 first:border-t-0 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-bold text-(--color-ink)">{label}</p>
        <p className="mt-1 text-xs font-medium leading-5 text-gray-400">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function Settings() {
  const settings = useSettingsStore((state) => state.settings);
  const activeSection = useSettingsStore((state) => state.activeSection);
  const isDirty = useSettingsStore((state) => state.isDirty);
  const setActiveSection = useSettingsStore((state) => state.setActiveSection);
  const updateSetting = useSettingsStore((state) => state.updateSetting);
  const markSaved = useSettingsStore((state) => state.markSaved);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    signOutSessions: true,
  });

  const activeSectionMeta = sections.find(section => section.key === activeSection) ?? sections[0];

  const sectionContent: Record<SettingsSection, ReactNode> = {
    profile: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Full name">
          <input
            value={settings.fullName}
            onChange={event => updateSetting('fullName', event.target.value)}
            className={inputClassName}
          />
        </Field>
        <Field label="Job title">
          <input
            value={settings.jobTitle}
            onChange={event => updateSetting('jobTitle', event.target.value)}
            className={inputClassName}
          />
        </Field>
        <Field label="Phone number">
          <input
            value={settings.phone}
            onChange={event => updateSetting('phone', event.target.value)}
            className={inputClassName}
          />
        </Field>
      </div>
    ),
    email: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Primary email">
          <input
            type="email"
            value={settings.email}
            onChange={event => updateSetting('email', event.target.value)}
            className={inputClassName}
          />
        </Field>
        <Field label="Recovery email">
          <input
            type="email"
            value={settings.recoveryEmail}
            onChange={event => updateSetting('recoveryEmail', event.target.value)}
            className={inputClassName}
          />
        </Field>
      </div>
    ),
    password: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Current password">
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={event => setPasswordForm(prev => ({ ...prev, currentPassword: event.target.value }))}
            className={inputClassName}
          />
        </Field>
        <div className="hidden md:block" />
        <Field label="New password">
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={event => setPasswordForm(prev => ({ ...prev, newPassword: event.target.value }))}
            className={inputClassName}
          />
        </Field>
        <Field label="Confirm password">
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={event => setPasswordForm(prev => ({ ...prev, confirmPassword: event.target.value }))}
            className={inputClassName}
          />
        </Field>
        <div className="md:col-span-2">
          <Checkbox
            checked={passwordForm.signOutSessions}
            onChange={event => setPasswordForm(prev => ({ ...prev, signOutSessions: event.target.checked }))}
            label="Sign out from other sessions"
            description="Recommended after changing your password."
            className="rounded-2xl bg-(--color-surface) p-4"
          />
        </div>
      </div>
    ),
    newsletters: (
      <div className="rounded-2xl bg-(--color-surface) p-4">
        <PreferenceRow
          label="Marketing emails"
          description="Receive occasional offers and studio portal news."
          checked={settings.marketingEmails}
          onChange={() => updateSetting('marketingEmails', !settings.marketingEmails)}
        />
        <PreferenceRow
          label="Product updates"
          description="Receive updates when new features are available."
          checked={settings.productUpdates}
          onChange={() => updateSetting('productUpdates', !settings.productUpdates)}
        />
        <PreferenceRow
          label="Weekly digest"
          description="Receive a weekly summary of projects, tasks and scheduled items."
          checked={settings.weeklyDigest}
          onChange={() => updateSetting('weeklyDigest', !settings.weeklyDigest)}
        />
        <PreferenceRow
          label="Security alerts"
          description="Receive important account and sign-in alerts."
          checked={settings.securityAlerts}
          onChange={() => updateSetting('securityAlerts', !settings.securityAlerts)}
        />
      </div>
    ),
  };

  return (
    <Layout title="Settings">
      <div className="flex flex-col gap-4 pb-10">
        <section className="rounded-[18px] bg-(--color-surface-alt) p-4 md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Account settings</p>
              <h2 className="mt-2 text-2xl font-bold text-(--color-ink)">Manage your account</h2>
              <p className="mt-1 text-sm font-medium text-gray-500">
                {isDirty ? 'Unsaved changes' : 'All changes saved'}
              </p>
            </div>
            <Chips
              value={activeSection}
              onChange={setActiveSection}
              className="lg:justify-end"
              items={sections.map(section => ({
                value: section.key,
                label: section.label,
                icon: <MaterialIcon name={section.icon} size={16} />,
              }))}
            />
          </div>
        </section>

        <section className="rounded-[18px] border border-gray-100 bg-white">
          <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-5 md:px-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <MaterialIcon name={activeSectionMeta.icon} size={20} className="text-gray-500" />
                <h2 className="text-xl font-bold text-(--color-ink)">{activeSectionMeta.label}</h2>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-400">{activeSectionMeta.description}</p>
            </div>
            <Button onClick={markSaved} disabled={!isDirty}>
              Save changes
            </Button>
          </div>

          <div className="p-4 md:p-6">
            {sectionContent[activeSection]}
          </div>
        </section>
      </div>
    </Layout>
  );
}
