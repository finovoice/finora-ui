"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { ClientType } from "@/constants/types";
import { Send, Copy, RefreshCw, FileText, ExternalLink } from "lucide-react";

interface SigningActionsProps {
  client: ClientType;
  isRefreshing: boolean;
  onSendForSigning: () => void;
  onCopyLink: (url: string) => void;
  onRefreshStatus: (requestId: string, clientId: string) => void;
  onViewDocument: (url: string) => void;
}

export default function SigningActions({
  client,
  isRefreshing,
  onSendForSigning,
  onCopyLink,
  onRefreshStatus,
  onViewDocument,
}: SigningActionsProps) {
  const {
    setu_signature_status,
    setu_signature_url,
    setu_signature_id,
    setu_signed_document_url,
    id,
    original_document_url,
  } = client;

  const handleRefreshStatus = () => {
    if (setu_signature_id && id) {
      onRefreshStatus(setu_signature_id, id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Send for Signing Button - Show when contract is uploaded but signing not initiated */}
      {(!setu_signature_status || setu_signature_status === "pending") && (
        <div className="flex justify-center">
          <Button onClick={onSendForSigning} className="min-w-[160px]">
            <Send className="w-4 h-4 mr-2" />
            Send for Signing
          </Button>
        </div>
      )}

      {/* Signing Actions - Show when signing is initiated */}
      {setu_signature_status === "sign_initiated" && (
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-sm text-[#667085] mb-3">
              Contract has been sent for signing. Share the link with the client
              or check the status.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {setu_signature_url && (
              <Button
                variant="outline"
                onClick={() => onCopyLink(setu_signature_url)}
                className="min-w-[140px]"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
              className="min-w-[140px]"
            >
              {isRefreshing ? (
                <>
                  <LoadingSpinner />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Status
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Signing in Progress - Show when client is actively signing */}
      {setu_signature_status === "sign_in_progress" && (
        <div className="space-y-3">
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800 font-medium mb-2">
              🔄 Client is currently signing the document
            </p>
            <p className="text-xs text-orange-600">
              The signing process is in progress. Please wait for completion or
              refresh to check the latest status.
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
              className="min-w-[140px]"
            >
              {isRefreshing ? (
                <>
                  <LoadingSpinner />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Status
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Signed Document - Show when document is signed */}
      {original_document_url && (
        <div className="text-center space-y-3">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium mb-2">
              ✅ Contract has been successfully signed!
            </p>
            <p className="text-xs text-green-600">
              The signed document is now available for download.
            </p>
          </div>

          <Button
            onClick={() => onViewDocument(original_document_url!)}
            className="min-w-[180px]"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Signed Document
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        </div>
      )}

      {/* Failed Status */}
      {setu_signature_status === "failed" && (
        <div className="text-center">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium mb-2">
              ❌ Contract signing failed
            </p>
            <p className="text-xs text-red-600">
              Please contact support or try uploading a new contract.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
