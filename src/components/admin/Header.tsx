'use client';

import { Menu } from 'lucide-react';

type HeaderProps = {
  setIsOpen: (isOpen: boolean) => void;
};

export default function Header({ setIsOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-md p-4 flex justify-between items-center md:p-6">
      
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Page title (can be dynamic later) */}
      <h1 className="text-xl font-semibold text-brand-text">
        Dashboard
      </h1>
      
      <div>
        {/* User avatar/logout (from desktop navbar) */}
        <div className="w-10 h-10 bg-brand-accent rounded-full"></div>
      </div>
    </header>
  );
}