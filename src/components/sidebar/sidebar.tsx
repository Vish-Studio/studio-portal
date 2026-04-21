import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Receipt, 
  Briefcase, 
  CheckSquare, 
  Calendar, 
  FileText, 
  LayoutTemplate, 
  Command, 
  PanelLeftClose, 
  X, 
  Settings 
} from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isMobile
}: SidebarProps) {
  const isExpanded = isMobile ? true : isSidebarOpen;
  const location = useLocation();

  const navItems = [
    { icon: <Home size={22} />, label: "Home", path: "/" },
    { icon: <Users size={22} />, label: "Clients", path: "/clients" },
    { icon: <Receipt size={22} />, label: "Expenses", path: "/expenses" },
    { icon: <Briefcase size={22} />, label: "Projects", path: "/projects" },
    { icon: <CheckSquare size={22} />, label: "Tasks", path: "/tasks" },
    { icon: <Calendar size={22} />, label: "Calendar", path: "/calendar" },
    { icon: <FileText size={22} />, label: "Documents", path: "/documents" },
    { icon: <LayoutTemplate size={22} />, label: "Templates", path: "/templates" },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[90] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Expandable Dark Sidebar */}
      <div 
        className={`bg-[#101113] flex flex-col py-6 lg:py-8 justify-between shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-[100] md:z-50
          ${isMobile 
             ? `fixed inset-y-0 left-0 w-[260px] px-4 m-0 rounded-none transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}` 
             : `relative md:flex md:my-4 md:lg:my-6 md:ml-4 md:lg:ml-6 md:rounded-[32px] ${isSidebarOpen ? 'md:w-[260px] md:px-4 md:items-stretch' : 'md:w-[84px] md:items-center md:px-4'}`
          }
        `}
      >
        <div className={`flex flex-col ${isExpanded ? 'items-stretch gap-2' : 'items-center gap-6'}`}>
          {/* Logo & Toggle */}
          <div className={`flex items-center mb-6 transition-all ${isExpanded ? 'justify-between px-2' : 'justify-center w-full'}`}>
            <div 
               className={`flex items-center text-white transition-all ${isExpanded ? 'gap-3' : 'justify-center border border-[#2d2f33] rounded-[18px] w-[52px] h-[52px] cursor-pointer hover:bg-white/5'}`}
               onClick={() => {
                  if (!isExpanded) setIsSidebarOpen(true);
               }}
            >
              {isExpanded ? (
                <div className="border border-[#2d2f33] rounded-[18px] flex items-center justify-center w-10 h-10 shrink-0">
                  <Command size={20} className="text-[#E0FE8A]" />
                </div>
              ) : (
                <Command size={24} className="shrink-0 text-[#E0FE8A]" />
              )}
              {isExpanded && <span className="font-bold text-lg whitespace-nowrap text-white">Acme Inc.</span>}
            </div>
            
            {/* Collapse / Close Toggle */}
            {isExpanded && (
              <>
                <button 
                  className="w-8 h-8 flex items-center justify-center shrink-0 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors md:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={20} />
                </button>
                <button 
                  className="hidden md:flex w-8 h-8 items-center justify-center shrink-0 rounded-full text-gray-400 hover:text-white hover:bg-[#2d2f33] transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <PanelLeftClose size={20} />
                </button>
              </>
            )}
          </div>

          {/* Nav Icons */}
          <div className="flex flex-col gap-2 text-[#676a71]">
            {navItems.map((item) => {
               const isActive = location.pathname === item.path;
               const btnClass = isActive 
                 ? `bg-[#2a2c31] text-white shadow-md flex items-center shrink-0 ${isExpanded ? 'w-full rounded-[16px] px-4 py-3' : 'w-[48px] h-[48px] rounded-[16px] justify-center'}`
                 : `text-[#676a71] hover:text-white transition-colors flex items-center shrink-0 ${isExpanded ? 'w-full rounded-[16px] px-4 py-3 hover:bg-white/5' : 'w-[48px] h-[48px] rounded-[16px] justify-center hover:bg-white/5'}`;
               
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
                   {/* Custom Tailwind Tooltip */}
                   <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 hidden group-hover:block bg-[#2a2c31] text-white rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap z-[100] shadow-md border border-gray-700/50">
                     {item.label}
                   </div>
                 </div>
               );
            })}
          </div>
        </div>

        {/* Bottom Settings */}
        <div className={`flex flex-col ${isExpanded ? 'items-stretch gap-2' : 'items-center gap-4'}`}>
          {(() => {
            const isActive = location.pathname === '/settings';
            const btnClass = isActive
              ? `bg-[#2a2c31] text-white shadow-md transition-colors flex items-center shrink-0 ${isExpanded ? 'w-full rounded-[16px] px-4 py-3' : 'w-[48px] h-[48px] rounded-[16px] justify-center'}`
              : `text-[#676a71] hover:text-white transition-colors flex items-center shrink-0 ${isExpanded ? 'w-full rounded-[16px] px-4 py-3 hover:bg-white/5' : 'w-[48px] h-[48px] rounded-[16px] justify-center hover:bg-white/5'}`;

            return isExpanded ? (
              <Link to="/settings" className={btnClass}>
                <div className="shrink-0 flex items-center justify-center"><Settings size={22} /></div>
                <span className="ml-4 font-medium text-[15px] whitespace-nowrap">Settings</span>
              </Link>
            ) : (
              <div className="group relative flex justify-center">
                <Link to="/settings" className={btnClass}>
                  <div className="shrink-0 flex items-center justify-center"><Settings size={22} /></div>
                </Link>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 hidden group-hover:block bg-[#2a2c31] text-white rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap z-[100] shadow-md border border-gray-700/50">
                  Settings
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}
