import { create } from 'zustand';

export type SettingsSection = 'profile' | 'email' | 'password' | 'newsletters';

export interface UserSettings {
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
  recoveryEmail: string;
  marketingEmails: boolean;
  productUpdates: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
}

interface SettingsState {
  settings: UserSettings;
  activeSection: SettingsSection;
  isDirty: boolean;
  lastSavedAt?: number;
  setActiveSection: (section: SettingsSection) => void;
  updateSetting: <Key extends keyof UserSettings>(key: Key, value: UserSettings[Key]) => void;
  markSaved: () => void;
}

const initialSettings: UserSettings = {
  fullName: 'Studio Admin',
  jobTitle: 'Creative Director',
  phone: '+230 5 000 0000',
  email: 'hello@studioportal.com',
  recoveryEmail: 'admin@studioportal.com',
  marketingEmails: false,
  productUpdates: true,
  weeklyDigest: true,
  securityAlerts: true,
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: initialSettings,
  activeSection: 'profile',
  isDirty: false,
  lastSavedAt: undefined,
  setActiveSection: (activeSection) => set({ activeSection }),
  updateSetting: (key, value) =>
    set((state) => ({
      settings: { ...state.settings, [key]: value },
      isDirty: true,
    })),
  markSaved: () => set({ isDirty: false, lastSavedAt: Date.now() }),
}));
