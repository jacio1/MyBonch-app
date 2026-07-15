"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Loader2, ImageIcon } from "lucide-react";
import { Attachment } from "@/src/types";
import Image from "next/image";

interface FileUploaderProps {
  noteId: number;
  onUpload: (file: File) => Promise<void>;
  onDelete: (attachmentId: string) => Promise<void>;
  attachments: Attachment[];
  isUploading?: boolean;
  isNewNote?: boolean;
}

export const FileUploader = ({
  noteId,
  onUpload,
  onDelete,
  attachments,
  isUploading = false,
  isNewNote = false,
}: FileUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = async (file: File) => {
    const fileId = `uploading_${Date.now()}_${file.name}`;
    setUploadingFiles(prev => new Set(prev).add(fileId));
    try {
      await onUpload(file);
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === "image") {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    }
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const isUploadingFile = (attachment: Attachment) => {
    return attachment.id.toString().startsWith("temp_") && uploadingFiles.has(attachment.id.toString());
  };

  return (
    <div className="space-y-3">
      {(noteId !== 0 || isNewNote) && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors
            ${
              dragActive
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
                : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500"
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading || uploadingFiles.size > 0}
          />

          <div className="flex flex-col items-center gap-2">
            {isUploading || uploadingFiles.size > 0 ? (
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Перетащите файл сюда или кликните для выбора
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Поддерживаются: изображения, PDF, DOC, TXT (макс. 10MB)
            </p>
            {isNewNote && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                💡 Файлы будут загружены после сохранения заметки
              </p>
            )}
          </div>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Вложения ({attachments.length})
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {attachment.file_type === "image" ? (
                    <div className="relative">
                      <Image
                        src={attachment.file_url}
                        alt={attachment.file_name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      {isUploadingFile(attachment) && (
                        <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                          <Loader2 className="h-4 w-4 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      {getFileIcon(attachment.file_type)}
                      {isUploadingFile(attachment) && (
                        <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                          <Loader2 className="h-4 w-4 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {attachment.file_name}
                      {attachment.id.toString().startsWith("temp_") && (
                        <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                          (будет загружен)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(attachment.file_size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(attachment.id.toString())}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition ml-2"
                  disabled={isUploading || isUploadingFile(attachment)}
                >
                  <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};