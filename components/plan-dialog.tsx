"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlanDetails, RenewalKey } from "@/services/plan";

const renewals: { key: RenewalKey; label: string }[] = [
  { key: "WEEKLY", label: "Weekly" },
  { key: "MONTHLY", label: "Monthly" },
  { key: "QUARTERLY", label: "Quarterly" },
];

const typeOptions = [
  { key: "STANDARD", label: "Standard" },
  { key: "PREMIUM", label: "Premium" },
  { key: "ELITE", label: "Elite" },
];

function CurrencyInput(props: React.ComponentProps<typeof Input>) {
  const { className, ...rest } = props;
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">
        ₹
      </span>
      <Input
        type="number"
        step="1"
        min="0"
        {...rest}
        className={`pl-8 ${className ?? ""}`}
      />
    </div>
  );
}

export default function PlanDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: PlanDetails | null;
  onSave?: (data: PlanDetails) => void;
}) {
  const [form, setForm] = useState<PlanDetails>({
    name: "",
    price: "",
    renewal_period: "MONTHLY",
    type: "STANDARD",
  });

  useEffect(() => {
    if (open && initial) {
      setForm({
        id: initial.id,
        name: initial.name,
        price: initial.price ?? "",
        renewal_period: initial.renewal_period ?? "MONTHLY",
        type: initial.type ?? "STANDARD",
      });
    } else if (open && !initial) {
      setForm({
        name: "",
        price: "",
        renewal_period: "MONTHLY",
        type: "STANDARD",
      });
    }
  }, [open, initial]);

  const isValid = form.name.trim().length > 0 && form.price !== "";

  function handleSave() {
    if (!isValid) return;

    const cleaned: PlanDetails = {
      ...(form.id ? { id: form.id } : {}),
      name: form.name.trim(),
      price: String(form.price),
      type: form.type,
    };

    if (!form.id) {
      cleaned.renewal_period = form.renewal_period;
    }

    onSave?.(cleaned);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[60%] max-w-2xl p-0" showCloseButton>
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{initial ? "Edit plan" : "Add plan"}</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* Plan name */}
          <div className="space-y-1.5">
            <Label htmlFor="plan-name">
              Plan name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="plan-name"
              placeholder="Plan name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          {/* Plan type */}
          <div className="space-y-1.5">
            <Label htmlFor="plan-type">
              Plan type <span className="text-red-500">*</span>
            </Label>
            <select
              id="plan-type"
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  type: e.target.value as PlanDetails["type"],
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              disabled={initial ? true : false}
            >
              {typeOptions.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Renewal period (only for new plans) */}

          <div className="space-y-2">
            <Label>
              Renewal period <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              {renewals.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <input
                    type="radio"
                    id={`renewal-${key}`}
                    name="renewal_period"
                    checked={form.renewal_period === key}
                    onChange={() =>
                      setForm((prev) => ({ ...prev, renewal_period: key }))
                    }
                    className="h-4 w-4"
                    disabled={form.id ? true : false}
                  />
                  <Label
                    htmlFor={`renewal-${key}`}
                    className="text-sm text-[#475467]"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label htmlFor="price">
              Price <span className="text-red-500">*</span>
            </Label>
            <CurrencyInput
              id="price"
              placeholder="Enter price"
              value={form.price}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, price: e.target.value }))
              }
            />
          </div>

          {/* Save button */}
          <div className="pt-2">
            <Button
              className="w-full bg-[#7f56d9] hover:bg-[#6941c6] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!isValid}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
