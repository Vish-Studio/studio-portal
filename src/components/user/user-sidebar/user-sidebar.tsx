import {
  Home,
  Calendar,
  Briefcase,
  CheckSquare,
  CreditCard,
  FileText,
  MessageCircle,
} from 'lucide-react';
import { FunctionComponent } from 'react';
import { useChatStore } from '@/src/store/chat';
import BaseSidebar, { type BaseSidebarProps, type SidebarNavItem } from '../../common/sidebar/base-sidebar';

type UserSidebarProps = Omit<BaseSidebarProps, 'navItems' | 'settingsPath' | 'rootPath'>;

const CURRENT_CLIENT_ID = 'c1';

const UserSidebar: FunctionComponent<UserSidebarProps> = (props) => {
  const conversation = useChatStore(state => state.conversations.find(
    item => (item.type ?? 'client') === 'client' && (item.participantId ?? item.clientId) === CURRENT_CLIENT_ID,
  ));
  const unreadChatCount = conversation?.messages.filter(
    message => message.senderRole === 'admin' && message.createdAt > (conversation.lastReadByClientAt ?? 0),
  ).length ?? 0;

  const navItems: SidebarNavItem[] = [
    { icon: <Home size={18} />, label: 'Dashboard', path: '/user' },
    { icon: <Calendar size={18} />, label: 'Calendar', path: '/user/calendar' },
    { icon: <Briefcase size={18} />, label: 'Projects', path: '/user/projects' },
    { icon: <CheckSquare size={18} />, label: 'Tasks', path: '/user/tasks' },
    { icon: <CreditCard size={18} />, label: 'Payments', path: '/user/payments' },
    { icon: <MessageCircle size={18} />, label: 'Chat', path: '/user/chat', badge: unreadChatCount },
    { icon: <FileText size={18} />, label: 'Documents', path: '/user/documents' },
  ];

  return (
    <BaseSidebar
      {...props}
      navItems={navItems}
      settingsPath="/user/settings"
      rootPath="/user"
    />
  );
};

export default UserSidebar;
