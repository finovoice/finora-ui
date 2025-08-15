"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => Promise<void> | void
  onCancel?: () => void
  loading?: boolean
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading: externalLoading,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = React.useState(false)

  const loading = externalLoading ?? internalLoading

  async function handleConfirm() {
    if (!onConfirm) {
      onOpenChange(false)
      return
    }
    try {
      setInternalLoading(true)
      await onConfirm()
      onOpenChange(false)
    } finally {
      setInternalLoading(false)
    }
  }

  function handleCancel() {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && onOpenChange(v)}>
      <DialogContent className="max-w-sm p-0 overflow-hidden" showCloseButton={!loading}>
        <DialogHeader className="border-b border-[#e4e7ec] px-6 py-4">
          <DialogTitle className="text-sm text-[#101828]">{title}</DialogTitle>
          {description && (
            <DialogDescription className="mt-1 text-[#667085]">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="px-6 py-4">
          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              className="w-full h-10 bg-[#7f56d9] hover:bg-[#6941c6] text-white disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Please wait..." : confirmText}
            </Button>
            <button
              type="button"
              className="w-full h-10 rounded-md border border-[#e4e7ec] bg-white text-[#344054] disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
