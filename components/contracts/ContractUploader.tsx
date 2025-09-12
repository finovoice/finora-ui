"use client"

import React from 'react'
import FileUpload from '@/components/file-upload'
import SignedUrlPreview from './SignedUrlPreview'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ContractUploaderProps {
  onFileUpload: (file: File) => void
  isUploading: boolean
  uploadedFileUrl: String | undefined
  disabled?: boolean
}

export default function ContractUploader({ 
  onFileUpload, 
  isUploading, 
  uploadedFileUrl,
  disabled = false 
}: ContractUploaderProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleFileDelete = () => {
    setSelectedFile(null)
  }

  const handleUpload = () => {
    if (selectedFile && !isUploading) {
      onFileUpload(selectedFile)
    }
  }

  const fileUrl = selectedFile ? URL.createObjectURL(selectedFile) : null
  const fileName = selectedFile?.name

  // Check if we have an uploaded file URL (signed URL from backend)
  const hasUploadedFile = uploadedFileUrl && !selectedFile

    console.log({ fileName, hasUploadedFile, uploadedFileUrl })

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-sm font-medium text-[#344054]">
          Contract Document <span className="text-red-500">*</span>
        </div>

        {hasUploadedFile ? (
          <SignedUrlPreview 
            url={uploadedFileUrl.toString()}
            fileName="Contract Document.pdf"
            className="w-full"
          />
        ) : (
          <FileUpload
            label=""
            required
            accept="application/pdf"
            maxSize="20MB"
            value={fileUrl}
            fileName={fileName}
            fileSize={selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : ''}
            showPreview={false}
            onFileSelect={handleFileSelect}
            onFileDelete={handleFileDelete}
          />
        )}
      </div>

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
  )
}
