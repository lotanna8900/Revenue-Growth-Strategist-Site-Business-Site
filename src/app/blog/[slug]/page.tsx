import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CommentForm from '@/components/blog/CommentForm';
import { MessageSquare } from 'lucide-react';

// Function to format the date
function formatDate(isoString: string | null) {
  if (!isoString) return 'No date';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Fetch the post
async function getPost(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published') // Must be published
    .single();

  if (error || !post) {
    notFound(); // Triggers a 404 page
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
    .eq('status', 'approved') // Only show approved comments
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  return comments;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  
  const clientParams = await params;
  const { slug } = clientParams;

  const post = await getPost(slug);
  const comments = await getComments(post.id);

  // Check if a user is logged in
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="bg-brand-50">
      {/* Header */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-600 font-semibold">
            {formatDate(post.published_at)}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-brand-900 mt-4 mb-6">
            {post.title}
          </h1>
          {/* Could add author/category here later */}
        </div>
      </div>
      
      {/* Post Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Render the HTML from my TipTap editor */}
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Comment Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-card p-6 md:p-10">
          <h2 className="text-3xl font-bold text-brand-900 mb-8 flex items-center gap-3">
            <MessageSquare className="w-8 h-8" />
            Join the Discussion
          </h2>
          
          {/* Comment Form */}
          <div className="mb-12">
            <CommentForm postId={post.id} isUserLoggedIn={!!user} />
          </div>

          {/* Approved Comments List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-brand-800 border-b border-brand-200 pb-2">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h3>
            
            {comments.length > 0 ? (
              comments.map((comment: any) => {
                let displayName: string;
                let initial: string;

                if (comment.profiles) {
                  // It's a registered user
                  displayName = comment.profiles.full_name || "Registered User";
                  // Use initial from full_name OR email
                  initial = (comment.profiles.full_name || comment.profiles.email)[0].toUpperCase();
                } else {
                  // It's a guest
                  displayName = comment.guest_name || "Guest";
                  // Use initial from guest_name or a fallback
                  initial = (comment.guest_name || "?")[0].toUpperCase();
                }

                return (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {initial}
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-900">
                        {displayName}
                      </h4>
                      <p className="text-xs text-brand-500 mb-2">
                        {formatDate(comment.created_at)}
                      </p>
                      <p className="text-brand-700">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-brand-600">
                Be the first to leave a comment!
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}