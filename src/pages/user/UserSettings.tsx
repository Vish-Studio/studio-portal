import UserLayout from '@/src/components/user/user-layout/user-layout';
import UserProfileSettings from '@/src/components/user/user-profile-settings/user-profile-settings';

export default function UserSettings() {
  return (
    <UserLayout title="Settings">
      <UserProfileSettings />
    </UserLayout>
  );
}
