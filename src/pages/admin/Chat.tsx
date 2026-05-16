import Layout from '../../components/common/layout/layout';
import ChatWorkspace from '../../components/admin/chat/chat-workspace';

export default function Chat() {
  return (
    <Layout title="Chat" fixedFromLarge>
      <div className="w-full py-2 md:py-10 lg:flex lg:min-h-0 lg:flex-1 lg:py-0">
        <ChatWorkspace mode="admin" />
      </div>
    </Layout>
  );
}
