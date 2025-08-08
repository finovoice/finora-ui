"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close {...props} />
}

function SheetContent({
  side = "right",
  className,
  children,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "right" | "left" | "top" | "bottom"
}) {
  const sideClasses =
    side === "right"
      ? "right-0 top-0 h-full w-full sm:max-w-lg"
      : side === "left"
      ? "left-0 top-0 h-full w-full sm:max-w-lg"
      : side === "top"
      ? "top-0 left-0 w-full sm:max-h-[85vh]"
      : "bottom-0 left-0 w-full sm:max-h-[85vh]"

  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <SheetPrimitive.Content
        className={cn(
          "fixed z-50 grid gap-0 border bg-white shadow-xl outline-none",
          sideClasses,
          className
        )}
        {...props}
      >
        {children}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}

export { Sheet, SheetTrigger, SheetClose, SheetContent }
