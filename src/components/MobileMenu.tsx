'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { logoutUser } from '@/app/(public)/auth/actions';
import SignInLink from './SignInLink';

// Define the type for the props
type NavLink = {
  href: string;
  label: string;
};
type UserNavProps = {
  isLoggedIn: boolean;
};

// Main links (mirrors the desktop nav)
const links: NavLink[] = [
  { href: '/about', label: 'About' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/blog', label: 'Blog' },
  { href: '/store', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
  { href: '/newsletter', label: 'Newsletter' },
];

export default function MobileMenu({ isLoggedIn }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-md text-brand-700 hover:text-brand-900"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Fullscreen Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-brand-50 p-6 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center mb-10">
          <Link
            href="/"
            className="text-2xl font-bold text-brand-800"
            onClick={() => setIsOpen(false)}
          >
            Success Driven Amaka
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2"
            aria-label="Close menu"
          >
            <X className="w-8 h-8 text-brand-700" />
          </button>
        </div>

        {/* Mobile Links */}
        <nav className="flex flex-col space-y-6 mb-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-2xl font-semibold text-brand-800 hover:text-brand-600"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-brand-200 pt-6">
          {isLoggedIn ? (
            <div className="space-y-4">
              <Link
                href="/account"
                className="btn-primary w-full text-center"
                onClick={() => setIsOpen(false)}
              >
                My Account
              </Link>
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="btn-secondary w-full"
                >
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <SignInLink
              className="btn-primary w-full text-center"
            >
              Sign In
            </SignInLink>
          )}
        </div>
      </div>
    </div>
  );
}