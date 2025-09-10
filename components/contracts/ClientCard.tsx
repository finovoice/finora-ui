"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ClientType } from '@/constants/types'
import { User, Mail, Phone, CreditCard, Calendar, FileText } from 'lucide-react'

interface ClientCardProps {
  client: ClientType
}

export default function ClientCard({ client }: ClientCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sign_initiated':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'sign_in_progress':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'signed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sign_initiated':
        return 'Signing Initiated'
      case 'sign_in_progress':
        return 'Signing in Progress'
      case 'signed':
        return 'Signed'
      case 'pending':
        return 'Pending'
      case 'failed':
        return 'Failed'
      default:
        return status
    }
  }

  return (
    <Card className="p-6 bg-white border border-[#e4e7ec]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f9f5ff] flex items-center justify-center">
              <User className="w-5 h-5 text-[#6941c6]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#101828]">
                {client.first_name} {client.last_name}
              </h3>
              <p className="text-sm text-[#667085]">Client ID: {client.id}</p>
            </div>
          </div>
          {client.setu_signature_status && (
            <Badge className={getStatusColor(client.setu_signature_status)}>
              {getStatusText(client.setu_signature_status)}
            </Badge>
          )}
        </div>

        {/* Client Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-[#667085]" />
            <span className="text-[#667085]">Email:</span>
            <span className="text-[#101828]">{client.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-[#667085]" />
            <span className="text-[#667085]">Phone:</span>
            <span className="text-[#101828]">{client.phone_number}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4 text-[#667085]" />
            <span className="text-[#667085]">PAN:</span>
            <span className="text-[#101828] font-mono">{client.pancard}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-[#667085]" />
            <span className="text-[#667085]">Plan:</span>
            <span className="text-[#101828] capitalize">{client.plan?.toLowerCase()}</span>
          </div>
        </div>

        {/* Dates */}
        {(client.start_date || client.end_date) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#e4e7ec]">
            {client.start_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-[#667085]" />
                <span className="text-[#667085]">Start Date:</span>
                <span className="text-[#101828]">
                  {new Date(client.start_date).toLocaleDateString()}
                </span>
              </div>
            )}
            {client.end_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-[#667085]" />
                <span className="text-[#667085]">End Date:</span>
                <span className="text-[#101828]">
                  {new Date(client.end_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {client.notes && (
          <div className="pt-2 border-t border-[#e4e7ec]">
            <p className="text-sm text-[#667085] mb-1">Notes:</p>
            <p className="text-sm text-[#101828] bg-[#f9fafb] p-3 rounded-lg">
              {client.notes}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
