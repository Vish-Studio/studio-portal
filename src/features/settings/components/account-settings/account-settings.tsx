import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Button,
  FormField,
  inputCls,
  MaterialIcon,
  Tabs,
  Toggle,
  type TabItem,
} from '@/src/shared/components';
import { useAuthStore } from '@/src/store/auth';
import { useUIStore } from '@/src/store/ui';
import type { AuthProfileUpdateInput, NewsletterPreferences } from '@/src/types/auth';

type SettingsSection = 'profile' | 'email' | 'password' | 'newsletters';

const defaultNewsletterPreferences: NewsletterPreferences = {
  marketingEmails: false,
  productUpdates: true,
  weeklyDigest: true,
  securityAlerts: true,
};

const sections: Array<{ key: SettingsSection; icon: string; label: string; description: string }> = [
  { key: 'profile', icon: 'person', label: 'Profile details', description: 'Name, role and phone number' },
  { key: 'email', icon: 'mail', label: 'Email', description: 'Primary and recovery email' },
  { key: 'password', icon: 'lock', label: 'Password', description: 'Reset your account password' },
  { key: 'newsletters', icon: 'mark_email_read', label: 'Newsletters', description: 'Email preferences' },
];

function PreferenceRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="account-settings-preference flex items-center justify-between gap-4 border-t border-gray-100 py-4 first:border-t-0 first:pt-0 last:pb-0">
      <div className="account-settings-preference-copy min-w-0">
        <p className="type-card-title text-(--color-ink)">{label}</p>
        <p className="type-muted mt-1 text-gray-400">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function AccountSettings() {
  const profile = useAuthStore(state => state.profile);
  const loading = useAuthStore(state => state.loading);
  const updateProfile = useAuthStore(state => state.updateProfile);
  const sendPasswordReset = useAuthStore(state => state.sendPasswordReset);
  const showToast = useUIStore(state => state.showToast);
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [isDirty, setIsDirty] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [form, setForm] = useState<AuthProfileUpdateInput>({
    email: '',
    fullName: '',
    phone: '',
    jobTitle: '',
    company: '',
    recoveryEmail: '',
    newsletterPreferences: defaultNewsletterPreferences,
  });

  useEffect(() => {
    if (!profile) return;

    setForm({
      email: profile.email ?? '',
      fullName: profile.fullName ?? '',
      phone: profile.phone ?? '',
      jobTitle: profile.jobTitle ?? '',
      company: profile.company ?? '',
      recoveryEmail: profile.recoveryEmail ?? '',
      newsletterPreferences: {
        ...defaultNewsletterPreferences,
        ...profile.newsletterPreferences,
      },
    });
    setIsDirty(false);
  }, [profile]);

  const activeSectionMeta = sections.find(section => section.key === activeSection) ?? sections[0];
  const sectionTabs: TabItem[] = sections.map(section => ({
    key: section.key,
    label: section.label,
    icon: <MaterialIcon name={section.icon} size={16} />,
  }));
  const newsletterPreferences = useMemo(
    () => ({ ...defaultNewsletterPreferences, ...form.newsletterPreferences }),
    [form.newsletterPreferences],
  );

  const updateForm = <Key extends keyof AuthProfileUpdateInput>(key: Key, value: AuthProfileUpdateInput[Key]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const updateNewsletterPreference = (key: keyof NewsletterPreferences, value: boolean) => {
    updateForm('newsletterPreferences', {
      ...newsletterPreferences,
      [key]: value,
    });
  };

  const handleSave = async () => {
    await updateProfile({
      ...form,
      email: form.email?.trim().toLowerCase(),
      fullName: form.fullName?.trim(),
      phone: form.phone?.trim(),
      jobTitle: form.jobTitle?.trim(),
      company: form.company?.trim(),
      recoveryEmail: form.recoveryEmail?.trim().toLowerCase(),
      newsletterPreferences,
    });
    setIsDirty(false);
  };

  const handlePasswordReset = async () => {
    const email = form.email || profile?.email;
    if (!email) return;

    setResettingPassword(true);
    try {
      await sendPasswordReset(email);
      showToast({
        status: 'success',
        title: 'Reset email sent',
        message: `We sent password reset instructions to ${email}.`,
      });
    } catch (error) {
      showToast({
        status: 'error',
        title: 'Unable to send reset email',
        message: error instanceof Error ? error.message : 'Try again in a moment.',
      });
    } finally {
      setResettingPassword(false);
    }
  };

  const sectionContent: Record<SettingsSection, ReactNode> = {
    profile: (
      <div className="account-settings-profile grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Full name">
          <input value={form.fullName ?? ''} onChange={event => updateForm('fullName', event.target.value)} className={inputCls()} />
        </FormField>
        <FormField label="Role or title">
          <input value={form.jobTitle ?? ''} onChange={event => updateForm('jobTitle', event.target.value)} className={inputCls()} />
        </FormField>
        <FormField label="Phone number">
          <input value={form.phone ?? ''} onChange={event => updateForm('phone', event.target.value)} className={inputCls()} />
        </FormField>
        <FormField label="Company">
          <input value={form.company ?? ''} onChange={event => updateForm('company', event.target.value)} className={inputCls()} />
        </FormField>
      </div>
    ),
    email: (
      <div className="account-settings-email grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Primary email" hint="Changing email may ask Firebase for a recent sign-in.">
          <input type="email" value={form.email ?? ''} onChange={event => updateForm('email', event.target.value)} className={inputCls()} />
        </FormField>
        <FormField label="Recovery email">
          <input type="email" value={form.recoveryEmail ?? ''} onChange={event => updateForm('recoveryEmail', event.target.value)} className={inputCls()} />
        </FormField>
      </div>
    ),
    password: (
      <div className="account-settings-security rounded-2xl bg-(--color-surface-alt) p-4">
        <div className="account-settings-security-card rounded-2xl bg-white p-4">
          <div className="account-settings-security-row flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="account-settings-security-copy min-w-0">
              <p className="type-card-title text-(--color-ink)">Password reset</p>
              <p className="type-muted mt-1 max-w-xl text-gray-400">
                We will send Firebase password reset instructions to your primary email.
              </p>
            </div>
            <Button variant="secondary" loading={resettingPassword} onClick={handlePasswordReset}>
              Send reset email
            </Button>
          </div>
        </div>
      </div>
    ),
    newsletters: (
      <div className="account-settings-newsletters rounded-2xl bg-(--color-surface) p-4">
        <PreferenceRow label="Marketing emails" description="Receive occasional offers and studio portal news." checked={newsletterPreferences.marketingEmails} onChange={checked => updateNewsletterPreference('marketingEmails', checked)} />
        <PreferenceRow label="Product updates" description="Receive updates when new features are available." checked={newsletterPreferences.productUpdates} onChange={checked => updateNewsletterPreference('productUpdates', checked)} />
        <PreferenceRow label="Weekly digest" description="Receive a weekly summary of projects, tasks and scheduled items." checked={newsletterPreferences.weeklyDigest} onChange={checked => updateNewsletterPreference('weeklyDigest', checked)} />
        <PreferenceRow label="Security alerts" description="Receive important account and sign-in alerts." checked={newsletterPreferences.securityAlerts} onChange={checked => updateNewsletterPreference('securityAlerts', checked)} />
      </div>
    ),
  };

  if (!profile) {
    return (
      <section className="account-settings rounded-[18px] border border-gray-100 bg-white p-6">
        <p className="type-card-title text-(--color-ink)">Profile unavailable</p>
        <p className="type-muted mt-1 text-gray-400">Your account profile could not be loaded.</p>
      </section>
    );
  }

  return (
    <div className="account-settings flex flex-col gap-5 pb-10 lg:min-h-0">
      <section className="account-settings-title-card overflow-hidden rounded-[24px] bg-(--color-ink) text-white">
        <div className="account-settings-title-content flex min-h-[178px] flex-col justify-between gap-6 p-6 md:min-h-[190px] md:p-8 lg:flex-row lg:items-end lg:p-9">
          <div className="account-settings-title-copy min-w-0">
            <div className="account-settings-title-kicker inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
              <MaterialIcon name="admin_panel_settings" size={15} className="text-(--color-accent-lime)" />
              <span className="type-eyebrow text-white/70">Admin settings</span>
            </div>
            <h2 className="type-page-title mt-4 max-w-2xl text-white">Manage your account</h2>
            <p className="type-muted mt-2 text-white/50">
              {isDirty ? 'Unsaved changes' : profile.email}
            </p>
          </div>

          <div className="account-settings-title-meta grid grid-cols-2 gap-3 sm:flex sm:items-center">
            <div className="account-settings-title-status rounded-[18px] bg-white px-4 py-3 text-(--color-ink)">
              <p className="type-label text-gray-400">Role access</p>
              <p className="type-card-title mt-1 capitalize text-(--color-ink)">{profile.role}</p>
            </div>
            <div className="account-settings-title-status rounded-[18px] border border-white/10 bg-white/5 px-4 py-3">
              <p className="type-label text-white/45">Account</p>
              <p className="type-card-title mt-1 text-white">Active</p>
            </div>
          </div>
        </div>
      </section>

      <div className="account-settings-mobile-tabs lg:hidden">
        <Tabs
          items={sectionTabs}
          value={activeSection}
          onChange={key => setActiveSection(key as SettingsSection)}
          mobileMode="scroll"
          equalWidth
          listClassName="w-full"
          ariaLabel="Settings sections"
        />
      </div>

      <div className="account-settings-workspace grid grid-cols-1 gap-5 lg:h-[calc(100vh-22rem)] lg:min-h-[520px] lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="account-settings-tabs hidden rounded-[22px] border border-gray-200 bg-white p-3 lg:flex lg:h-full lg:flex-col">


          <div className="account-settings-tab-list flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pb-0">
            {sections.map(section => {
              const isActive = activeSection === section.key;

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  className={`account-settings-tab min-w-0 rounded-[18px] px-4 py-3 text-left transition ${
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

        <section className="account-settings-panel flex min-h-0 flex-col rounded-[22px] border border-gray-200 bg-white lg:h-full">
          <div className="account-settings-panel-header shrink-0 flex flex-col gap-4 border-b border-gray-100 px-4 py-5 sm:flex-row sm:items-start sm:justify-between md:px-6">
            <div className="account-settings-panel-title min-w-0">
              <div className="account-settings-panel-heading flex items-center gap-2">
                <MaterialIcon name={activeSectionMeta.icon} size={20} className="text-gray-500" />
                <h2 className="type-section-title text-(--color-ink)">{activeSectionMeta.label}</h2>
              </div>
              <p className="type-muted mt-2 text-gray-400">{activeSectionMeta.description}</p>
            </div>
            <Button onClick={handleSave} loading={loading} disabled={!isDirty} className="w-full sm:w-auto">
              Save changes
            </Button>
          </div>

          <div className="account-settings-panel-body min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
            {sectionContent[activeSection]}
          </div>
        </section>
      </div>
    </div>
  );
}
