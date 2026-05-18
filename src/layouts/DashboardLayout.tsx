import type { ReactNode } from 'react';
import AppShell from './AppShell';
import AdminSidebar from './AdminSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  fullHeight?: boolean;
  fixedFromLarge?: boolean;
  /** Hide the search bar in the topbar (e.g. document editor pages) */
  hideSearch?: boolean;
  /** Replace the search bar with custom content (e.g. breadcrumb trail) */
  topbarActions?: ReactNode;
}

const DashboardLayout = ({ children, title, fullHeight, fixedFromLarge, hideSearch, topbarActions }: DashboardLayoutProps) => {
  return (
    <AppShell
      title={title}
      fullHeight={fullHeight}
      fixedFromLarge={fixedFromLarge}
      hideSearch={hideSearch}
      topbarActions={topbarActions}
      sidebar={(props) => <AdminSidebar {...props} />}
    >
      {children}
    </AppShell>
  );
};

export default DashboardLayout;
