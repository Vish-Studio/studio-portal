import {
  Home,
  Users,
  Receipt,
  Briefcase,
  CheckSquare,
  Calendar,
  FileText,
  UserCircle2,
  KeyRound,
  CreditCard,
  MessageCircle,
  FileCheck2,
} from 'lucide-react';
import { FunctionComponent } from 'react';
import { useChatStore } from '@/src/features/chat';
import { useAuthStore } from '@/src/features/auth';
import { isStaffRole } from '@/src/auth/roleAccess';
import BaseSidebar, { type BaseSidebarProps, type SidebarNavItem } from './BaseSidebar';

type SidebarProps = Omit<BaseSidebarProps, 'navItems' | 'settingsPath' | 'rootPath'>;

const AdminSidebar: FunctionComponent<SidebarProps> = (props) => {
  const conversations = useChatStore(state => state.conversations);
  const profile = useAuthStore(state => state.profile);
  const unreadChatCount = conversations.reduce((total, conversation) => {
    const lastReadAt = conversation.lastReadByAdminAt ?? 0;
    return total + conversation.messages.filter(message => message.senderRole !== 'admin' && message.createdAt > lastReadAt).length;
  }, 0);

  const navItems: SidebarNavItem[] = [
    { icon: <Home size={18} />, label: 'Dashboard', path: '/admin', section: 'Overview' },
    { icon: <Calendar size={18} />, label: 'Calendar', path: '/admin/calendar', section: 'Overview' },
    { icon: <Users size={18} />, label: 'Clients', path: '/admin/clients', section: 'Work' },
    { icon: <Briefcase size={18} />, label: 'Projects', path: '/admin/projects', section: 'Work' },
    { icon: <CheckSquare size={18} />, label: 'Tasks', path: '/admin/tasks', section: 'Work' },
    { icon: <MessageCircle size={18} />, label: 'Chat', path: '/admin/chat', badge: unreadChatCount, section: 'Work' },
    { icon: <CreditCard size={18} />, label: 'Payments', path: '/admin/payments', section: 'Work' },
    { icon: <FileText size={18} />, label: 'Documents', path: '/admin/documents', section: 'Work' },
    { icon: <UserCircle2 size={18} />, label: 'Team', path: '/admin/team', section: 'Internal' },
    { icon: <KeyRound size={18} />, label: 'Users', path: '/admin/users', section: 'Internal' },
    ...(isStaffRole(profile?.role)
      ? [{ icon: <Receipt size={18} />, label: 'Expenses', path: '/admin/expenses', section: 'Internal' }]
      : []),
    { icon: <Receipt size={18} />, label: 'Pricing', path: '/admin/templates/pricing', section: 'Templates' },
    { icon: <FileText size={18} />, label: 'Doc Templates', path: '/admin/templates/documents', section: 'Templates' },
    { icon: <FileCheck2 size={18} />, label: 'Questionnaires', path: '/admin/templates/questionnaires', section: 'Templates' },
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

export default AdminSidebar;
