import UserLayout from '@/src/components/user/user-layout/user-layout';
import UserProfileSettings from '../components/user-profile-settings/user-profile-settings';

export default function UserSettingsPage() {
  return (
    <UserLayout title="Settings">
      <UserProfileSettings />
    </UserLayout>
  );
}
