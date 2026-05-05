import type { ReactNode } from 'react';
import UserSidebar from '../user-sidebar/user-sidebar';
import AppShell from '../../common/app-shell/app-shell';

interface UserLayoutProps {
  children: ReactNode;
  title?: string;
  fullHeight?: boolean;
  hideSearch?: boolean;
  topbarActions?: ReactNode;
}

const UserLayout = ({ children, title, fullHeight, hideSearch, topbarActions }: UserLayoutProps) => {
  return (
    <AppShell
      title={title}
      fullHeight={fullHeight}
      hideSearch={hideSearch}
      topbarActions={topbarActions}
      sidebar={(props) => <UserSidebar {...props} />}
    >
      {children}
    </AppShell>
  );
};

export default UserLayout;
