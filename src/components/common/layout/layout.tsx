import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/sidebar';
import Topbar from '../topbar/topbar';
import { useUIStore } from '@/src/store/ui';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  fullHeight?: boolean;
  /** Hide the search bar in the topbar (e.g. document editor pages) */
  hideSearch?: boolean;
  /** Replace the search bar with custom content (e.g. breadcrumb trail) */
  topbarActions?: React.ReactNode;
}

const Layout = ({ children, title, fullHeight, hideSearch, topbarActions }: LayoutProps) => {
  const { isSidebarOpen, setIsSidebarOpen } = useUIStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-screen bg-white flex overflow-hidden font-sans">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isMobile={isMobile}
      />
      <div className="flex-1 flex flex-col w-full overflow-hidden relative">
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8">
          <Topbar
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          title={title}
          hideSearch={hideSearch}
          actions={topbarActions}
        />
        </div>

        {fullHeight ? (
          <div className="flex-1 overflow-hidden flex flex-col px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
            {children}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-10">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
