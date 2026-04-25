import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../search-bar/search-bar';
import MaterialIcon from '../material-icon/material-icon';
import { useUIStore } from '@/src/store/ui';
import ButtonIcon from '../button-icon/button-icon';
import DropdownMenu from '../dropdown-menu/dropdown-menu';
import type { DropdownMenuSectionType } from '../dropdown-menu/dropdown-menu';

interface TopbarProps {
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  title?: string;
}

const notifSections: DropdownMenuSectionType[] = [
  {
    header: 'Notifications',
    items: [
      { label: 'New Client Assigned', description: 'You have been assigned to Acme Inc.' },
      { label: 'System Update', description: 'Maintenance scheduled for tonight.' },
    ],
  },
];

const userMenuSections: DropdownMenuSectionType[] = [
  {
    header: 'Vishroy Seenarain',
    items: [
      { label: 'Profile', onClick: () => { } },
      { label: 'Settings', onClick: () => { } },
    ],
  },
  {
    items: [{ label: 'Log out', onClick: () => { }, danger: true }],
  },
];

const Topbar = ({ setIsMobileMenuOpen, title = 'Dashboard' }: TopbarProps) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const { searchQuery, setSearchQuery, clearSearch } = useUIStore();

  // Close mobile search and clear query on route change
  useEffect(() => {
    clearSearch();
    setIsMobileSearchOpen(false);
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setIsUserOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Close mobile search on Escape
  useEffect(() => {
    if (!isMobileSearchOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileSearchOpen(false);
        clearSearch();
      }
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [isMobileSearchOpen]);

  return (
    <div className="topbar border-none">
      {/* Main row */}
      <div className="flex items-center justify-between gap-4">
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

        {/* Desktop search */}
        <SearchBar
          className="hidden sm:block"
          placeholder="Search here..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {/* Right icons */}
        <div className="flex items-center gap-2 sm:gap-4 justify-end">
          {/* Mobile search toggle */}
          <ButtonIcon
            className="sm:hidden"
            iconName={isMobileSearchOpen ? 'close' : 'search'}
            aria-label={isMobileSearchOpen ? 'Close search' : 'Open search'}
            clickHandler={() => {
              if (isMobileSearchOpen) clearSearch();
              setIsMobileSearchOpen(v => !v);
            }}
          />

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <ButtonIcon
              iconName="notifications"
              aria-label="Notifications"
              clickHandler={() => { setIsNotifOpen(v => !v); setIsUserOpen(false); }}
            >
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-(--color-surface)" />
            </ButtonIcon>

            {isNotifOpen && (
              <DropdownMenu sections={notifSections} width="w-72" align="right" />
            )}
          </div>

          {/* User */}
          <div className="relative" ref={userRef}>
            <ButtonIcon
              iconName="person"
              aria-label="User menu"
              clickHandler={() => { setIsUserOpen(v => !v); setIsNotifOpen(false); }}
            />

            {isUserOpen && (
              <DropdownMenu sections={userMenuSections} width="w-48" align="right" />
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar — slides in below the main row */}
      {isMobileSearchOpen && (
        <div className="sm:hidden mt-3 animate-in slide-in-from-top-1 fade-in duration-150">
          <SearchBar
            className="w-full!"
            placeholder="Search here..."
            value={searchQuery}
            onChange={setSearchQuery}
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default Topbar;
