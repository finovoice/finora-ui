"use client"

import { useState, useCallback } from 'react'
import { uploadContractAPI, refreshSigningStatusAPI } from '@/services/clients'
import { ContractUploadResponse, RefreshStatusResponse } from '@/constants/types'
import { showToast } from '@/components/ui/toast-manager'

export function useContractSigning(onClientUpdate?: (updatedClient: ContractUploadResponse) => void) {
  const [isUploading, setIsUploading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [contractData, setContractData] = useState<ContractUploadResponse | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const uploadContract = useCallback(async (file: File, clientId: string) => {
    if (!file || !clientId) {
      showToast({ 
        title: 'Error', 
        description: 'File and client ID are required', 
        type: 'error' 
      })
      return null
    }

    setIsUploading(true)
    try {
      const response = await uploadContractAPI(file, clientId)
      setContractData(response)
      setUploadedFile(file)

      // Notify parent component of client update
      if (onClientUpdate) {
        onClientUpdate(response)
      }

      showToast({ 
        title: 'Success', 
        description: 'Contract uploaded successfully', 
        type: 'success' 
      })
      return response
    } catch (error: any) {
      showToast({ 
        title: 'Upload Failed', 
        description: error?.message || 'Failed to upload contract', 
        type: 'error' 
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }, [onClientUpdate])

  const refreshSigningStatus = useCallback(async (requestId: string, clientId: string) => {
    if (!requestId || !clientId) {
      showToast({ 
        title: 'Error', 
        description: 'Request ID and client ID are required', 
        type: 'error' 
      })
      return null
    }

    setIsRefreshing(true)
    try {
      const response = await refreshSigningStatusAPI(requestId, clientId)
      setContractData(response)

      // Notify parent component of client update
      if (onClientUpdate) {
        onClientUpdate(response)
      }

      showToast({ 
        title: 'Status Updated', 
        description: 'Signing status refreshed successfully', 
        type: 'success' 
      })
      return response
    } catch (error: any) {
      showToast({ 
        title: 'Refresh Failed', 
        description: error?.message || 'Failed to refresh signing status', 
        type: 'error' 
      })
      return null
    } finally {
      setIsRefreshing(false)
    }
  }, [onClientUpdate])

  const copySigningLink = useCallback((url: string) => {
    if (!url) {
      showToast({ 
        title: 'Error', 
        description: 'No signing link available', 
        type: 'error' 
      })
      return
    }

    navigator.clipboard.writeText(url).then(() => {
      showToast({ 
        title: 'Copied!', 
        description: 'Signing link copied to clipboard', 
        type: 'success' 
      })
    }).catch(() => {
      showToast({ 
        title: 'Copy Failed', 
        description: 'Failed to copy signing link', 
        type: 'error' 
      })
    })
  }, [])

  const viewSignedDocument = useCallback((url: string) => {
    if (!url) {
      showToast({ 
        title: 'Error', 
        description: 'No signed document available', 
        type: 'error' 
      })
      return
    }

    window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  const resetContract = useCallback(() => {
    setContractData(null)
    setUploadedFile(null)
  }, [])

  return {
    // State
    isUploading,
    isRefreshing,
    contractData,
    uploadedFile,

    // Actions
    uploadContract,
    refreshSigningStatus,
    copySigningLink,
    viewSignedDocument,
    resetContract
  }
}
