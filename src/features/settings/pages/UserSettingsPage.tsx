import UserLayout from '@/src/layouts/UserLayout';
import UserProfileSettings from '../components/user-profile-settings/user-profile-settings';

export default function UserSettingsPage() {
  return (
    <UserLayout title="Settings">
      <UserProfileSettings />
    </UserLayout>
  );
}
