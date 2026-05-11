import UserLayout from '../../components/user/user-layout/user-layout';
import ChatWorkspace from '../../components/admin/chat/chat-workspace';

const CURRENT_CLIENT_ID = 'c1';

export default function UserChat() {
  return (
    <UserLayout title="Chat" fixedFromLarge>
      <div className="w-full py-6 md:py-10 lg:flex lg:min-h-0 lg:flex-1 lg:py-0">
        <ChatWorkspace mode="client" currentClientId={CURRENT_CLIENT_ID} />
      </div>
    </UserLayout>
  );
}
