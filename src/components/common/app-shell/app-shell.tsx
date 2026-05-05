import React, { useEffect, useState } from 'react';
import Topbar from '../topbar/topbar';
import { useUIStore } from '@/src/store/ui';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  fullHeight?: boolean;
  hideSearch?: boolean;
  topbarActions?: React.ReactNode;
  sidebar: (props: {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
    isMobile: boolean;
  }) => React.ReactNode;
  contentClassName?: string;
}

export default function AppShell({
  children,
  title,
  fullHeight,
  hideSearch,
  topbarActions,
  sidebar,
  contentClassName = '',
}: AppShellProps) {
  const { isSidebarOpen, setIsSidebarOpen } = useUIStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <div className="w-full h-screen flex overflow-hidden font-sans">
      {sidebar({
        isSidebarOpen,
        setIsSidebarOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isMobile,
      })}

      <div className="flex-1 flex flex-col w-full overflow-hidden relative bg-white">
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8">
          <Topbar
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            title={title}
            hideSearch={hideSearch}
            actions={topbarActions}
          />
        </div>

        {fullHeight ? (
          <div className={`flex-1 overflow-hidden flex flex-col px-4 sm:px-6 lg:px-8 pt-0 ${contentClassName}`}>
            {children}
          </div>
        ) : (
          <div className={`flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-10 pt-0 ${contentClassName}`}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
