"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ContractUploadResponse } from "@/constants/types"
import { User, Mail, Phone, CreditCard, Calendar } from "lucide-react"

interface ClientDetailsCardProps {
  client: ContractUploadResponse
}

export function ClientDetailsCard({ client }: ClientDetailsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sign_initiated':
        return 'bg-yellow-100 text-yellow-800'
      case 'signed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Client Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-gray-600">
                  {client.first_name} {client.last_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-600">{client.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-gray-600">{client.phone_number}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">PAN</p>
                <p className="text-sm text-gray-600">{client.pancard}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Plan</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{client.plan}</Badge>
                  <span className="text-sm text-gray-600">
                    {client.start_date && formatDate(client.start_date)} - {client.end_date && formatDate(client.end_date)}
                  </span>
                </div>
              </div>
            </div>

            {client.setu_signature_status && (
              <div>
                <p className="text-sm font-medium mb-1">Signature Status</p>
                <Badge className={getStatusColor(client.setu_signature_status)}>
                  {client.setu_signature_status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {client.notes && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-1">Notes</p>
            <p className="text-sm text-gray-600">{client.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
