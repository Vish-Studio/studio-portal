import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  Briefcase,
  CheckSquare,
  CreditCard,
  FileText,
  Settings,
  PanelLeftClose,
  X,
} from 'lucide-react';
import { FunctionComponent } from 'react';

interface UserSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

const navItems = [
  { icon: <Home size={18} />, label: 'Dashboard', path: '/user' },
  { icon: <Calendar size={18} />, label: 'Calendar', path: '/user/calendar' },
  { icon: <Briefcase size={18} />, label: 'Projects', path: '/user/projects' },
  { icon: <CheckSquare size={18} />, label: 'Tasks', path: '/user/tasks' },
  { icon: <CreditCard size={18} />, label: 'Payments', path: '/user/payments' },
  { icon: <FileText size={18} />, label: 'Documents', path: '/user/documents' },
];

const UserSidebar: FunctionComponent<UserSidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isMobile,
}) => {
  const isExpanded = isMobile ? true : isSidebarOpen;
  const location = useLocation();

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="sidebar-mobile fixed inset-0 bg-black/40 z-90 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <header
        className={`sidebar bg-(--color-sidebar-bg) flex flex-col py-6 lg:py-8 lg:pb-4 justify-between shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-100 md:z-50
          ${isMobile
            ? `fixed inset-y-0 left-0 w-65 px-4 m-0 rounded-none transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `relative md:flex md:my-4 md:lg:my-2 md:ml-4 md:lg:ml-2 md:rounded-[32px] ${isSidebarOpen ? 'md:w-65 md:px-4 md:items-stretch' : 'md:w-21 md:items-center md:px-4 pb-1'}`
          }
        `}
      >
        <div className={`flex flex-col ${isExpanded ? 'items-stretch gap-2' : 'items-center gap-6'}`}>
          {/* Logo & Toggle */}
          <div className={`flex items-center mb-6 transition-all ${isExpanded ? 'justify-between px-2' : 'justify-center w-full'}`}>
            <div
              className={`flex items-center text-white transition-all ${isExpanded ? 'gap-3' : 'justify-center border border-(--color-sidebar-border-dark) rounded-[18px] w-13 h-13 cursor-pointer hover:bg-white/5'}`}
              onClick={() => { if (!isExpanded) setIsSidebarOpen(true); }}
            >
              {isExpanded ? (
                <div className="border border-(--color-sidebar-border-dark) rounded-[18px] flex items-center justify-center w-10 h-10 shrink-0">
                  <img src="/assets/logo-white-trans.png" alt="Logo" width={32} height={32} />
                </div>
              ) : (
                <img src="/assets/logo-white-trans.png" alt="Logo" width={32} height={32} />
              )}
              {isExpanded && (
                <span className="font-bold text-lg whitespace-nowrap text-white">
                  studio <span className="font-normal">portal</span>
                </span>
              )}
            </div>

            {isExpanded && (
              <>
                <button
                  className="w-8 h-8 flex items-center justify-center shrink-0 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors md:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={20} />
                </button>
                <button
                  className="hidden md:flex w-8 h-8 items-center justify-center shrink-0 rounded-full text-gray-400 hover:text-white hover:bg-(--color-sidebar-border-dark) transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <PanelLeftClose size={18} />
                </button>
              </>
            )}
          </div>

          {/* Nav Items */}
          <div className="flex flex-col gap-2 text-(--color-sidebar-text)">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const btnClass = isActive
                ? `bg-(--color-sidebar-active) text-white shadow-md flex items-center shrink-0 ${isExpanded ? 'w-full rounded-[16px] px-4 py-3' : 'w-[48px] h-[48px] rounded-[16px] justify-center'}`
                : `text-(--color-sidebar-text) hover:text-white transition-colors flex items-center shrink-0 ${isExpanded ? 'w-full rounded-[16px] px-4 py-3 hover:bg-white/5' : 'w-[48px] h-[48px] rounded-[16px] justify-center hover:bg-white/5'}`;

              return isExpanded ? (
                <Link to={item.path} key={item.label} className={btnClass}>
                  <div className="shrink-0 flex items-center justify-center">{item.icon}</div>
                  <span className="ml-4 font-medium text-[15px] whitespace-nowrap">{item.label}</span>
                </Link>
              ) : (
                <div key={item.label} className="group relative flex justify-center">
                  <Link to={item.path} className={btnClass}>
                    <div className="shrink-0 flex items-center justify-center">{item.icon}</div>
                  </Link>
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 hidden group-hover:block bg-(--color-sidebar-active) text-white rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap z-100 shadow-md border border-gray-700/50">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom: Settings */}
        <div className={`flex flex-col ${isExpanded ? 'items-stretch gap-2' : 'items-center gap-4'}`}>
          {(() => {
            const isActive = location.pathname === '/user/settings';
            const btnClass = isActive
              ? `bg-(--color-sidebar-active) text-white shadow-md transition-colors flex items-center shrink-0 ${isExpanded ? 'w-full rounded-[16px] px-4 py-3' : 'w-[48px] h-[48px] rounded-[16px] justify-center'}`
              : `text-(--color-sidebar-text) hover:text-white transition-colors flex items-center shrink-0 ${isExpanded ? 'w-full rounded-[16px] px-4 py-3 hover:bg-white/5' : 'w-[48px] h-[48px] rounded-[16px] justify-center hover:bg-white/5'}`;

            return isExpanded ? (
              <Link to="/user/settings" className={btnClass}>
                <div className="shrink-0 flex items-center justify-center"><Settings size={18} /></div>
                <span className="ml-4 font-medium text-[15px] whitespace-nowrap">Settings</span>
              </Link>
            ) : (
              <div className="group relative flex justify-center">
                <Link to="/user/settings" className={btnClass}>
                  <div className="shrink-0 flex items-center justify-center"><Settings size={18} /></div>
                </Link>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 hidden group-hover:block bg-(--color-sidebar-active) text-white rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap z-100 shadow-md border border-gray-700/50">
                  Settings
                </div>
              </div>
            );
          })()}
        </div>
      </header>
    </>
  );
};

export default UserSidebar;
