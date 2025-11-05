import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ArrowRight, Sparkles, TrendingUp, ShoppingBag, FileText, Trophy, Mail } from 'lucide-react';
import Link from 'next/link';

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

// --- Reusable Cards ---

// Product Card
function ProductCard({ product }: { product: any }) {
  const primaryImage = product.images?.[0] || 'https://via.placeholder.com/300';
  const price = `NGN ${new Intl.NumberFormat('en-NG').format(product.sale_price || product.price)}`;
  
  return (
    <Link
      href={`/store/${product.slug}`}
      className="glass-card group flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative w-full aspect-square overflow-hidden">
        <img src={primaryImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.sale_price && <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">SALE</span>}
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-900 mb-2 truncate">{product.name}</h2>
          <p className="text-brand-600 mb-4 text-sm">{product.category || 'Uncategorized'}</p>
        </div>
        <p className="font-bold text-2xl text-brand-800">{price}</p>
      </div>
    </Link>
  );
}

// Blog Post Card
function PostCard({ post }: { post: any }) {
  const excerpt = (post.excerpt || post.content.replace(/<[^>]+>/g, '')).substring(0, 100) + '...';
  
  return (
    <Link href={`/blog/${post.slug}`} className="glass-card p-6 group hover:shadow-2xl transition-all duration-300">
      <FileText className="w-10 h-10 text-brand-600 mb-4" />
      <h3 className="text-2xl font-bold text-brand-900 mb-3">{post.title}</h3>
      <p className="text-brand-600 mb-6 leading-relaxed">{excerpt}</p>
      <div className="inline-flex items-center gap-2 text-brand-700 font-semibold group-hover:gap-4 transition-all">
        Read Post <ArrowRight className="w-5 h-5" />
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
  const img1 = settings.homepageImage1 || 'https://via.placeholder.com/600x800';
  const img2 = settings.homepageImage2 || 'https://via.placeholder.com/600x800';
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-50 py-24 md:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 border border-brand-200 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-medium text-brand-700">{heroSubtitle}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-brand-900">
                {heroTitle}
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-brand-600 max-w-lg">
                I help businesses build powerful revenue engines and coach individuals to achieve career clarity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn-primary inline-flex items-center gap-2 text-lg">
                  Work With Me <Mail className="w-5 h-5" />
                </Link>
                <Link href="/achievements" className="btn-secondary inline-flex items-center gap-2 text-lg">
                  My Achievements <Trophy className="w-5 h-5" />
                </Link>
              </div>
            </div>
            
            {/* Right: Animated Images */}
            <div className="relative h-96 lg:h-[36rem] animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="absolute top-0 left-0 w-2/3 h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 backdrop-blur-sm transform -rotate-6 transition-all duration-300 hover:rotate-0 hover:scale-105">
                <img src={img1} alt="Success Driven Amaka 1" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-2/3 h-4/5 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 backdrop-blur-sm transform rotate-3 transition-all duration-300 hover:rotate-0 hover:scale-105">
                <img src={img2} alt="Success Driven Amaka 2" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Achievements */}
      {achievements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-900 mb-4">
              Featured Achievements
            </h2>
            <p className="text-xl text-brand-600 max-w-2xl mx-auto">
              Key strategies and results from my journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((item) => (
              <Link key={item.id} href={`/achievements/${item.slug}`} className="glass-card p-6 group hover:shadow-2xl transition-all duration-300">
                <Trophy className="w-10 h-10 text-brand-600 mb-4" />
                <h3 className="text-2xl font-bold text-brand-900 mb-3">{item.title}</h3>
                <p className="text-brand-600 mb-6 leading-relaxed">{item.description?.substring(0, 100) + '...'}</p>
                <div className="inline-flex items-center gap-2 text-brand-700 font-semibold group-hover:gap-4 transition-all">
                  View Case Study <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="bg-brand-800 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                From the Success Shop
              </h2>
              <p className="text-xl text-brand-200 max-w-2xl mx-auto">
                Courses and products to help you succeed.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/store" className="btn-primary text-lg">
                Shop All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog Posts */}
      {posts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-900 mb-4">
              Latest Insights
            </h2>
            <p className="text-xl text-brand-600 max-w-2xl mx-auto">
              My thoughts on revenue strategy, career, and more.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/blog" className="btn-secondary text-lg">
              Read All Posts
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}