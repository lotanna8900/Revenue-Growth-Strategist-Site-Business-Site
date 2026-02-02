import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, Plus, Dot, FileWarning } from 'lucide-react';
import { deletePost } from './actions'; 

// Function to format the date
function formatDate(isoString: string | null) {
  if (!isoString) return 'No date';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function BlogManagerPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch all blog posts, ordered by the newest first
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-brand-900">
          Blog Manager
        </h1>
        <Link href="/admin/blog/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Post
        </Link>
      </div>

      {/* Post List */}
      <div className="glass-card p-6">
        <div className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-200 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-brand-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-900 text-lg">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-sm text-brand-600">
                      <span
                        className={`font-medium ${
                          post.status === 'published'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      <Dot />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/blog/edit/${post.id}`}
                    className="font-medium text-brand-600 hover:text-brand-900"
                  >
                    Edit
                  </Link>
                  <form action={deletePost}>
                    <input type="hidden" name="id" value={post.id} />
                    <button 
                      type="submit"
                      className="font-medium text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-brand-600">
              <FileWarning className="w-12 h-12 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Posts Yet</h2>
              <p>Click "New Post" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}