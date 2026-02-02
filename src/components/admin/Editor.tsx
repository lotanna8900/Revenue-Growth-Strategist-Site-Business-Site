'use client';

import { useEditor, EditorContent, Editor as TiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Pilcrow,
  Minus,
} from 'lucide-react';

// Reusable toolbar button component
const ToolbarButton = ({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-lg transition-all ${
      isActive
        ? 'bg-brand-700 text-white shadow-md'
        : 'text-brand-700 hover:bg-brand-100 hover:text-brand-900'
    } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </button>
);

// Divider for toolbar sections
const ToolbarDivider = () => (
  <div className="w-px h-6 bg-brand-200 mx-1" />
);

// The toolbar component
const EditorToolbar = ({ editor }: { editor: TiptapEditor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border border-brand-200 rounded-t-lg bg-brand-50">
      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        isActive={false}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        isActive={false}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Headings - Apply to current block */}
      <ToolbarButton
        onClick={() => {
          // Get the current selection
          const { from, to } = editor.state.selection;
          const isEmpty = from === to;
          
          if (isEmpty) {
            // If nothing is selected, toggle heading on current line
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          } else {
            // If text is selected, split into blocks and apply heading
            editor.chain()
              .focus()
              .setNode('heading', { level: 1 })
              .run();
          }
        }}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1 (applies to entire line/block)"
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          const { from, to } = editor.state.selection;
          const isEmpty = from === to;
          
          if (isEmpty) {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          } else {
            editor.chain()
              .focus()
              .setNode('heading', { level: 2 })
              .run();
          }
        }}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2 (applies to entire line/block)"
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          const { from, to } = editor.state.selection;
          const isEmpty = from === to;
          
          if (isEmpty) {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          } else {
            editor.chain()
              .focus()
              .setNode('heading', { level: 3 })
              .run();
          }
        }}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3 (applies to entire line/block)"
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive('paragraph')}
        title="Normal paragraph"
      >
        <Pilcrow className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Text formatting - Works on selected text */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold (Ctrl+B) - works on selected text"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic (Ctrl+I) - works on selected text"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough - works on selected text"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="Inline Code - works on selected text"
      >
        <Code className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists - Apply to blocks */}
      <ToolbarButton
        onClick={() => {
          // Toggle bullet list will work properly now
          editor.chain().focus().toggleBulletList().run();
        }}
        isActive={editor.isActive('bulletList')}
        title="Bullet List (converts current line/paragraph)"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          editor.chain().focus().toggleOrderedList().run();
        }}
        isActive={editor.isActive('orderedList')}
        title="Numbered List (converts current line/paragraph)"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Blockquote & Horizontal Rule */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Blockquote (applies to entire line/block)"
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        isActive={false}
        title="Horizontal Rule (inserts a divider)"
      >
        <Minus className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
};

// The main editor export
export default function Editor({
  content,
  onChange,
  placeholder = 'Start writing...',
}: {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  });

  return (
    <div className="w-full">
      <EditorToolbar editor={editor} />
      <div className="border border-t-0 border-brand-200 rounded-b-lg bg-white">
        <EditorContent editor={editor} />
      </div>
      
      {/* Help text */}
      <div className="mt-2 text-xs text-brand-600 space-y-1">
        <p><strong>💡 Formatting Tips:</strong></p>
        <p>• <strong>Bold, Italic, Code:</strong> Select text first, then click the button</p>
        <p>• <strong>Headings, Lists, Quotes:</strong> Place cursor on the line, then click (converts entire line)</p>
        <p>• <strong>Multi-line Lists:</strong> Press Enter after each item to continue the list</p>
      </div>
      
      <style jsx global>{`
        .tiptap-editor {
          min-height: 384px;
          max-height: 600px;
          overflow-y: auto;
          padding: 1rem;
          outline: none;
        }

        .tiptap-editor:focus {
          outline: none;
        }

        /* Placeholder styling */
        .tiptap-editor p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        /* Heading styles */
        .tiptap-editor h1 {
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 2.5rem;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .tiptap-editor h1:first-child {
          margin-top: 0;
        }

        .tiptap-editor h2 {
          font-size: 1.875rem;
          font-weight: 700;
          line-height: 2.25rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1f2937;
        }

        .tiptap-editor h2:first-child {
          margin-top: 0;
        }

        .tiptap-editor h3 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 2rem;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .tiptap-editor h3:first-child {
          margin-top: 0;
        }

        /* Paragraph styles */
        .tiptap-editor p {
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.75;
          color: #374151;
        }

        .tiptap-editor p:first-child {
          margin-top: 0;
        }

        .tiptap-editor p:last-child {
          margin-bottom: 0;
        }

        /* List styles */
        .tiptap-editor ul,
        .tiptap-editor ol {
          padding-left: 1.5rem;
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .tiptap-editor ul {
          list-style-type: disc;
        }

        .tiptap-editor ol {
          list-style-type: decimal;
        }

        .tiptap-editor li {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
          line-height: 1.75;
        }

        .tiptap-editor li p {
          margin: 0;
        }

        /* Nested lists */
        .tiptap-editor ul ul,
        .tiptap-editor ol ul {
          list-style-type: circle;
        }

        .tiptap-editor ul ul ul,
        .tiptap-editor ol ul ul,
        .tiptap-editor ol ol ul {
          list-style-type: square;
        }

        /* Blockquote styles */
        .tiptap-editor blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          margin-left: 0;
          margin-top: 1rem;
          margin-bottom: 1rem;
          font-style: italic;
          color: #6b7280;
        }

        /* Code styles */
        .tiptap-editor code {
          background-color: #f3f4f6;
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          color: #dc2626;
        }

        .tiptap-editor pre {
          background-color: #1f2937;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
          overflow-x: auto;
        }

        .tiptap-editor pre code {
          background-color: transparent;
          color: #f9fafb;
          padding: 0;
        }

        /* Horizontal rule */
        .tiptap-editor hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }

        /* Bold, italic, strikethrough */
        .tiptap-editor strong {
          font-weight: 700;
        }

        .tiptap-editor em {
          font-style: italic;
        }

        .tiptap-editor s {
          text-decoration: line-through;
        }

        /* Selection styling */
        .tiptap-editor ::selection {
          background-color: #dbeafe;
        }
      `}</style>
    </div>
  );
}