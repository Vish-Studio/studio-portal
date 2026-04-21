import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell } from 'lucide-react';

interface TopbarProps {
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  title?: string;
}

export default function Topbar({ setIsMobileMenuOpen, title = "Dashboard" }: TopbarProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="topbar flex items-center justify-between gap-4">
      {/* Left: Page Title & Mobile Menu */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-gray-700 hover:text-black shrink-0"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-(--color-ink)">{title}</h2>
      </div>

      {/* Search Bar - hide on very small screens, expand on larger */}
      <div className="hidden sm:flex relative items-center max-w-sm w-full">
        <Search size={18} className="absolute left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full bg-(--color-surface) rounded-full py-2.5 pl-10 pr-4 text-sm outline-none border border-transparent focus:border-gray-200 focus:bg-white transition-all shadow-sm"
        />
      </div>

      {/* Middle & Right Components */}
      <div className="flex items-center gap-4 sm:gap-6 justify-end">
        {/* Mobile Search Button */}
        <button className="sm:hidden w-10 h-10 rounded-full bg-(--color-surface) flex items-center justify-center shrink-0">
          <Search size={18} className="text-gray-600" />
        </button>

        {/* Notification Dropdown Custom */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsUserOpen(false); }}
            className="w-10 h-10 rounded-full bg-(--color-surface) hover:bg-gray-100 flex items-center justify-center relative transition-colors shadow-sm border border-gray-100"
          >
            <Bell size={18} className="text-gray-600" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-(--color-surface)"></div>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-[280px] bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 font-semibold text-sm text-gray-800">Notifications</div>
              <div className="h-px bg-gray-100 my-1 w-full" />
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex flex-col gap-1 transition-colors">
                <span className="font-semibold text-sm">New Client Assigned</span>
                <span className="text-xs text-gray-500">You have been assigned to Acme Inc.</span>
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex flex-col gap-1 transition-colors">
                <span className="font-semibold text-sm">System Update</span>
                <span className="text-xs text-gray-500">Maintenance scheduled for tonight.</span>
              </button>
            </div>
          )}
        </div>

        {/* User Dropdown Custom */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setIsUserOpen(!isUserOpen); setIsNotifOpen(false); }}
            className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex flex-col justify-center items-center shadow-sm border border-gray-100 ring-2 ring-transparent focus:ring-gray-300 outline-none transition-all"
          >
            <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-orange-400"></div>
          </button>

          {isUserOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 font-semibold text-sm text-gray-800">My Account</div>
              <div className="h-px bg-gray-100 my-1 w-full" />
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Profile</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Billing</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Team</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Subscription</button>
              <div className="h-px bg-gray-100 my-1 w-full" />
              <button className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Log out</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
