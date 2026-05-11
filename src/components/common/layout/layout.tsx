import type { ReactNode } from 'react';
import Sidebar from '../sidebar/sidebar';
import AppShell from '../app-shell/app-shell';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  fullHeight?: boolean;
  fixedFromLarge?: boolean;
  /** Hide the search bar in the topbar (e.g. document editor pages) */
  hideSearch?: boolean;
  /** Replace the search bar with custom content (e.g. breadcrumb trail) */
  topbarActions?: ReactNode;
}

const Layout = ({ children, title, fullHeight, fixedFromLarge, hideSearch, topbarActions }: LayoutProps) => {
  return (
    <AppShell
      title={title}
      fullHeight={fullHeight}
      fixedFromLarge={fixedFromLarge}
      hideSearch={hideSearch}
      topbarActions={topbarActions}
      sidebar={(props) => <Sidebar {...props} />}
    >
      {children}
    </AppShell>
  );
};

export default Layout;
