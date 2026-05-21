import { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  FormField,
  MaterialIcon,
  Option,
  Select,
  TextInput,
  Toggle,
} from '@/src/shared/components';
import { useAuthStore } from '@/src/features/auth';
import { useUIStore } from '@/src/app/stores/uiStore';
import type { AuthProfileUpdateInput } from '@/src/types/auth';

type SettingsTab = 'profile' | 'newsletters' | 'security';

const tabs: Array<{
  key: SettingsTab;
  icon: string;
  label: string;
  description: string;
}> = [
  {
    key: 'profile',
    icon: 'person',
    label: 'Profile',
    description: 'Personal and contact details',
  },
  {
    key: 'newsletters',
    icon: 'mark_email_read',
    label: 'Newsletters',
    description: 'Email and digest preferences',
  },
  {
    key: 'security',
    icon: 'lock',
    label: 'Security',
    description: 'Password recovery and access',
  },
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
    <div className="user-profile-settings-preference flex items-center justify-between gap-4 border-b border-gray-100 py-4 last:border-b-0">
      <div className="user-profile-settings-preference-copy min-w-0">
        <p className="type-card-title text-(--color-ink)">{label}</p>
        <p className="type-muted mt-1 max-w-xl text-gray-400">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function UserProfileSettings() {
  const profile = useAuthStore(state => state.profile);
  const loading = useAuthStore(state => state.loading);
  const updateProfile = useAuthStore(state => state.updateProfile);
  const sendPasswordReset = useAuthStore(state => state.sendPasswordReset);
  const showToast = useUIStore(state => state.showToast);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [form, setForm] = useState<AuthProfileUpdateInput>({
    email: '',
    full_name: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    jobTitle: '',
    company_name: '',
    recovery_email: '',
    gender: '',
    newsletterPreferences: false,
  });
  const [isDirty, setIsDirty] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setForm({
      full_name: profile.full_name ?? '',
      first_name: profile.first_name ?? '',
      last_name: profile.last_name ?? '',
      email: profile.email ?? '',
      phone_number: profile.phone_number ?? '',
      jobTitle: profile.jobTitle ?? '',
      company_name: profile.company_name ?? '',
      recovery_email: profile.recovery_email ?? '',
      gender: profile.gender ?? '',
      newsletterPreferences: profile.newsletterPreferences ?? false,
    });
    setIsDirty(false);
  }, [profile]);

  const activeTabMeta = tabs.find(tab => tab.key === activeTab) ?? tabs[0];
  const updateForm = <Key extends keyof AuthProfileUpdateInput>(key: Key, value: AuthProfileUpdateInput[Key]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    await updateProfile({
      ...form,
      email: form.email?.trim().toLowerCase(),
      full_name: form.full_name?.trim(),
      first_name: form.first_name?.trim(),
      last_name: form.last_name?.trim(),
      phone_number: form.phone_number?.trim(),
      jobTitle: form.jobTitle?.trim(),
      company_name: form.company_name?.trim(),
      recovery_email: form.recovery_email?.trim().toLowerCase(),
      gender: form.gender,
      newsletterPreferences: !!form.newsletterPreferences,
    });
    setIsDirty(false);
  };

  const handlePasswordReset = async () => {
    if (!profile?.email) return;

    setResettingPassword(true);
    try {
      await sendPasswordReset(profile.email);
      showToast({
        status: 'success',
        title: 'Reset email sent',
        message: `We sent password reset instructions to ${profile.email}.`,
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

  if (!profile) {
    return (
      <section className="user-profile-settings rounded-[18px] border border-gray-100 bg-white p-6">
        <p className="type-card-title text-(--color-ink)">Profile unavailable</p>
        <p className="type-muted mt-1 text-gray-400">Your account profile could not be loaded.</p>
      </section>
    );
  }

  return (
    <div className="user-profile-settings flex flex-col gap-5 pb-10">
      <section className="user-profile-settings-title-card rounded-[18px] bg-(--color-surface-alt) p-5 md:p-6">
        <div className="user-profile-settings-title-content flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="user-profile-settings-title-left flex items-center gap-4">
            <Avatar name={profile.fullName || profile.email} id={profile.uid} size="lg" />
            <div className="user-profile-settings-title-copy min-w-0">
              <p className="type-eyebrow text-gray-400">Account profile</p>
              <h2 className="type-page-title mt-1 text-(--color-ink)">Manage your profile</h2>
              <p className="type-muted mt-1 text-gray-400">{profile.email}</p>
            </div>
          </div>
          <div className="user-profile-settings-title-status rounded-2xl bg-white px-4 py-3">
            <p className="type-label text-gray-400">Account status</p>
            <p className="type-card-title mt-1 capitalize text-(--color-ink)">{profile.status}</p>
          </div>
        </div>
      </section>

      <div className="user-profile-settings-workspace grid grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="user-profile-settings-tabs rounded-[18px] border border-gray-100 bg-white p-3">
          <div className="user-profile-settings-tabs-header px-2 py-3">
            <p className="type-label text-gray-400">Settings</p>
            <p className="type-muted mt-1 text-gray-400">Choose what you want to update.</p>
          </div>
          <div className="user-profile-settings-tab-list mt-2 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {tabs.map(tab => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`user-profile-settings-tab min-w-[210px] rounded-2xl px-4 py-3 text-left transition lg:min-w-0 ${
                    isActive ? 'bg-(--color-ink) text-white' : 'bg-(--color-surface-alt) text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <span className="user-profile-settings-tab-row flex items-start gap-3">
                    <span className={`user-profile-settings-tab-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isActive ? 'bg-white/10' : 'bg-white'}`}>
                      <MaterialIcon name={tab.icon} size={18} />
                    </span>
                    <span className="user-profile-settings-tab-copy min-w-0">
                      <span className={`type-card-title block ${isActive ? 'text-white' : 'text-(--color-ink)'}`}>{tab.label}</span>
                      <span className={`type-muted mt-1 block ${isActive ? 'text-white/45' : 'text-gray-400'}`}>{tab.description}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="user-profile-settings-panel rounded-[18px] border border-gray-100 bg-white">
          <div className="user-profile-settings-panel-header flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <div className="user-profile-settings-panel-title min-w-0">
              <div className="user-profile-settings-panel-heading flex items-center gap-2">
                <MaterialIcon name={activeTabMeta.icon} size={20} className="text-gray-500" />
                <h3 className="type-section-title text-(--color-ink)">{activeTabMeta.label}</h3>
              </div>
              <p className="type-muted mt-1 text-gray-400">{activeTabMeta.description}</p>
            </div>
            <Button onClick={handleSave} loading={loading} disabled={!isDirty}>
              Save changes
            </Button>
          </div>

          <div className="user-profile-settings-panel-body p-5 md:p-6">
            {activeTab === 'profile' ? (
              <div className="user-profile-settings-profile grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Full name">
                  <TextInput value={form.full_name ?? ''} onChange={event => updateForm('full_name', event.target.value)} />
                </FormField>
                <FormField label="First name">
                  <TextInput value={form.first_name ?? ''} onChange={event => updateForm('first_name', event.target.value)} />
                </FormField>
                <FormField label="Last name">
                  <TextInput value={form.last_name ?? ''} onChange={event => updateForm('last_name', event.target.value)} />
                </FormField>
                <FormField label="Primary email" hint="Email sign-in is managed by Firebase Authentication.">
                  <TextInput type="email" value={form.email ?? ''} onChange={event => updateForm('email', event.target.value)} />
                </FormField>
                <FormField label="Phone number">
                  <TextInput value={form.phone_number ?? ''} onChange={event => updateForm('phone_number', event.target.value)} placeholder="+230 5 000 0000" />
                </FormField>
                <FormField label="Recovery email">
                  <TextInput type="email" value={form.recovery_email ?? ''} onChange={event => updateForm('recovery_email', event.target.value)} placeholder="backup@email.com" />
                </FormField>
                <FormField label="Role or title">
                  <TextInput value={form.jobTitle ?? ''} onChange={event => updateForm('jobTitle', event.target.value)} placeholder="Marketing Manager" />
                </FormField>
                <FormField label="Company">
                  <TextInput value={form.company_name ?? ''} onChange={event => updateForm('company_name', event.target.value)} placeholder="Company name" />
                </FormField>
                <FormField label="Gender">
                  <Select value={form.gender ?? ''} onChange={event => updateForm('gender', event.target.value as AuthProfileUpdateInput['gender'])}>
                    <Option value="">Not set</Option>
                    <Option value="female">Female</Option>
                    <Option value="male">Male</Option>
                    <Option value="non_binary">Non-binary</Option>
                    <Option value="prefer_not_to_say">Prefer not to say</Option>
                  </Select>
                </FormField>
              </div>
            ) : null}

            {activeTab === 'newsletters' ? (
              <div className="user-profile-settings-newsletters rounded-2xl px-4">
                <PreferenceRow
                  label="Newsletter"
                  description="Receive studio news, product updates, and useful project digests."
                  checked={!!form.newsletterPreferences}
                  onChange={checked => updateForm('newsletterPreferences', checked)}
                />
              </div>
            ) : null}

            {activeTab === 'security' ? (
              <div className="user-profile-settings-security rounded-2xl bg-(--color-surface-alt) p-4">
                <div className="user-profile-settings-security-card rounded-2xl bg-white p-4">
                  <div className="user-profile-settings-security-row flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="user-profile-settings-security-copy min-w-0">
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
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
