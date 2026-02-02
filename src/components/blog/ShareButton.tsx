'use client';

import { Share2 } from 'lucide-react';

export default function ShareButton({ title }: { title: string }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.href
      }).catch(() => {
        // User cancelled or sharing failed
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="btn-secondary inline-flex items-center gap-2 group"
    >
      <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
      Share Article
    </button>
  );
}