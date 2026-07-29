import type { FunctionComponent, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PanelLeftClose, Settings, X } from '@/src/shared/components/material-icon/material-lucide-icons';
import Tooltip from '@/src/shared/components/tooltip/tooltip';

export interface SidebarNavItem {
  icon: ReactNode;
  label: string;
  path: string;
  badge?: number;
  section?: string;
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
      ? `bg-(--color-accent-lime) text-(--color-ink) shadow-md flex items-center shrink-0 ${isExpanded ? 'w-full rounded-[14px] px-3.5 py-2.5' : 'w-10 h-10 rounded-[14px] justify-center lg:w-12 lg:h-12 lg:rounded-[16px]'}`
      : `text-(--color-sidebar-text) hover:text-white transition-colors flex items-center shrink-0 ${isExpanded ? 'w-full rounded-[14px] px-3.5 py-2.5 hover:bg-white/7' : 'w-10 h-10 rounded-[14px] justify-center hover:bg-white/5 lg:w-12 lg:h-12 lg:rounded-[16px]'}`;

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
        {isExpanded && <span className="sidebar-item-label type-sidebar-label ml-3.5 whitespace-nowrap">{item.label}</span>}
        {showRowBadge && (
          <span className="sidebar-item-badge type-sidebar-badge ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-(--color-accent-lime) px-1.5 text-(--color-ink)">
            {formatBadge(item.badge ?? 0, false)}
          </span>
        )}
      </>
    );

    if (isExpanded) {
      return (
        <Link to={item.path} key={`${item.section ?? 'main'}-${item.path}`} className={`sidebar-item ${btnClass}`}>
          {content}
        </Link>
      );
    }

    return (
      <div key={`${item.section ?? 'main'}-${item.path}`} className="sidebar-item-wrap flex justify-center">
        <Tooltip className='bg-(--color-ink)' content={item.label} side="right" variant="sidebar">
          <Link to={item.path} className={`sidebar-item ${btnClass}`}>
            {content}
          </Link>
        </Tooltip>
      </div>
    );
  };

  const renderNavItems = () => {
    const hasSections = navItems.some(item => item.section);
    if (!hasSections) {
      return navItems.map(item => (
        <div key={`${item.section ?? 'main'}-${item.path}`} className="sidebar-item-slot flex flex-col">
          {renderNavLink(item)}
        </div>
      ));
    }

    const groups = navItems.reduce<Array<{ section: string; items: SidebarNavItem[] }>>((result, item) => {
      const section = item.section ?? 'Main';
      const current = result.at(-1);
      if (current?.section === section) {
        current.items.push(item);
        return result;
      }
      result.push({ section, items: [item] });
      return result;
    }, []);

    if (!isExpanded) {
      return groups.map(group => (
        <div key={group.section} className="sidebar-section-collapsed flex flex-col items-center gap-1.5 border-b border-white/7 pb-2 last:border-b-0 last:pb-0">
          {group.items.map(renderNavLink)}
        </div>
      ));
    }

    return groups.map(group => (
      <section
        key={group.section}
        className="sidebar-section rounded-[20px] border border-white/6 bg-white/[0.025] p-2"
      >
        <p className="sidebar-section-label type-sidebar-badge px-2.5 pb-2 pt-1 text-[10px] uppercase tracking-[0.18em] text-gray-500">
          {group.section}
        </p>
        <div className="sidebar-section-items flex flex-col gap-1">
          {group.items.map(renderNavLink)}
        </div>
      </section>
    ));
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
          ${!isExpanded ? '[&_.sidebar-item-icon_svg]:h-4 [&_.sidebar-item-icon_svg]:w-4 lg:[&_.sidebar-item-icon_svg]:h-4.5 lg:[&_.sidebar-item-icon_svg]:w-4.5' : ''}
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
              {isExpanded && <span className="sidebar-brand-text brand-wordmark type-sidebar-brand whitespace-nowrap text-white">studio <span className="brand-wordmark-light">portal</span></span>}
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

          <div className={`sidebar-nav min-h-0 flex-1 overflow-y-auto text-(--color-sidebar-text) no-scrollbar ${isExpanded ? 'flex flex-col gap-3 pr-1' : 'flex flex-col items-center gap-2 lg:gap-3'}`}>
            {renderNavItems()}
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
