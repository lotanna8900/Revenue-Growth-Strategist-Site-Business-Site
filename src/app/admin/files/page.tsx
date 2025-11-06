'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { uploadFile, deleteFile } from './actions'; 
import { createClient } from '@/lib/supabase/client';
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  UploadCloud,
  File,
  Copy,
  Trash2,
} from 'lucide-react';
import type { FileObject } from '@supabase/storage-js';

// Define the state type for the form
type FormState = { error?: string; message?: string } | null;

// Submit button for the upload form
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Uploading...
        </>
      ) : (
        'Upload File'
      )}
    </button>
  );
}

// Main page component
export default function FileManagerPage() {
  const [state, formAction] = useActionState(uploadFile, null);
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const supabase = createClient();
  const bucketName = 'public_assets';

  // Fetch all files from the storage bucket
  const fetchFiles = async () => {
    setLoadingFiles(true);
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('uploads', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (data) {
      setFiles(data);
    } else if (error) {
      console.error('Error fetching files:', error);
    }
    setLoadingFiles(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

 // Re-fetch files after a successful upload OR delete
  useEffect(() => {
    if (state?.message) {
      fetchFiles();
    }
  }, [state]);
  
  // Also re-fetch if the delete action is successful
  const enhancedDeleteAction = async (formData: FormData) => {
    await deleteFile(formData);
    fetchFiles();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      const form = e.currentTarget.closest('form');
      if (form) {
        const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
        fileInput.files = dataTransfer.files;
        form.requestSubmit();
      }
    }
  };

  // Function to copy URL to clipboard
  const copyToClipboard = (filePath: string) => {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    navigator.clipboard.writeText(data.publicUrl);
    // Add a toast notification here later
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-brand-900 mb-8">File Manager</h1>

      {/* Upload Zone */}
      <div className="glass-card p-6 mb-8">
        <form action={formAction}>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg
              ${isOver ? 'border-brand-600 bg-brand-50' : 'border-brand-300'}
              transition-colors`}
          >
            <UploadCloud className="w-16 h-16 text-brand-600 mb-4" />
            <p className="text-xl font-semibold text-brand-900 mb-2">
              Drag & drop files here
            </p>
            <p className="text-brand-600 mb-4">or</p>
            <input
              type="file"
              name="file"
              id="file-upload"
              className="sr-only"
              onChange={(e) => {
                const form = e.currentTarget.closest('form');
                if (form) form.requestSubmit();
              }}
            />
            <label
              htmlFor="file-upload"
              className="btn-secondary cursor-pointer"
            >
              Browse Files
            </label>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div>
              {state?.error && (
                <div className="flex items-center gap-2 text-sm text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>{state.error}</span>
                </div>
              )}
              {state?.message && (
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span>{state.message}</span>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* File Gallery */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-brand-900 mb-6">Uploaded Files</h2>
        {loadingFiles ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-12 h-12 animate-spin text-brand-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.length > 0 ? (
              files.map((file) => {
                // 1. Check if the file is an image
                const isImage = file.metadata.mimetype?.startsWith('image/');
                let imageUrl: string | null = null;
                
                // 2. Get the public URL
                if (isImage) {
                  imageUrl = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(`uploads/${file.name}`).data.publicUrl;
                }

                return (
                  <div
                    key={file.id}
                    className="rounded-lg border border-brand-200 overflow-hidden shadow-sm"
                  >
                    <div className="h-32 bg-brand-50 flex items-center justify-center overflow-hidden">
                      {isImage && imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <File className="w-12 h-12 text-brand-400" />
                      )}
                    </div>

                    <div className="p-3 bg-white">
                      <p
                        className="text-sm font-medium text-brand-800 truncate"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                      {/* Buttons (No Change) */}
                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={() => copyToClipboard(`uploads/${file.name}`)}
                          className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-900"
                        >
                          <Copy className="w-3 h-3" />
                          URL
                        </button>
                        
                        <form action={enhancedDeleteAction}>
                          <input type="hidden" name="file_path" value={`uploads/${file.name}`} />
                          <button
                            type="submit"
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-brand-600">
                No files uploaded yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}