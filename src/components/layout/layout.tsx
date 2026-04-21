import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/sidebar';
import Topbar from '../topbar/topbar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
      <div className="flex-1 flex flex-col w-full max-w-[1600px] mx-auto overflow-hidden relative">
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 border-b border-gray-100/50">
          <Topbar setIsMobileMenuOpen={setIsMobileMenuOpen} title={title} />
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-10">
          {children}
        </div>
      </div>
    </div>
  );
}
