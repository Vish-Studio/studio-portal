import type { FunctionComponent, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PanelLeftClose, Settings, X } from '@/src/shared/components/material-icon/material-lucide-icons';

export interface SidebarNavItem {
  icon: ReactNode;
  label: string;
  path: string;
  badge?: number;
}

export interface BaseSidebarProps {
  navItems: SidebarNavItem[];
  settingsPath: string;
  rootPath: string;
  rootExact?: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

const formatBadge = (count: number, compact = true) => {
  if (compact && count > 9) return '9+';
  if (!compact && count > 99) return '99+';
  return count;
};

const BaseSidebar: FunctionComponent<BaseSidebarProps> = ({
  navItems,
  settingsPath,
  rootPath,
  rootExact = true,
  isSidebarOpen,
  setIsSidebarOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isMobile,
}) => {
  const isExpanded = isMobile ? true : isSidebarOpen;
  const location = useLocation();

  const isRouteActive = (path: string) => {
    const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
    if (rootExact && normalizedPath === rootPath) return location.pathname === rootPath;
    return location.pathname === normalizedPath || location.pathname.startsWith(`${normalizedPath}/`);
  };

  const renderNavLink = (item: SidebarNavItem) => {
    const isActive = isRouteActive(item.path);
    const hasBadge = !!item.badge && item.badge > 0;
    const showIconBadge = hasBadge && (!isExpanded || isMobile);
    const showRowBadge = hasBadge && isExpanded && !isMobile;
    const btnClass = isActive
      ? `bg-(--color-sidebar-active) text-white shadow-md flex items-center shrink-0 ${isExpanded ? 'w-full rounded-[16px] px-4 py-3' : 'w-10 h-10 rounded-[14px] justify-center lg:w-12 lg:h-12 lg:rounded-[16px]'}`
      : `text-(--color-sidebar-text) hover:text-white transition-colors flex items-center shrink-0 ${isExpanded ? 'w-full rounded-[16px] px-4 py-3 hover:bg-white/5' : 'w-10 h-10 rounded-[14px] justify-center hover:bg-white/5 lg:w-12 lg:h-12 lg:rounded-[16px]'}`;

    const content = (
      <>
        <div className="sidebar-item-icon relative shrink-0 flex items-center justify-center">
          {item.icon}
          {showIconBadge && (
            <span className="sidebar-item-icon-badge type-sidebar-badge absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--color-accent-lime) px-1 text-(--color-ink)">
              {formatBadge(item.badge ?? 0)}
            </span>
          )}
        </div>
        {isExpanded && <span className="sidebar-item-label type-sidebar-label ml-4 whitespace-nowrap">{item.label}</span>}
        {showRowBadge && (
          <span className="sidebar-item-badge type-sidebar-badge ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-(--color-accent-lime) px-1.5 text-(--color-ink)">
            {formatBadge(item.badge ?? 0, false)}
          </span>
        )}
      </>
    );

    if (isExpanded) {
      return (
        <Link to={item.path} key={item.label} className={`sidebar-item ${btnClass}`}>
          {content}
        </Link>
      );
    }

    return (
      <div key={item.label} className="sidebar-item-wrap group relative flex justify-center">
        <Link to={item.path} className={`sidebar-item ${btnClass}`}>
          {content}
        </Link>
        <div className="sidebar-tooltip type-sidebar-tooltip absolute left-full top-1/2 z-100 ml-4 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-gray-700/50 bg-(--color-sidebar-active) px-3 py-1.5 text-white shadow-md group-hover:block">
          {item.label}
        </div>
      </div>
    );
  };

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="sidebar-mobile-overlay fixed inset-0 bg-black/40 z-90 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <header
        className={`sidebar bg-(--color-sidebar-bg) flex flex-col overflow-hidden py-6 lg:py-8 lg:pb-4 justify-between shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-100 md:z-50
          ${!isExpanded ? '[&_.sidebar-item-icon_svg]:h-4 [&_.sidebar-item-icon_svg]:w-4 lg:[&_.sidebar-item-icon_svg]:h-[18px] lg:[&_.sidebar-item-icon_svg]:w-[18px]' : ''}
          ${isMobile
            ? `fixed inset-y-0 left-0 w-65 px-4 m-0 rounded-none transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `relative md:flex md:my-4 md:ml-4 md:rounded-[32px] lg:my-2 lg:ml-2 ${isSidebarOpen ? 'md:w-65 md:px-4 md:items-stretch' : 'md:w-21 md:items-center md:px-4 md:pb-4'}`
          }
        `}
      >
        <div className={`sidebar-main flex min-h-0 flex-1 flex-col ${isExpanded ? 'items-stretch gap-2' : 'items-center gap-3 lg:gap-6'}`}>
          <div className={`sidebar-brand-row flex shrink-0 items-center transition-all ${isExpanded ? 'mb-6 justify-between px-2' : 'mb-4 w-full justify-center lg:mb-6'}`}>
            <div
              className={`sidebar-brand flex items-center text-white transition-all ${isExpanded ? 'gap-3' : 'h-11 w-11 cursor-pointer justify-center rounded-[16px] border border-(--color-sidebar-border-dark) hover:bg-white/5 lg:h-13 lg:w-13 lg:rounded-[18px]'}`}
              onClick={() => {
                if (!isExpanded) setIsSidebarOpen(true);
              }}
            >
              {isExpanded ? (
                <div className="sidebar-logo border border-(--color-sidebar-border-dark) rounded-[18px] flex items-center justify-center w-10 h-10 shrink-0">
                  <img src="/assets/logo-white-trans.png" alt="Logo" width={32} height={32} />
                </div>
              ) : (
                <img src="/assets/logo-white-trans.png" alt="Logo" width={28} height={28} />
              )}
              {isExpanded && <span className="sidebar-brand-text type-sidebar-brand whitespace-nowrap text-white">studio <span className="font-normal">portal</span></span>}
            </div>

            {isExpanded && (
              <>
                <button
                  className="sidebar-close w-8 h-8 flex items-center justify-center shrink-0 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors md:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={20} />
                </button>
                <button
                  className="sidebar-collapse hidden md:flex w-8 h-8 items-center justify-center shrink-0 rounded-full text-gray-400 hover:text-white hover:bg-(--color-sidebar-border-dark) transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <PanelLeftClose size={18} />
                </button>
              </>
            )}
          </div>

          <div className={`sidebar-nav min-h-0 flex-1 overflow-y-auto text-(--color-sidebar-text) no-scrollbar ${isExpanded ? 'flex flex-col gap-2' : 'flex flex-col items-center gap-3 lg:gap-4'}`}>
            {navItems.map(renderNavLink)}
          </div>
        </div>

        <div className={`sidebar-footer shrink-0 flex flex-col ${isExpanded ? 'items-stretch gap-2 pt-4' : 'items-center gap-4 pt-4'}`}>
          {renderNavLink({ icon: <Settings size={18} />, label: 'Settings', path: settingsPath })}
        </div>
      </header>
    </>
  );
};

export default BaseSidebar;
