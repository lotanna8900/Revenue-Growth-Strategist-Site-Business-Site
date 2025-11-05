'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutUser } from '@/app/(public)/auth/actions'; // Ensure this path is correct
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  FolderOpen,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Sparkles,
  Trophy,
  Users,
  ExternalLink, 
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: FileText, label: 'Blog Manager', href: '/admin/blog' },
  { icon: Trophy, label: 'Achievements', href: '/admin/achievements' },
  { icon: ShoppingBag, label: 'Products', href: '/admin/products' },
  { icon: FolderOpen, label: 'File Manager', href: '/admin/files' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: MessageSquare, label: 'Comments', href: '/admin/comments' },
  { icon: Users, label: 'Subscribers', href: '/admin/subscribers' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-brand-800 to-brand-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-brand-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-gold to-accent-rose rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Admin</h1>
            <p className="text-xs text-brand-300">Dashboard</p>
          </div>
        </div>
        
        {/* 2. "VIEW SITE" LINK */}
        <Link 
          href="/" 
          target="_blank" 
          className="flex items-center justify-center gap-2 w-full text-sm py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Public Site
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-brand-700 text-white shadow-lg'
                  : 'text-brand-300 hover:bg-brand-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-brand-700">
        <form action={logoutUser}>
          <button className="flex items-center gap-3 px-4 py-3 w-full text-brand-300 hover:bg-brand-700/50 hover:text-white rounded-lg transition-all duration-200">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}