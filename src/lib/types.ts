// I'll expand this file later

// Simplified type based on my DB schema
export type blog_posts = {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  author_id: string;
};