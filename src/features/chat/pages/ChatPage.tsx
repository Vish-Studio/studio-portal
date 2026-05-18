import DashboardLayout from '@/src/layouts/DashboardLayout';
import ChatWorkspace from '../components/chat-workspace';

export default function ChatPage() {
  return (
    <DashboardLayout title="Chat" fixedFromLarge>
      <div className="w-full py-2 md:py-10 lg:flex lg:min-h-0 lg:flex-1 lg:py-0">
        <ChatWorkspace mode="admin" />
      </div>
    </DashboardLayout>
  );
}
