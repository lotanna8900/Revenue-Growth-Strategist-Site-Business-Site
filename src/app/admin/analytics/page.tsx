import { createServerSupabaseClient } from '@/lib/supabase/server';
import { FileText, Briefcase, ShoppingBag, MessageSquare } from 'lucide-react';
import React from 'react';

// Simple stat card component for this page for now
function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold text-brand-900 mt-4 mb-1">{value}</div>
      <div className="text-brand-600 text-sm font-medium">{title}</div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const supabase = await createServerSupabaseClient();

  // Can fetch data in parallel idk
  const [
    { count: blogCount },
    { count: projectCount },
    { count: productCount },
    { count: commentCount },
  ] = await Promise.all([
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('comments').select('id', { count: 'exact', head: true }),
  ]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-brand-900 mb-2">
          Analytics & Insights
        </h1>
        <p className="text-brand-600 text-lg">
          A high-level overview of your site's content and performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Blog Posts"
          value={blogCount ?? 0}
          icon={FileText}
          color="from-brand-600 to-brand-700"
        />
        <StatCard
          title="Total Projects"
          value={projectCount ?? 0}
          icon={Briefcase}
          color="from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Total Products"
          value={productCount ?? 0}
          icon={ShoppingBag}
          color="from-accent-rose to-accent-gold"
        />
        <StatCard
          title="Total Comments"
          value={commentCount ?? 0}
          icon={MessageSquare}
          color="from-green-500 to-emerald-600"
        />
      </div>

      {/* Placeholder for future charts */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-brand-900 mb-6">
          Site Traffic (Coming Soon)
        </h2>
        <div className="h-64 flex items-center justify-center bg-brand-50 rounded-lg">
          <p className="text-brand-600">
            Google Analytics 4 integration will be added here.
          </p>
        </div>
      </div>
    </div>
  );
}