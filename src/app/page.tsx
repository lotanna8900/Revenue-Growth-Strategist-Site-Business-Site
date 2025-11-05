import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, ShoppingBag } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Business Development & Fashion</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Where Strategy Meets
              <span className="block mt-2 bg-gradient-to-r from-accent-gold to-accent-rose bg-clip-text text-transparent">
                Style
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-brand-100 max-w-3xl mx-auto">
              Professional business development services paired with a curated fashion collection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects" className="btn-primary inline-flex items-center gap-2 text-lg">
                View Projects <TrendingUp className="w-5 h-5" />
              </Link>
              <Link href="/store" className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 inline-flex items-center gap-2 text-lg">
                Shop Collection <ShoppingBag className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-50 to-transparent"></div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Projects Completed', value: '50+', icon: TrendingUp },
            { label: 'Happy Clients', value: '100+', icon: Sparkles },
            { label: 'Products Available', value: '200+', icon: ShoppingBag },
          ].map((stat, i) => (
            <div key={i} className="stat-card text-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-brand-600" />
              <div className="text-3xl font-bold text-brand-900 mb-1">{stat.value}</div>
              <div className="text-brand-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Sections Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Business Development */}
          <div className="glass-card p-8 group hover:shadow-2xl transition-all duration-500">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-brand-900 mb-4">Business Development</h2>
            <p className="text-brand-600 mb-6 text-lg leading-relaxed">
              Strategic consulting and business growth solutions tailored to your industry. 
              Proven track record of delivering results that matter.
            </p>
            <Link href="/projects" className="inline-flex items-center gap-2 text-brand-700 font-semibold group-hover:gap-4 transition-all">
              View Portfolio <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Fashion Store */}
          <div className="glass-card p-8 group hover:shadow-2xl transition-all duration-500">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-rose to-accent-gold rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-brand-900 mb-4">Fashion Collection</h2>
            <p className="text-brand-600 mb-6 text-lg leading-relaxed">
              Curated pieces that blend contemporary style with timeless elegance. 
              Discover fashion that empowers and inspires.
            </p>
            <Link href="/store" className="inline-flex items-center gap-2 text-brand-700 font-semibold group-hover:gap-4 transition-all">
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Access */}
      <section className="bg-gradient-to-r from-brand-700 to-brand-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Admin Access</h3>
          <p className="text-brand-100 mb-8">Manage your content, products, and analytics</p>
          <Link href="/admin" className="btn-primary bg-white text-brand-700 hover:bg-brand-50">
            Go to Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}