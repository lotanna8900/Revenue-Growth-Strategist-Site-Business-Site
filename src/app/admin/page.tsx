import {
  TrendingUp,
  ShoppingBag,
  FileText,
  Users,
  DollarSign,
  Eye,
  MessageSquare,
  ArrowUpRight,
  Briefcase
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Revenue', value: '$12,450', change: '+12.5%', icon: DollarSign, color: 'from-green-500 to-emerald-600' },
    { label: 'Page Views', value: '45,230', change: '+8.2%', icon: Eye, color: 'from-brand-600 to-brand-700' },
    { label: 'Products Sold', value: '234', change: '+23.1%', icon: ShoppingBag, color: 'from-accent-rose to-accent-gold' },
    { label: 'Active Users', value: '1,250', change: '+5.4%', icon: Users, color: 'from-blue-500 to-indigo-600' },
  ];

  const recentActivity = [
    { type: 'sale', message: 'New order #1234', time: '2 minutes ago' },
    { type: 'comment', message: 'New comment on "Summer Collection"', time: '15 minutes ago' },
    { type: 'project', message: 'Project "Website Redesign" updated', time: '1 hour ago' }, 
    { type: 'blog', message: 'New blog post published', time: '3 hours ago' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-brand-900 mb-2">Welcome back! 👋</h1>
        <p className="text-brand-600 text-lg">Here's what's happening with your business today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="stat-card animate-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <ArrowUpRight className="w-4 h-4" />
                {stat.change}
              </div>
            </div>
            <div className="text-3xl font-bold text-brand-900 mb-1">{stat.value}</div>
            <div className="text-brand-600 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-2xl font-bold text-brand-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-brand-900 font-medium">{activity.message}</p>
                  <p className="text-brand-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-brand-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: 'New Blog Post', icon: FileText, href: '/admin/blog/new' },
              { label: 'Add Product', icon: ShoppingBag, href: '/admin/products/new' },
              { label: 'New Project', icon: Briefcase, href: '/admin/projects/new' },
              { label: 'View Analytics', icon: TrendingUp, href: '/admin/analytics' },
            ].map((action, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 p-4 bg-brand-50 hover:bg-brand-100 rounded-lg transition-all duration-200 group"
              >
                <action.icon className="w-5 h-5 text-brand-600 group-hover:text-brand-700" />
                <span className="font-medium text-brand-900">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}