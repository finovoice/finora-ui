"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { UploadCloud, Trash2, FileText } from "lucide-react"
import { useRef, useState } from "react"

export type FileUploadProps = {
  label: string
  required?: boolean
  accept?: string
  maxSize?: string
  dimensions?: string
  value?: string | null
  fileName?: string | null
  fileSize?: string
  onFileSelect?: (file: File) => void
  onFileDelete?: () => void
  placeholder?: string
  showPreview?: boolean
}

export default function FileUpload({
  label,
  required = false,
  accept = "image/*",
  maxSize = "2MB",
  dimensions,
  value,
  fileName,
  fileSize = "200 KB",
  onFileSelect,
  onFileDelete,
  placeholder = "Click to upload or drag and drop",
  showPreview = true
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileSelect = (file: File) => {
    onFileSelect?.(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE'
  }

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return null // Will show preview image
    }
    return <FileText className="h-5 w-5 text-[#667085]" />
  }

  // If file is uploaded and it's an image, show preview
  const showImagePreview = showPreview && value && accept.includes('image')

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {/* File upload area - shown when no file is selected */}
      {!value && (
        <div 
          className={`rounded-lg border transition-colors cursor-pointer ${
            isDragOver 
              ? 'border-[#6941c6] bg-[#f9f5ff]' 
              : 'border-[#e4e7ec] bg-[#fcfcfd]'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex items-center justify-center text-center px-6 py-8 text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-[#f2f4f7] flex items-center justify-center">
                <UploadCloud className="h-5 w-5 text-[#98a2b3]" />
              </div>
              <div>
                <span className="text-[#6941c6]">Click to upload</span>
                <span className="text-[#98a2b3]"> or drag and drop</span>
              </div>
              <div className="text-[#98a2b3]">
                {accept.includes('image') ? 'SVG, PNG or JPG' : 'Select file'} 
                {dimensions && ` (${dimensions})`}
                {maxSize && ` max. ${maxSize}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File preview - shown when file is selected */}
      {value && (
        <div className="rounded-lg border border-[#e4e7ec] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showImagePreview ? (
              <img 
                src={value} 
                alt="Preview" 
                className="h-9 w-9 rounded-md object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-md bg-[#f2f4f7] text-[10px] flex items-center justify-center text-[#667085] font-semibold">
                {getFileIcon(fileName || '') || getFileExtension(fileName || '')}
              </div>
            )}
            <div className="leading-tight">
              <div className="text-sm text-[#101828]">{fileName || 'Uploaded file'}</div>
              <div className="text-xs text-[#98a2b3]">{fileSize}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-[#f2f4f7]"
              onClick={handleClick}
              aria-label="Replace file"
            >
              <UploadCloud className="h-4 w-4 text-[#667085]" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-[#f2f4f7]"
              onClick={onFileDelete}
              aria-label="Remove file"
            >
              <Trash2 className="h-4 w-4 text-[#667085]" />
            </Button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}
