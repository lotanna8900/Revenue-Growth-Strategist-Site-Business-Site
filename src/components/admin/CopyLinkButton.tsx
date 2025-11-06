'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyLinkButton({ urlToCopy }: { urlToCopy: string }) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(urlToCopy);
    setHasCopied(true);
    
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <button
      onClick={copyLink}
      disabled={hasCopied}
      className={`btn-secondary flex items-center gap-2 ${
        hasCopied ? 'bg-green-100 border-green-300 text-green-700' : ''
      }`}
    >
      {hasCopied ? (
        <Check className="w-5 h-5" />
      ) : (
        <Copy className="w-5 h-5" />
      )}
      {hasCopied ? 'Copied!' : 'Copy Link for LinkedIn'}
    </button>
  );
}