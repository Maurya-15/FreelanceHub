import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Video,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  type: "image" | "video" | "document";
  status: "uploading" | "success" | "error";
  progress: number;
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  showPreview?: boolean;
  className?: string;
}

export function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ["image/*", "video/*", ".pdf", ".doc", ".docx"],
  showPreview = true,
  className = "",
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const getFileType = (file: File): "image" | "video" | "document" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "document";
  };

  const getFileIcon = (type: "image" | "video" | "document") => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-6 h-6" />;
      case "video":
        return <Video className="w-6 h-6" />;
      case "document":
        return <FileText className="w-6 h-6" />;
    }
  };

  const simulateUpload = (fileId: string) => {
    // Simulate upload progress
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            const newProgress = Math.min(file.progress + 10, 100);
            return {
              ...file,
              progress: newProgress,
              status: newProgress === 100 ? "success" : "uploading",
            };
          }
          return file;
        }),
      );
    }, 200);

    // Stop simulation when complete
    setTimeout(() => {
      clearInterval(interval);
    }, 2000);
  };

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);

      if (files.length + fileArray.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const validFiles = fileArray.filter((file) => {
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB`);
          return false;
        }

        // Check file type
        const isValidType = acceptedTypes.some((type) =>
          type.includes("*")
            ? file.type.startsWith(type.replace("*", ""))
            : file.type === type || file.name.endsWith(type),
        );

        if (!isValidType) {
          alert(`File ${file.name} is not a supported format`);
          return false;
        }

        return true;
      });

      const uploadedFiles: UploadedFile[] = validFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: getFileType(file),
        status: "uploading",
        progress: 0,
        preview:
          getFileType(file) === "image" ? URL.createObjectURL(file) : undefined,
      }));

      const updatedFiles = [...files, ...uploadedFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);

      // Start upload simulation for each file
      uploadedFiles.forEach((file) => simulateUpload(file.id));
    },
    [files, maxFiles, maxSize, acceptedTypes, onFilesChange],
  );

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter((file) => file.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFiles(e.target.files);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="text-center">
            <input
              type="file"
              id="file-upload"
              multiple
              accept={acceptedTypes.join(",")}
              onChange={handleFileInput}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                    dragActive ? "bg-primary/20" : "bg-muted"
                  }`}
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Upload Files</h3>
                  <p className="text-muted-foreground">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Support for {acceptedTypes.join(", ")} up to {maxSize}MB
                    each
                  </p>
                </div>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {files.map((file) => (
              <Card key={file.id} className="border border-border/40">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* File Preview/Icon */}
                    <div className="flex-shrink-0">
                      {file.preview && showPreview ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <img
                            src={file.preview}
                            alt={file.file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                          {getFileIcon(file.type)}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium truncate">{file.file.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB ���{" "}
                        {file.type}
                      </p>

                      {/* Progress Bar */}
                      {file.status === "uploading" && (
                        <div className="mt-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploading... {file.progress}%
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center space-x-2">
                      {file.status === "success" && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Uploaded
                        </Badge>
                      )}
                      {file.status === "error" && (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Error
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
