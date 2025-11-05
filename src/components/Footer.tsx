// src/components/Footer.tsx
import Link from 'next/link';
import { Linkedin, Instagram, Twitter } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/TikTokIcon';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function Footer() {
  // We can fetch the social links from settings later
  // For now, we'll link them directly.

  return (
    <footer className="bg-brand-800 text-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Brand */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Success Driven Amaka
            </h2>
            <p className="text-brand-300 mb-6">
              Revenue Growth Strategist
            </p>
            <div className="flex gap-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-700 hover:bg-brand-600 flex items-center justify-center transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-700 hover:bg-brand-600 flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-700 hover:bg-brand-600 flex items-center justify-center transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-700 hover:bg-brand-600 flex items-center justify-center transition-all">
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-white">About Me</Link></li>
              <li><Link href="/achievements" className="hover:text-white">Achievements</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/store" className="hover:text-white">Shop</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Join the Newsletter</h3>
            <p className="text-brand-300 mb-4">
              Get strategies and insights sent straight to your inbox.
            </p>
            <Link href="/newsletter" className="btn-primary">
              Subscribe Now
            </Link>
          </div>

        </div>

        {/* Bottom Bar with Admin Link */}
        <div className="border-t border-brand-700 mt-12 pt-8 text-sm text-brand-400 flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Success Driven Amaka. All rights reserved.</p>

        </div>
      </div>
    </footer>
  );
}