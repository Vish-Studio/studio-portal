import UserLayout from '@/src/components/user/user-layout/user-layout';
import ChatWorkspace from '../components/chat-workspace';
import { useAuthStore } from '@/src/features/auth';

export default function UserChatPage() {
  const profile = useAuthStore(state => state.profile);

  return (
    <UserLayout title="Chat" fixedFromLarge>
      <div className="w-full py-6 md:py-10 lg:flex lg:min-h-0 lg:flex-1 lg:py-0">
        <ChatWorkspace mode="client" currentClientId={profile?.clientId ?? ''} />
      </div>
    </UserLayout>
  );
}
