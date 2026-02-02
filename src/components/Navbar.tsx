import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { logoutUser } from '@/app/(public)/auth/actions';
import SignInLink from './SignInLink';

const links = [
  { href: '/about', label: 'About' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/blog', label: 'Blog' },
  { href: '/store', label: 'Shop' },
];

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link href="/" className="text-2xl font-bold text-brand-800">
            Success Driven Amaka
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-brand-700 hover:text-brand-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Auth Links (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/account"
                  className="font-medium text-brand-700 hover:text-brand-900 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  My Account
                </Link>
                <form action={logoutUser}>
                  <button
                    type="submit"
                    className="font-medium text-brand-700 hover:text-brand-900 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <SignInLink className="btn-primary">
                Sign In
              </SignInLink>
            )}
          </div>
          
        </div>
      </div>
    </header>
  );
}