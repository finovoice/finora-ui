"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  danger?: boolean
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  danger = true,
}: ConfirmDialogProps) {
  function handleConfirm() {
    onConfirm?.()
    onOpenChange(false)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm text-[#101828]">{title}</DialogTitle>
        </DialogHeader>
        {description ? (
          <p className="text-sm text-[#667085]">{description}</p>
        ) : null}
        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#e4e7ec]"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className={
              danger
                ? "bg-[#d92d20] hover:bg-[#b42318] text-white"
                : "bg-[#7f56d9] hover:bg-[#6941c6] text-white"
            }
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
