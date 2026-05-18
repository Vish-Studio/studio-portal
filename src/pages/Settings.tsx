import DashboardLayout from '@/src/layouts/DashboardLayout';
import AccountSettings from '../components/common/account-settings/account-settings';

export default function Settings() {
  return (
    <DashboardLayout title="Settings">
      <AccountSettings />
    </DashboardLayout>
  );
}
