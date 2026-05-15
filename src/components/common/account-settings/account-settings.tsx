import { type ReactNode, useState } from 'react';
import Button from '../button/button';
import Checkbox from '../checkbox/checkbox';
import MaterialIcon from '../material-icon/material-icon';
import Toggle from '../toggle/toggle';
import { useSettingsStore, type SettingsSection } from '@/src/store/settings';

const inputClassName =
  'w-full rounded-2xl border border-transparent bg-(--color-surface) px-4 py-3 text-base font-medium text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-gray-200 focus:bg-white focus:ring-4 focus:ring-gray-100 md:text-sm';

const sections: Array<{ key: SettingsSection; icon: string; label: string; description: string }> = [
  { key: 'profile', icon: 'person', label: 'Profile details', description: 'Name, role and phone number' },
  { key: 'email', icon: 'mail', label: 'Email', description: 'Primary and recovery email' },
  { key: 'password', icon: 'lock', label: 'Password', description: 'Update account password' },
  { key: 'newsletters', icon: 'mark_email_read', label: 'Newsletters', description: 'Email preferences' },
];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="account-settings-field block">
      <span className="account-settings-field-label mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
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
    <div className="account-settings-preference flex items-center justify-between gap-4 border-t border-gray-100 py-4 first:border-t-0 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-bold text-(--color-ink)">{label}</p>
        <p className="mt-1 text-xs font-medium leading-5 text-gray-400">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function AccountSettings() {
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
          <input value={settings.fullName} onChange={event => updateSetting('fullName', event.target.value)} className={inputClassName} />
        </Field>
        <Field label="Job title">
          <input value={settings.jobTitle} onChange={event => updateSetting('jobTitle', event.target.value)} className={inputClassName} />
        </Field>
        <Field label="Phone number">
          <input value={settings.phone} onChange={event => updateSetting('phone', event.target.value)} className={inputClassName} />
        </Field>
      </div>
    ),
    email: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Primary email">
          <input type="email" value={settings.email} onChange={event => updateSetting('email', event.target.value)} className={inputClassName} />
        </Field>
        <Field label="Recovery email">
          <input type="email" value={settings.recoveryEmail} onChange={event => updateSetting('recoveryEmail', event.target.value)} className={inputClassName} />
        </Field>
      </div>
    ),
    password: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Current password">
          <input type="password" value={passwordForm.currentPassword} onChange={event => setPasswordForm(prev => ({ ...prev, currentPassword: event.target.value }))} className={inputClassName} />
        </Field>
        <div className="hidden md:block" />
        <Field label="New password">
          <input type="password" value={passwordForm.newPassword} onChange={event => setPasswordForm(prev => ({ ...prev, newPassword: event.target.value }))} className={inputClassName} />
        </Field>
        <Field label="Confirm password">
          <input type="password" value={passwordForm.confirmPassword} onChange={event => setPasswordForm(prev => ({ ...prev, confirmPassword: event.target.value }))} className={inputClassName} />
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
        <PreferenceRow label="Marketing emails" description="Receive occasional offers and studio portal news." checked={settings.marketingEmails} onChange={() => updateSetting('marketingEmails', !settings.marketingEmails)} />
        <PreferenceRow label="Product updates" description="Receive updates when new features are available." checked={settings.productUpdates} onChange={() => updateSetting('productUpdates', !settings.productUpdates)} />
        <PreferenceRow label="Weekly digest" description="Receive a weekly summary of projects, tasks and scheduled items." checked={settings.weeklyDigest} onChange={() => updateSetting('weeklyDigest', !settings.weeklyDigest)} />
        <PreferenceRow label="Security alerts" description="Receive important account and sign-in alerts." checked={settings.securityAlerts} onChange={() => updateSetting('securityAlerts', !settings.securityAlerts)} />
      </div>
    ),
  };

  return (
    <div className="account-settings flex flex-col gap-5 pb-10">
      <section className="account-settings-title-card rounded-[18px] bg-(--color-surface-alt) p-5 md:p-6">
        <div className="account-settings-title-content flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="account-settings-title-copy min-w-0">
            <p className="type-eyebrow text-gray-400">Admin settings</p>
            <h2 className="type-page-title mt-1 text-(--color-ink)">Manage your account</h2>
            <p className="type-muted mt-1 text-gray-400">
              {isDirty ? 'Unsaved changes' : 'Profile, login, and email preferences'}
            </p>
          </div>
          <div className="account-settings-title-status rounded-2xl bg-white px-4 py-3">
            <p className="type-label text-gray-400">Save status</p>
            <p className="type-card-title mt-1 text-(--color-ink)">{isDirty ? 'Changes pending' : 'Up to date'}</p>
          </div>
        </div>
      </section>

      <div className="account-settings-workspace grid grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="account-settings-tabs rounded-[18px] border border-gray-100 bg-white p-3">
          <div className="account-settings-tabs-header px-2 py-3">
            <p className="type-label text-gray-400">Settings</p>
            <p className="type-muted mt-1 text-gray-400">Choose the section you want to edit.</p>
          </div>
          <div className="account-settings-tab-list mt-2 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {sections.map(section => {
              const isActive = activeSection === section.key;

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  className={`account-settings-tab min-w-[210px] rounded-2xl px-4 py-3 text-left transition lg:min-w-0 ${
                    isActive ? 'bg-(--color-ink) text-white' : 'bg-(--color-surface-alt) text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <span className="account-settings-tab-row flex items-start gap-3">
                    <span className={`account-settings-tab-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isActive ? 'bg-white/10' : 'bg-white'}`}>
                      <MaterialIcon name={section.icon} size={18} />
                    </span>
                    <span className="account-settings-tab-copy min-w-0">
                      <span className={`type-card-title block ${isActive ? 'text-white' : 'text-(--color-ink)'}`}>{section.label}</span>
                      <span className={`type-muted mt-1 block ${isActive ? 'text-white/45' : 'text-gray-400'}`}>{section.description}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="account-settings-panel rounded-[18px] border border-gray-100 bg-white">
          <div className="account-settings-panel-header flex flex-col gap-4 border-b border-gray-100 px-4 py-5 sm:flex-row sm:items-start sm:justify-between md:px-6">
            <div className="account-settings-panel-title min-w-0">
              <div className="account-settings-panel-heading flex items-center gap-2">
                <MaterialIcon name={activeSectionMeta.icon} size={20} className="text-gray-500" />
                <h2 className="type-section-title text-(--color-ink)">{activeSectionMeta.label}</h2>
              </div>
              <p className="type-muted mt-2 text-gray-400">{activeSectionMeta.description}</p>
            </div>
            <Button onClick={markSaved} disabled={!isDirty}>
              Save changes
            </Button>
          </div>

          <div className="account-settings-panel-body p-4 md:p-6">
            {sectionContent[activeSection]}
          </div>
        </section>
      </div>
    </div>
  );
}
