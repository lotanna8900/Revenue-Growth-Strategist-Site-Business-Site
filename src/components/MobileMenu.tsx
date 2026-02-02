'use client';

import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { logoutUser } from '@/app/(public)/auth/actions';
import SignInLink from './SignInLink';
import { usePathname } from 'next/navigation';

type NavLink = {
  href: string;
  label: string;
};

type UserNavProps = {
  isLoggedIn: boolean;
};

const links = [
  { href: '/about', label: 'About' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/blog', label: 'Blog' },
  { href: '/store', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
  { href: '/newsletter', label: 'Newsletter' },
];

export default function MobileMenu({ isLoggedIn }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-5 z-50 p-2 rounded-lg text-brand-700 hover:text-brand-900 hover:bg-brand-100 transition-all duration-200"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay with Backdrop Blur */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ${ // <-- Highest z-index
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-brand-900/40 backdrop-blur-sm transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Menu Panel - 100% OPAQUE BACKGROUND */}
        <div
          className={`fixed top-0 right-0 w-full max-w-sm h-full bg-brand-50 shadow-2xl border-l border-brand-200/50 transition-transform duration-500 ease-out ${ // <-- SOLID bg-brand-50
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header Section */}
          <div className="relative p-6 border-b border-brand-200/50 bg-white">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-brand-100 transition-all duration-200 group"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-brand-700 group-hover:text-brand-900 group-hover:rotate-90 transition-transform duration-300" />
            </button>
            <Link
              href="/"
              className="block text-xl font-bold text-brand-800 pr-12"
              onClick={() => setIsOpen(false)}
            >
              Success Driven Amaka
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-6 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between px-4 py-4 rounded-xl text-brand-800 hover:bg-brand-100/80 hover:text-brand-900 transition-all duration-300 transform hover:translate-x-2"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-lg font-semibold">{link.label}</span>
                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Auth Section - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-brand-200/50 bg-white">
            {isLoggedIn ? (
              <div className="space-y-3">
                <Link
                  href="/account"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl font-semibold hover:from-brand-700 hover:to-brand-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-5 h-5" />
                  My Account
                </Link>
                <form action={logoutUser}>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border-2 border-brand-300 text-brand-700 rounded-xl font-semibold hover:bg-brand-50 hover:border-brand-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <SignInLink className="block w-full px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-center rounded-xl font-semibold hover:from-brand-700 hover:to-brand-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                <span onClick={() => setIsOpen(false)}>Sign In</span>
              </SignInLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}