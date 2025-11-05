import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { User, LogOut } from 'lucide-react';
import { logoutUser } from '@/app/(public)/auth/actions';
import MobileMenu from './MobileMenu'; 
import SignInLink from './SignInLink';

const links = [
  { href: '/about', label: 'About' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/blog', label: 'Blog' },
  { href: '/store', label: 'Shop' },
];

export default async function Navbar() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Left: Logo */}
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
            {user ? (
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

          {/* Mobile Menu Button */}
          <MobileMenu isLoggedIn={!!user} />
          
        </div>
      </div>
    </header>
  );
}