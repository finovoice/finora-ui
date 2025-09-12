import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  // Normalize controlled vs uncontrolled behavior to avoid React warnings.
  // - If a consumer provides a `value` prop but it's undefined/null initially,
  //   coerce it to an empty string so the input stays controlled from mount.
  // - For file inputs, never pass `value`/`defaultValue` through.
  const { value, defaultValue, ...rest } = props as any
  const hasValueProp = Object.prototype.hasOwnProperty.call(props ?? {}, "value")

  const commonClassName = cn(
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    className
  )

  // Build props to pass to the native input in a controlled-safe way.
  const inputProps: any = {
    type,
    "data-slot": "input",
    className: commonClassName,
  }

  if (type === "file") {
    // Do not pass value/defaultValue to file inputs.
  } else if (hasValueProp) {
    inputProps.value = value ?? ""
  } else if (defaultValue !== undefined) {
    inputProps.defaultValue = defaultValue
  }

  return <input {...inputProps} {...rest} />
}

export { Input }
