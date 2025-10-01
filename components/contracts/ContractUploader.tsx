"use client";

import React from "react";
import FileUpload from "@/components/file-upload";
import SignedUrlPreview from "./SignedUrlPreview";
import { Button } from "@/components/ui/button";
import { Upload, RotateCcw } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ContractUploaderProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  uploadedFileUrl: String | undefined;
  disabled?: boolean;
}

export default function ContractUploader({
  onFileUpload,
  isUploading,
  uploadedFileUrl,
  disabled = false,
}: ContractUploaderProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isReuploading, setIsReuploading] = React.useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setIsReuploading(false); // Reset reupload mode after file is selected
  };

  const handleFileDelete = () => {
    setSelectedFile(null);
  };

  const handleUpload = () => {
    if (selectedFile && !isUploading) {
      onFileUpload(selectedFile);
    }
  };

  //  Clear selected file after upload is complete
  React.useEffect(() => {
    if (!isUploading && selectedFile) {
      setSelectedFile(null);
      setIsReuploading(false);
    }
  }, [isUploading]);

  const fileUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;
  const fileName = selectedFile?.name;
  const hasUploadedFile = uploadedFileUrl && !selectedFile;

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-sm font-medium text-[#344054]">
          Contract Document <span className="text-red-500">*</span>
        </div>

        {/* Show preview if file is already uploaded and not selecting a new one */}
        {hasUploadedFile && !isReuploading ? (
          <div className="flex flex-col gap-2">
            <SignedUrlPreview
              url={uploadedFileUrl.toString()}
              fileName="Contract Document.pdf"
              className="w-full"
            />
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsReuploading(true)}
                disabled={disabled}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reupload Contract
              </Button>
            </div>
          </div>
        ) : (
          <FileUpload
            label=""
            required
            accept="application/pdf"
            maxSize="20MB"
            value={fileUrl}
            fileName={fileName}
            fileSize={
              selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : ""
            }
            showPreview={false}
            onFileSelect={handleFileSelect}
            onFileDelete={handleFileDelete}
          />
        )}
      </div>

      {/* Upload button */}
      {selectedFile && (
        <div className="flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={isUploading || disabled}
            className="min-w-[120px]"
          >
            {isUploading ? (
              <>
                <LoadingSpinner />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Contract
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
