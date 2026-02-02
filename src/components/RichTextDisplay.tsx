'use client';

import DOMPurify from 'isomorphic-dompurify';
import { useEffect, useState } from 'react';

interface RichTextDisplayProps {
  content: string;
  className?: string;
  maxWidth?: 'prose' | 'full' | 'narrow';
}

export default function RichTextDisplay({ 
  content, 
  className = '',
  maxWidth = 'prose'
}: RichTextDisplayProps) {
  const [sanitizedContent, setSanitizedContent] = useState('');

  useEffect(() => {
    // Sanitize HTML to prevent XSS attacks
    const clean = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
        'ul', 'ol', 'li',
        'blockquote', 'hr',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'class', 'style',
        'src', 'alt', 'width', 'height', 'title'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    });
    setSanitizedContent(clean);
  }, [content]);

  if (!content) {
    return null;
  }

  const maxWidthClasses = {
    prose: 'max-w-3xl',
    full: 'max-w-full',
    narrow: 'max-w-2xl'
  };

  return (
    <div className={`rich-text-content ${maxWidthClasses[maxWidth]} ${className}`}>
      <div 
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        className="rich-text-inner"
      />

      <style jsx global>{`
        /* Base styling */
        .rich-text-content {
          font-size: 1.0625rem;
          line-height: 1.75;
          color: #374151;
        }

        .rich-text-inner > *:first-child {
          margin-top: 0 !important;
        }

        .rich-text-inner > *:last-child {
          margin-bottom: 0 !important;
        }

        /* Headings */
        .rich-text-content h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.2;
          color: #111827;
          letter-spacing: -0.025em;
        }

        .rich-text-content h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 0.875rem;
          line-height: 1.3;
          color: #1f2937;
          letter-spacing: -0.025em;
        }

        .rich-text-content h3 {
          font-size: 1.625rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          color: #374151;
        }

        .rich-text-content h4 {
          font-size: 1.375rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.625rem;
          line-height: 1.5;
          color: #4b5563;
        }

        .rich-text-content h5 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          line-height: 1.6;
          color: #6b7280;
        }

        .rich-text-content h6 {
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.6;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Paragraphs */
        .rich-text-content p {
          margin-top: 1.25rem;
          margin-bottom: 1.25rem;
          line-height: 1.8;
          color: #374151;
        }

        /* Links */
        .rich-text-content a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s ease;
        }

        .rich-text-content a:hover {
          color: #1d4ed8;
          text-decoration-thickness: 2px;
        }

        .rich-text-content a:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
          border-radius: 2px;
        }

        /* Text formatting */
        .rich-text-content strong {
          font-weight: 700;
          color: #111827;
        }

        .rich-text-content em {
          font-style: italic;
        }

        .rich-text-content s {
          text-decoration: line-through;
          opacity: 0.7;
        }

        .rich-text-content u {
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        /* Code */
        .rich-text-content code {
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 0.25rem;
          padding: 0.125rem 0.375rem;
          font-family: 'Courier New', 'Consolas', monospace;
          font-size: 0.875em;
          color: #dc2626;
        }

        .rich-text-content pre {
          background-color: #1f2937;
          border-radius: 0.5rem;
          padding: 1.25rem;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          overflow-x: auto;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .rich-text-content pre code {
          background-color: transparent;
          border: none;
          color: #f9fafb;
          padding: 0;
          font-size: 0.875rem;
          line-height: 1.7;
        }

        /* Lists */
        .rich-text-content ul,
        .rich-text-content ol {
          padding-left: 1.75rem;
          margin-top: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .rich-text-content ul {
          list-style-type: disc;
        }

        .rich-text-content ol {
          list-style-type: decimal;
        }

        .rich-text-content li {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.75;
          color: #374151;
          padding-left: 0.375rem;
        }

        .rich-text-content li p {
          margin: 0;
        }

        .rich-text-content li > ul,
        .rich-text-content li > ol {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        /* Nested lists */
        .rich-text-content ul ul {
          list-style-type: circle;
        }

        .rich-text-content ul ul ul {
          list-style-type: square;
        }

        .rich-text-content ol ol {
          list-style-type: lower-alpha;
        }

        .rich-text-content ol ol ol {
          list-style-type: lower-roman;
        }

        /* Blockquotes */
        .rich-text-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1.25rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          font-style: italic;
          color: #6b7280;
          background-color: #f9fafb;
        }

        .rich-text-content blockquote p {
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .rich-text-content blockquote p:first-child {
          margin-top: 0;
        }

        .rich-text-content blockquote p:last-child {
          margin-bottom: 0;
        }

        /* Horizontal rule */
        .rich-text-content hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin-top: 3rem;
          margin-bottom: 3rem;
        }

        /* Images */
        .rich-text-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin-top: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        /* Tables */
        .rich-text-content table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 2rem;
          margin-bottom: 2rem;
          font-size: 0.9375rem;
        }

        .rich-text-content thead {
          background-color: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
        }

        .rich-text-content th {
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 600;
          color: #111827;
        }

        .rich-text-content td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
        }

        .rich-text-content tbody tr:hover {
          background-color: #f9fafb;
        }

        /* Text alignment */
        .rich-text-content [style*="text-align: left"],
        .rich-text-content [style*="text-align:left"] {
          text-align: left;
        }

        .rich-text-content [style*="text-align: center"],
        .rich-text-content [style*="text-align:center"] {
          text-align: center;
        }

        .rich-text-content [style*="text-align: right"],
        .rich-text-content [style*="text-align:right"] {
          text-align: right;
        }

        .rich-text-content [style*="text-align: justify"],
        .rich-text-content [style*="text-align:justify"] {
          text-align: justify;
        }

        /* Selection styling */
        .rich-text-content ::selection {
          background-color: #dbeafe;
          color: #1e40af;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .rich-text-content {
            font-size: 1rem;
          }

          .rich-text-content h1 {
            font-size: 2rem;
          }

          .rich-text-content h2 {
            font-size: 1.625rem;
          }

          .rich-text-content h3 {
            font-size: 1.375rem;
          }

          .rich-text-content pre {
            padding: 1rem;
            margin-left: -1rem;
            margin-right: -1rem;
            border-radius: 0;
          }
        }

        /* Print styles */
        @media print {
          .rich-text-content {
            color: #000;
          }

          .rich-text-content a {
            color: #000;
            text-decoration: underline;
          }

          .rich-text-content pre {
            background-color: #f5f5f5;
            border: 1px solid #ddd;
          }

          .rich-text-content pre code {
            color: #000;
          }
        }
      `}</style>
    </div>
  );
}