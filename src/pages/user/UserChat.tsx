import UserLayout from '../../components/user/user-layout/user-layout';
import ChatWorkspace from '../../components/admin/chat/chat-workspace';
import { useAuthStore } from '../../store/auth';

export default function UserChat() {
  const profile = useAuthStore(state => state.profile);

  return (
    <UserLayout title="Chat" fixedFromLarge>
      <div className="w-full py-6 md:py-10 lg:flex lg:min-h-0 lg:flex-1 lg:py-0">
        <ChatWorkspace mode="client" currentClientId={profile?.clientId ?? ''} />
      </div>
    </UserLayout>
  );
}
