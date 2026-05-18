import DashboardLayout from '@/src/layouts/DashboardLayout';
import AccountSettings from '../components/account-settings/account-settings';

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings">
      <AccountSettings />
    </DashboardLayout>
  );
}
