import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';

// Function to format the date
function formatDate(isoString: string | null) {
  if (!isoString) return 'No date';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Helper to create a plain text excerpt
function createExcerpt(htmlContent: string, length = 150) {
  const text = htmlContent.replace(/<[^>]+>/g, ''); // Strip all HTML tags
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export default async function BlogListPage() {
  const supabase = await createServerSupabaseClient();

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*') 
    .eq('status', 'published') // Only fetch published posts
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
  }

  return (
    <div className="bg-brand-50 min-h-screen">
      {/* I might add add a public Navbar component here later */}
      
      {/* Header */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            The Blog
          </h1>
          <p className="text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto">
            Thoughts on business development, fashion, and the journey.
          </p>
        </div>
      </section>

      {/* Post Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="glass-card p-6 group flex flex-col hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-brand-900 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-brand-300 text-sm font-medium mb-4">
                    {formatDate(post.published_at)}
                  </p>
                  <p className="text-brand-600 mb-6 leading-relaxed">
                    {post.excerpt || createExcerpt(post.content)}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-brand-700 font-semibold group-hover:gap-4 transition-all">
                  Read Post <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-brand-600 text-lg">
              No posts have been published yet. Check back soon!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}