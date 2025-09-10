"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import FileUpload from "@/components/file-upload"
import { showToast } from "@/components/ui/toast-manager"
import { uploadContractAPI } from "@/services/clients"
import { ContractUploadResponse } from "@/constants/types"
import { Upload, Send } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ContractUploadCardProps {
  clientId: string
  onUploadSuccess: (response: ContractUploadResponse) => void
}

export function ContractUploadCard({ clientId, onUploadSuccess }: ContractUploadCardProps) {
  const [file, setFile] = useState<File | null>(null)
  const [contractUrl, setContractUrl] = useState<string | null>(null)
  const [contractName, setContractName] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [uploadResponse, setUploadResponse] = useState<ContractUploadResponse | null>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setContractName(selectedFile.name)
    const url = URL.createObjectURL(selectedFile)
    setContractUrl(url)
  }

  const handleFileDelete = () => {
    setFile(null)
    setContractUrl(null)
    setContractName(null)
    setUploadResponse(null)
  }

  const handleUpload = async () => {
    if (!file) {
      showToast({ 
        title: "No file selected", 
        description: "Please select a contract file to upload", 
        type: "warning" 
      })
      return
    }

    setIsUploading(true)
    try {
      const response = await uploadContractAPI(file, clientId)
      setUploadResponse(response)
      showToast({ 
        title: "Success", 
        description: "Contract uploaded successfully", 
        type: "success" 
      })
    } catch (error) {
      console.error("Upload failed:", error)
      showToast({ 
        title: "Upload Failed", 
        description: "Failed to upload contract. Please try again.", 
        type: "error" 
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSendForSigning = async () => {
    if (!uploadResponse) return

    setIsSending(true)
    try {
      // The upload response already contains signature initiation
      onUploadSuccess(uploadResponse)
      showToast({ 
        title: "Success", 
        description: "Contract sent for signing", 
        type: "success" 
      })
    } catch (error) {
      console.error("Send for signing failed:", error)
      showToast({ 
        title: "Failed", 
        description: "Failed to send contract for signing", 
        type: "error" 
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Contract Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-[#344054] mb-2 block">
            Contract Document <span className="text-red-500">*</span>
          </Label>
          <FileUpload
            label=""
            required
            accept="application/pdf"
            maxSize="20MB"
            value={contractUrl}
            fileName={contractName ?? undefined}
            fileSize=""
            showPreview={false}
            onFileSelect={handleFileSelect}
            onFileDelete={handleFileDelete}
          />
        </div>

        {file && !uploadResponse && (
          <Button 
            onClick={handleUpload} 
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <LoadingSpinner/>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Contract
              </>
            )}
          </Button>
        )}

        {uploadResponse && (
          <Button 
            onClick={handleSendForSigning}
            disabled={isSending}
            className="w-full"
          >
            {isSending ? (
              <>
                <LoadingSpinner  />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send for Signing
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
