import {
  Home,
  Users,
  Receipt,
  Briefcase,
  CheckSquare,
  Calendar,
  FileText,
  LayoutTemplate,
  UserCircle2,
  CreditCard,
  MessageCircle,
} from 'lucide-react';
import { FunctionComponent } from 'react';
import { useChatStore } from '@/src/store/chat';
import { useAuthStore } from '@/src/store/auth';
import BaseSidebar, { type BaseSidebarProps, type SidebarNavItem } from './base-sidebar';

type SidebarProps = Omit<BaseSidebarProps, 'navItems' | 'settingsPath' | 'rootPath'>;

const Sidebar: FunctionComponent<SidebarProps> = (props) => {
  const conversations = useChatStore(state => state.conversations);
  const profile = useAuthStore(state => state.profile);
  const unreadChatCount = conversations.reduce((total, conversation) => {
    const lastReadAt = conversation.lastReadByAdminAt ?? 0;
    return total + conversation.messages.filter(message => message.senderRole !== 'admin' && message.createdAt > lastReadAt).length;
  }, 0);

  const navItems: SidebarNavItem[] = [
    { icon: <Home size={18} />, label: 'Dashboard', path: '/admin' },
    { icon: <Calendar size={18} />, label: 'Calendar', path: '/admin/calendar' },
    { icon: <CheckSquare size={18} />, label: 'Tasks', path: '/admin/tasks' },
    { icon: <MessageCircle size={18} />, label: 'Chat', path: '/admin/chat', badge: unreadChatCount },
    { icon: <Users size={18} />, label: 'Clients', path: '/admin/clients' },
    { icon: <Briefcase size={18} />, label: 'Projects', path: '/admin/projects' },
    { icon: <CreditCard size={18} />, label: 'Payments', path: '/admin/payments' },
    { icon: <FileText size={18} />, label: 'Documents', path: '/admin/documents' },
    { icon: <UserCircle2 size={18} />, label: 'Team', path: '/admin/team' },
    ...(profile?.role === 'superadmin'
      ? [{ icon: <Receipt size={18} />, label: 'Expenses', path: '/admin/expenses' }]
      : []),
    { icon: <LayoutTemplate size={18} />, label: 'Templates', path: '/admin/templates' },
  ];

  return (
    <BaseSidebar
      {...props}
      navItems={navItems}
      settingsPath="/admin/settings"
      rootPath="/admin"
    />
  );
};

export default Sidebar;
