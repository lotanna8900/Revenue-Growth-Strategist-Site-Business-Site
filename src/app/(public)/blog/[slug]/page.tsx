import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CommentForm from '@/components/blog/CommentForm';
import ShareButton from '@/components/blog/ShareButton'; 
// 👇 1. IMPORT THE NEW COMPONENT
import RichTextDisplay from '@/components/RichTextDisplay';
import { 
  MessageSquare, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

// Function to format the date
function formatDate(isoString: string | null) {
  if (!isoString) return 'No date';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Function to format relative time
function formatRelativeTime(isoString: string) {
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(isoString);
}

// Fetch the post
async function getPost(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !post) {
    notFound();
  }
  return post;
}

// Fetch the comments for the post
async function getComments(postId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      guest_name,
      profiles ( email, full_name, avatar_url )
    `)
    .eq('post_id', postId)
    .eq('status', 'approved')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  return comments;
}

// Fetch related posts
async function getRelatedPosts(currentPostId: string, category: string | null, limit = 3) {
  const supabase = await createServerSupabaseClient();
  
  let query = supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, featured_image, published_at, category')
    .eq('status', 'published')
    .neq('id', currentPostId)
    .limit(limit);
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data } = await query;
  return data || [];
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const clientParams = await params;
  const { slug } = clientParams;

  const post = await getPost(slug);
  const comments = await getComments(post.id);
  const relatedPosts = await getRelatedPosts(post.id, post.category);

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Calculate reading time
  const wordCount = post.content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-brand-50 to-white">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>
      </div>

      {/* Hero Header */}
      <header className="relative overflow-hidden">
        {post.featured_image && (
          <div className="absolute inset-0 z-0">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full h-full object-cover opacity-10 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white"></div>
          </div>
        )}

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {post.category && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-full mb-6 text-sm font-semibold shadow-lg">
              {post.category}
            </div>
          )}

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-brand-900 mb-8 leading-tight animate-fade-in">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl md:text-2xl text-brand-600 mb-8 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-brand-600 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">{comments.length} comments</span>
            </div>
          </div>

          {/* Share Button */}
          <ShareButton title={post.title} />
        </div>
      </header>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Post Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-card p-8 md:p-12">
            {/* 👇 2. REPLACED THE OLD PROSE DIV WITH THIS */}
            <RichTextDisplay content={post.content} />
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-brand-900 mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="glass-card group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {relatedPost.featured_image && (
                  <div className="aspect-video overflow-hidden bg-brand-100">
                    <img
                      src={relatedPost.featured_image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-brand-900 mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">
                    {relatedPost.title}
                  </h3>
                  {relatedPost.excerpt && (
                    <p className="text-brand-600 text-sm line-clamp-2 mb-4">
                      {relatedPost.excerpt}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-brand-700 font-semibold text-sm group-hover:gap-3 transition-all">
                    Read More <ArrowLeft className="w-4 h-4 rotate-180" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Comment Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-card p-8 md:p-12">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-900 mb-3 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-brand-600" />
              Join the Discussion
            </h2>
            <p className="text-brand-600 text-lg">
              Share your thoughts and connect with other readers
            </p>
          </div>
          
          <div className="mb-16 pb-16 border-b border-brand-200">
            <CommentForm postId={post.id} isUserLoggedIn={!!user} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-brand-900">
                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
              </h3>
              {comments.length > 0 && (
                <div className="flex items-center gap-2 text-brand-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  All comments are verified
                </div>
              )}
            </div>
            
            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment: any) => {
                  let displayName: string;
                  let initial: string;
                  let isGuest = false;

                  if (comment.profiles) {
                    displayName = comment.profiles.full_name || "Registered User";
                    initial = (comment.profiles.full_name || comment.profiles.email)[0].toUpperCase();
                  } else {
                    displayName = comment.guest_name || "Guest";
                    initial = (comment.guest_name || "?")[0].toUpperCase();
                    isGuest = true;
                  }

                  return (
                    <div 
                      key={comment.id} 
                      className="flex gap-4 p-6 bg-brand-50/50 rounded-xl hover:bg-brand-50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {comment.profiles?.avatar_url ? (
                          <img
                            src={comment.profiles.avatar_url}
                            alt={displayName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-brand-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
                            {initial}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-brand-900 text-lg">
                            {displayName}
                          </h4>
                          {isGuest && (
                            <span className="px-2 py-0.5 bg-brand-200 text-brand-700 text-xs font-semibold rounded-full">
                              Guest
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-brand-500 mb-3 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {formatRelativeTime(comment.created_at)}
                        </p>
                        
                        <p className="text-brand-700 leading-relaxed text-base">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <MessageSquare className="w-16 h-16 text-brand-300 mx-auto mb-4" />
                <p className="text-brand-600 text-lg font-medium mb-2">
                  No comments yet
                </p>
                <p className="text-brand-500">
                  Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Enjoyed this article?
          </h2>
          <p className="text-xl text-brand-100 mb-8">
            Get more insights delivered straight to your inbox every week.
          </p>
          <Link 
            href="/newsletter" 
            className="btn-primary bg-white text-brand-900 hover:bg-brand-50 text-lg"
          >
            Subscribe to Newsletter
          </Link>
        </div>
      </section>
    </div>
  );
}