'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, File, X, AlertCircle } from 'lucide-react';
import type { FileObject } from '@supabase/storage-js';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (url: string) => void;
};

export default function FileManagerModal({ isOpen, onClose, onFileSelect }: Props) {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const bucketName = 'public_assets';

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      
      const fetchFiles = async () => {
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
          setError('Failed to load files.');
        }
        setLoading(false);
      };
      
      fetchFiles();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleFileClick = (file: FileObject) => {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`uploads/${file.name}`);
    
    onFileSelect(data.publicUrl);
    onClose();
  };

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      {/* Modal Content */}
      <div className="glass-card w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-brand-200">
          <h2 className="text-2xl font-bold text-brand-900">Select an Image</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-brand-100"
          >
            <X className="w-6 h-6 text-brand-700" />
          </button>
        </div>

        {/* Gallery */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-12 h-12 animate-spin text-brand-600" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-600">
              <AlertCircle className="w-12 h-12 mb-4" />
              <p className="text-xl font-semibold">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {files.map((file) => {
                // 1. Check if the file is an image
                const isImage = file.metadata.mimetype?.startsWith('image/');
                let imageUrl: string | null = null;
                
                if (isImage) {
                  imageUrl = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(`uploads/${file.name}`).data.publicUrl;
                }
                
                return (
                  <button
                    key={file.id}
                    onClick={() => handleFileClick(file)}
                    className="rounded-lg border border-brand-200 overflow-hidden shadow-sm group hover:border-brand-600 hover:shadow-lg transition-all"
                  >
                    {/* Conditionally render <img> or <File> */}
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
                    
                    <div className="p-2 bg-white">
                      <p
                        className="text-xs font-medium text-brand-800 truncate group-hover:text-brand-600"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}