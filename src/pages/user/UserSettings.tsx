import UserLayout from '@/src/components/user/user-layout/user-layout';
import AccountSettings from '@/src/components/common/account-settings/account-settings';

export default function UserSettings() {
  return (
    <UserLayout title="Settings">
      <AccountSettings />
    </UserLayout>
  );
}
