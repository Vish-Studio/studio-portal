import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import SearchBar from '../search-bar/search-bar';
import MaterialIcon from '../ui/material-icon';
import { useUIStore } from '../../store/ui';

interface TopbarProps {
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  title?: string;
}

export default function Topbar({ setIsMobileMenuOpen, title = "Dashboard" }: TopbarProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserOpen,  setIsUserOpen]  = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef  = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const { searchQuery, setSearchQuery, clearSearch } = useUIStore();

  // Clear search whenever the page changes
  useEffect(() => {
    clearSearch();
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
      if (userRef.current  && !userRef.current.contains(e.target as Node))  setIsUserOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div className="topbar flex items-center justify-between gap-4 border-none">
      {/* Left: mobile menu + page title */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-gray-700 hover:text-black shrink-0 flex items-center justify-center rounded-md transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <MaterialIcon name="menu" size={24} />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-(--color-ink)">{title}</h2>
      </div>

      {/* Global search — wired to ui store */}
      <SearchBar
        className="hidden sm:block"
        placeholder="Search here..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {/* Right icons */}
      <div className="flex items-center gap-2 sm:gap-4 justify-end">
        {/* Mobile search toggle */}
        <button className="sm:hidden w-10 h-10 rounded-full bg-(--color-surface) flex items-center justify-center shrink-0">
          <Search size={18} className="text-gray-600" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setIsNotifOpen(v => !v); setIsUserOpen(false); }}
            className="w-10 h-10 rounded-full bg-(--color-surface) text-gray-600 hover:bg-(--color-ink) hover:text-white flex items-center justify-center relative transition-colors"
          >
            <MaterialIcon name="notifications" size={18} />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-(--color-surface)" />
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

        {/* User */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setIsUserOpen(v => !v); setIsNotifOpen(false); }}
            className="w-10 h-10 rounded-full bg-(--color-surface) text-gray-600 hover:bg-(--color-ink) hover:text-white overflow-hidden flex flex-col justify-center items-center border border-gray-100 ring-2 ring-transparent focus:ring-gray-300 outline-none transition-all"
          >
            <MaterialIcon name="person" size={18} />
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
