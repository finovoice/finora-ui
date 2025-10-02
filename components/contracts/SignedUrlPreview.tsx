"use client"

import React, { useEffect, useState } from 'react'
import { FileText, Download, ExternalLink, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createSignedUrlAPI } from '@/services/upload'

interface SignedUrlPreviewProps {
  url: string
  fileName?: string
  className?: string
}

export default function SignedUrlPreview({ 
  url, 
  fileName = 'Document', 
  className = '' 
}: SignedUrlPreviewProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [hasViewed, setHasViewed] = useState(false)
   
 
  
  

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || ''
  }

  const getFileType = (filename: string) => {
    const extension = getFileExtension(filename)
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image'
    }
    if (extension === 'pdf') {
      return 'pdf'
    }
    return 'document'
  }

 const handleDownload = async () => {
  setLoading(true)
  try {
    const res = await createSignedUrlAPI(url)
    const fileUrl = res.signed_url
    setSignedUrl(fileUrl)

    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    console.error("Failed to download:", err)
    setError(true)
  } finally {
    setLoading(false)
    setHasViewed(true)
  }
}

const handlePreview = async () => {
  try {
    setLoading(true)
    const res = await createSignedUrlAPI(url)
    const fileUrl = res.signed_url
    setSignedUrl(fileUrl)
    window.open(fileUrl, '_blank')
  } catch (err) {
    console.error("Failed to preview:", err)
    setError(true)
  } finally {
    setHasViewed(true)
    setLoading(false)
  }
}

const handleView = async () => {
  try {
    setLoading(true)
    const res = await createSignedUrlAPI(url)
    const fileUrl = res.signed_url
    setSignedUrl(fileUrl)
    window.open(fileUrl, '_blank')
  } catch (err) {
    console.error("Failed to view:", err)
    setError(true)
  } finally {
    setHasViewed(true)
    setLoading(false)
  }
}

  // Loading state while fetching signed URL
  if (loading) {
    return (
      <div className={`rounded-lg border border-[#e4e7ec] bg-white p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#f2f4f7]"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-[#f2f4f7]"></div>
              <div className="h-3 w-24 rounded bg-[#f2f4f7]"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && hasViewed) {
    return (
      <div className={`rounded-lg border border-[#fecaca] bg-[#fef2f2] p-6 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#fee2e2] flex items-center justify-center">
            <FileText className="h-5 w-5 text-[#dc2626]" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-[#dc2626]">
              Failed to load preview
            </div>
            <div className="text-xs text-[#991b1b]">
              Unable to generate signed URL for {fileName}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setError(false); setHasViewed(false) }}
            className="text-xs"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const fileType = getFileType(fileName)

  // Initial state - show file info with View button
  if (!hasViewed || !signedUrl) {
    return (
      <div className={`rounded-lg border border-[#e4e7ec] bg-white shadow-sm ${className}`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#f2f4f7] flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#667085]" />
              </div>
              <div>
                <div className="text-sm font-medium text-[#101828]">
                  {fileName}
                </div>
                <div className="text-xs text-[#667085]">
                  Click view to preview document
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
              className="text-xs"
              disabled={loading}
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Preview state - show full preview with actions
  return (
    <div className={`rounded-lg border border-[#e4e7ec] bg-white shadow-sm ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#f2f4f7] flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#667085]" />
            </div>
            <div>
              <div className="text-sm font-medium text-[#101828]">
                {fileName}
              </div>
              <div className="text-xs text-[#667085]">
                Document Preview
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreview}
              className="h-8 px-2"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-2"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview content */}
        <div className="rounded-md border border-[#e4e7ec] overflow-hidden">
          {fileType === 'image' && (
            <img
              src={signedUrl}
              alt={fileName}
              className="w-full max-h-48 object-contain bg-[#f9fafb]"
              onError={(e) => {
                console.error('Image failed to load')
                setError(true)
              }}
            />
          )}

          {fileType === 'pdf' && (
            <div className="p-8 text-center bg-[#f9fafb]">
              <FileText className="h-12 w-12 text-[#667085] mx-auto mb-3" />
              <div className="text-sm text-[#667085] mb-3">
                PDF Preview
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                className="text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open in New Tab
              </Button>
            </div>
          )}

          {fileType === 'document' && (
            <div className="p-8 text-center bg-[#f9fafb]">
              <FileText className="h-12 w-12 text-[#667085] mx-auto mb-3" />
              <div className="text-sm text-[#667085] mb-3">
                Document Preview Not Available
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Download File
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
