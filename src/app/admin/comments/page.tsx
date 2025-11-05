import { createServerSupabaseClient } from '@/lib/supabase/server';
import { approveComment, deleteComment } from './actions';
import { MessageSquare, Check, Trash2, FileWarning } from 'lucide-react';

// Function to format the date
function formatDate(isoString: string | null) {
  if (!isoString) return 'No date';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Reusable action button component
function ActionButton({
  action,
  id,
  children,
  className,
}: {
  action: (formData: FormData) => void;
  id: string;
  children: React.ReactNode;
  className: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${className}`}
      >
        {children}
      </button>
    </form>
  );
}

export default async function CommentsPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch all comments and join with the post title and user's email
  // Think i should show pending ones first, then approved ones
  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      status,
      blog_posts ( title ),
      profiles ( email )
    `)
    .order('status', { ascending: true }) // 'approved' then 'pending'
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-brand-900 mb-2">
          Comment Moderation
        </h1>
        <p className="text-brand-600 text-lg">
          Approve or delete new comments from your community.
        </p>
      </div>

      {/* Comment List */}
      <div className="glass-card p-6">
        <div className="space-y-6">
          {comments && comments.length > 0 ? (
            comments.map((comment: any) => (
              <div
                key={comment.id}
                className={`p-4 rounded-lg
                  ${comment.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' : 'bg-brand-50'}
                `}
              >
                <div className="flex justify-between items-start">
                  {/* Comment Content */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-brand-600 mb-2">
                      <span className="font-semibold text-brand-800">
                        {comment.profiles?.email || 'Anonymous'}
                      </span>
                      <span>commented on</span>
                      <span className="font-semibold text-brand-800">
                        "{comment.blog_posts?.title || 'a post'}"
                      </span>
                    </div>
                    <p className="text-brand-900">{comment.content}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    {comment.status === 'pending' && (
                      <ActionButton
                        action={approveComment}
                        id={comment.id}
                        className="bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </ActionButton>
                    )}
                    <ActionButton
                      action={deleteComment}
                      id={comment.id}
                      className="bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </ActionButton>
                  </div>
                </div>
                <div className="text-xs text-brand-500 mt-2">
                  {formatDate(comment.created_at)}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-brand-600">
              <FileWarning className="w-12 h-12 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Comments Yet</h2>
              <p>Once users start commenting, they will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}