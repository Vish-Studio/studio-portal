import UserLayout from '@/src/components/user/user-layout/user-layout';

const UserSettings = () => (
  <UserLayout title="Settings">
    <div className="flex-1 rounded-[32px] bg-[#F5F6F8] p-8 min-h-[500px] flex items-center justify-center border border-gray-100">
      <h2 className="text-xl text-gray-500 font-medium">Settings Page Content</h2>
    </div>
  </UserLayout>
);

export default UserSettings;
