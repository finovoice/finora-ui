"use client"

import React from 'react'
import { ClientType } from '@/constants/types'
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react'

interface SigningStatusProps {
  client: ClientType
}

interface StatusStep {
  id: string
  title: string
  description: string
  status: 'completed' | 'current' | 'pending' | 'failed'
  icon: React.ReactNode
}

export default function SigningStatus({ client }: SigningStatusProps) {
  const getSteps = (): StatusStep[] => {
    const { setu_signature_status, original_document_url, setu_signed_document_url } = client

    return [
      {
        id: 'upload',
        title: 'Contract Uploaded',
        description: 'Document has been uploaded successfully',
        status: original_document_url ? 'completed' : 'pending',
        icon: <CheckCircle className="w-5 h-5" />
      },
      {
        id: 'sent',
        title: 'Sent for Signing',
        description: 'Signing link has been generated and sent',
        status: setu_signature_status === 'sign_initiated' || setu_signature_status === 'signed' ? 'completed' : 
               setu_signature_status === 'failed' ? 'failed' : 'pending',
        icon: <Clock className="w-5 h-5" />
      },
      {
        id: 'signed',
        title: 'Document Signed',
        description: 'Client has completed the signing process',
        status: setu_signature_status === 'signed' ? 'completed' : 
               setu_signature_status === 'failed' ? 'failed' : 
               setu_signature_status === 'sign_in_progress' ? 'current' :
               setu_signature_status === 'sign_initiated' ? 'current' : 'pending',
        icon: setu_signed_document_url ? <CheckCircle className="w-5 h-5" /> : 
               setu_signature_status === 'failed' ? <XCircle className="w-5 h-5" /> : 
               <AlertCircle className="w-5 h-5" />
      }
    ]
  }

  const steps = getSteps()

  const getStepStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          container: 'text-green-700',
          icon: 'bg-green-100 text-green-600',
          line: 'bg-green-200'
        }
      case 'current':
        return {
          container: 'text-blue-700',
          icon: 'bg-blue-100 text-blue-600',
          line: 'bg-gray-200'
        }
      case 'failed':
        return {
          container: 'text-red-700',
          icon: 'bg-red-100 text-red-600',
          line: 'bg-gray-200'
        }
      default:
        return {
          container: 'text-gray-500',
          icon: 'bg-gray-100 text-gray-400',
          line: 'bg-gray-200'
        }
    }
  }

  return (
    <div className="bg-white border border-[#e4e7ec] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-[#101828] mb-6">Signing Progress</h3>

      <div className="space-y-6">
        {steps.map((step, index) => {
          const styles = getStepStyles(step.status)
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="relative flex gap-4">
              {/* Icon */}
              <div className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${styles.icon}`}>
                {step.icon}
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className={`absolute left-5 top-10 w-px h-6 ${styles.line}`} />
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium ${styles.container}`}>
                  {step.title}
                </h4>
                <p className="text-xs text-[#667085] mt-1">
                  {step.description}
                </p>

                {/* Additional status info */}
                {step.id === 'signed' && client.setu_signature_status === 'sign_initiated' && (
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    Waiting for client signature...
                  </p>
                )}

                {step.id === 'signed' && client.setu_signature_status === 'sign_in_progress' && (
                  <p className="text-xs text-orange-600 mt-1 font-medium">
                    Client is currently signing the document...
                  </p>
                )}

                {step.id === 'signed' && client.setu_signature_status === 'failed' && (
                  <p className="text-xs text-red-600 mt-1 font-medium">
                    Signing process failed
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
