import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ArrowRight, Sparkles, TrendingUp, ShoppingBag, FileText, Trophy, Mail, Star, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import SectionWrapper from '@/components/SectionWrapper';

// Helper to fetch all homepage data in parallel
async function getHomepageData() {
  const supabase = await createServerSupabaseClient();

  const [
    settingsData,
    featuredProducts,
    featuredAchievements,
    latestPosts
  ] = await Promise.all([
    // 1. Get Site Settings
    supabase.from('site_settings').select('*'),
    
    // 2. Get Featured Products
    supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .eq('featured', true)
      .limit(4),
      
    // 3. Get Featured Achievements
    supabase
      .from('achievements')
      .select('*')
      .eq('status', 'completed')
      .eq('featured', true)
      .limit(3),
      
    // 4. Get Latest Blog Posts
    supabase
      .from('blog_posts')
      .select('*') 
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3)
  ]);

  // Convert settings array to a simple object
  const settings = settingsData.data?.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>) || {};

  return {
    settings,
    products: featuredProducts.data || [],
    achievements: featuredAchievements.data || [],
    posts: latestPosts.data || []
  };
}

// --- Enhanced Product Card ---
function ProductCard({ product }: { product: any }) {
  const primaryImage = product.images?.[0] || 'https://via.placeholder.com/300';
  const price = `₦${new Intl.NumberFormat('en-NG').format(product.sale_price || product.price)}`;
  const originalPrice = product.sale_price ? `₦${new Intl.NumberFormat('en-NG').format(product.price)}` : null;
  
  return (
    <Link
      href={`/store/${product.slug}`}
      className="glass-card group flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
    >
      {/* Image with overlay on hover */}
      <div className="relative w-full aspect-square overflow-hidden bg-brand-100">
        <img 
          src={primaryImage} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        
        {/* Sale Badge */}
        {product.sale_price && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
            SALE
          </div>
        )}
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
          <span className="text-white font-semibold flex items-center gap-2">
            Quick View <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <p className="text-xs text-brand-500 uppercase tracking-wider mb-2 font-semibold">
            {product.category || 'Product'}
          </p>
          <h3 className="text-lg font-bold text-brand-900 mb-3 line-clamp-2 group-hover:text-brand-700 transition-colors">
            {product.name}
          </h3>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-2xl text-brand-800">{price}</span>
          {originalPrice && (
            <span className="text-sm text-brand-400 line-through">{originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// --- Enhanced Blog Post Card ---
function PostCard({ post }: { post: any }) {
  const excerpt = (post.excerpt || post.content?.replace(/<[^>]+>/g, '') || '').substring(0, 120) + '...';
  const postImage = post.featured_image || 'https://via.placeholder.com/400x300';
  
  // Format date nicely
  const publishDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    : 'Recently';
  
  // Estimate reading time (roughly 200 words per minute)
  const wordCount = (post.content?.replace(/<[^>]+>/g, '') || '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  
  return (
    <Link 
      href={`/blog/${post.slug}`} 
      className="glass-card group flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
    >
      {/* Featured Image with Gradient Overlay */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-brand-100">
        <img 
          src={postImage} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        
        {/* Category Badge */}
        {post.category && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            {post.category}
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      
      {/* Post Info */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-brand-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {publishDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readTime} min read
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-brand-900 mb-3 line-clamp-2 group-hover:text-brand-700 transition-colors">
            {post.title}
          </h3>
          <p className="text-brand-600 mb-4 leading-relaxed line-clamp-3">{excerpt}</p>
        </div>
        
        {/* Read More Link */}
        <div className="inline-flex items-center gap-2 text-brand-700 font-semibold group-hover:gap-4 transition-all pt-4 border-t border-brand-100">
          Read Article <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
}

// --- Achievement Card ---
function AchievementCard({ achievement }: { achievement: any }) {
  return (
    <Link 
      href={`/achievements/${achievement.slug}`} 
      className="glass-card p-8 group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden"
    >
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-200/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        
        {/* Title & Description */}
        <h3 className="text-2xl font-bold text-brand-900 mb-3 group-hover:text-brand-700 transition-colors">
          {achievement.title}
        </h3>
        <p className="text-brand-600 mb-6 leading-relaxed line-clamp-3">
          {achievement.description?.substring(0, 120) + '...'}
        </p>
        
        {/* Year Badge */}
        {achievement.year && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 rounded-full text-sm font-semibold text-brand-700 mb-4">
            <Calendar className="w-4 h-4" />
            {achievement.year}
          </div>
        )}
        
        {/* CTA */}
        <div className="inline-flex items-center gap-2 text-brand-700 font-semibold group-hover:gap-4 transition-all">
          View Case Study <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
}

// --- Main Page Component ---
export default async function HomePage() {
  const { settings, products, achievements, posts } = await getHomepageData();

  // Set defaults for text and images
  const heroTitle = settings.heroTitle || 'Success Driven Amaka';
  const heroSubtitle = settings.heroSubtitle || 'Revenue Growth Strategist';
  const heroDescription = settings.heroDescription || 'I help businesses build powerful revenue engines and coach individuals to achieve career clarity.';
  const img1 = settings.homepageImage1 || 'https://via.placeholder.com/600x800';
  const img2 = settings.homepageImage2 || 'https://via.placeholder.com/600x800';
  
  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-50 py-24 md:py-32">
        {/* Animated Background Blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-rose/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-brand-200 rounded-full mb-8 shadow-sm hover:shadow-md transition-shadow">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <span className="text-sm font-semibold text-brand-700 tracking-wide">{heroSubtitle}</span>
              </div>
              
              {/* Title with Gradient */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                <span className="text-brand-900">{heroTitle.split(' ')[0]}</span>{' '}
                <span className="text-brand-900">{heroTitle.split(' ')[1]}</span>{' '}
                <span className="bg-gradient-to-r from-brand-600 via-brand-700 to-accent-gold bg-clip-text text-transparent">
                  {heroTitle.split(' ')[2]}
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-xl md:text-2xl mb-10 text-brand-600 leading-relaxed max-w-lg">
                {heroDescription}
              </p>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/contact" 
                  className="btn-primary inline-flex items-center justify-center gap-2 text-lg group"
                >
                  Work With Me 
                  <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Link>
                <Link 
                  href="/achievements" 
                  className="btn-secondary inline-flex items-center justify-center gap-2 text-lg group"
                >
                  View Achievements 
                  <Trophy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
              </div>
              
              {/* Social Proof Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-brand-200">
                {[
                  { value: '50+', label: 'Projects' },
                  { value: '100+', label: 'Clients' },
                  { value: '45%', label: 'Avg Growth' }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-brand-800 mb-1">{stat.value}</div>
                    <div className="text-sm text-brand-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right: Animated Images */}
            <div className="relative h-96 lg:h-[36rem] animate-slide-up" style={{ animationDelay: '200ms' }}>
              {/* Image 1 */}
              <div className="absolute top-0 left-0 w-2/3 h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white backdrop-blur-sm transform -rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:shadow-3xl z-10">
                <img 
                  src={img1} 
                  alt="Success Driven Amaka" 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Image 2 */}
              <div className="absolute bottom-0 right-0 w-2/3 h-4/5 rounded-2xl overflow-hidden shadow-2xl border-4 border-white backdrop-blur-sm transform rotate-3 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:shadow-3xl">
                <img 
                  src={img2} 
                  alt="Professional Success" 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent-gold/20 rounded-full blur-2xl"></div>
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-accent-rose/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Achievements */}
      {achievements.length > 0 && (
        <SectionWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 rounded-full mb-4">
              <Trophy className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-semibold text-brand-700">SUCCESS STORIES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-900 mb-4">
              Featured Achievements
            </h2>
            <p className="text-xl text-brand-600 max-w-2xl mx-auto">
              Key strategies and measurable results from my journey in revenue growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, i) => (
              <div 
                key={achievement.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <AchievementCard achievement={achievement} />
              </div>
            ))}
          </div>
          
          {/* View All Link */}
          <div className="text-center mt-12">
            <Link 
              href="/achievements" 
              className="inline-flex items-center gap-2 text-brand-700 font-semibold text-lg hover:gap-4 transition-all"
            >
              View All Achievements <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </SectionWrapper>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <SectionWrapper className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-white py-24 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                <ShoppingBag className="w-4 h-4" />
                <span className="text-sm font-semibold">SUCCESS SHOP</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Tools for Your Success
              </h2>
              <p className="text-xl text-brand-200 max-w-2xl mx-auto">
                Courses, templates, and products designed to accelerate your growth.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, i) => (
                <div 
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/store" 
                className="btn-primary text-lg bg-white text-brand-900 hover:bg-brand-50"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* Latest Blog Posts */}
      {posts.length > 0 && (
        <SectionWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 rounded-full mb-4">
              <FileText className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-semibold text-brand-700">INSIGHTS & STRATEGIES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-900 mb-4">
              Latest Articles
            </h2>
            <p className="text-xl text-brand-600 max-w-2xl mx-auto">
              My thoughts on revenue growth, career development, and business strategy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <div 
                key={post.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/blog" 
              className="btn-secondary text-lg group"
            >
              <span className="flex items-center gap-2">
                Read All Articles 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </SectionWrapper>
      )}

      {/* Newsletter CTA Section */}
      <SectionWrapper className="bg-gradient-to-r from-brand-600 to-brand-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Sparkles className="w-12 h-12 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Success Community
          </h2>
          <p className="text-xl text-brand-100 mb-8">
            Get exclusive strategies on revenue growth, scaling and building premium brands - delivered every monday to your inbox.
          </p>
          <Link 
            href="/newsletter" 
            className="btn-primary bg-white text-brand-900 hover:bg-brand-50 text-lg"
          >
            Subscribe to Newsletter
          </Link>
        </div>
      </SectionWrapper>
    </div>
  );
}