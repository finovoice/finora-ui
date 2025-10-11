"use client";

import * as React from "react";

interface ExpiryGaugeProps {
  daysLeft: number;
  totalDays: number;
  text?: string;
}

export default function ExpiryGauge({
  daysLeft,
  totalDays,
  text,
}: ExpiryGaugeProps) {
  const radius = 56;
  const stroke = 12;
  const size = radius * 2 + stroke;
  const normalizedRadius = radius;
  const circumference = Math.PI * normalizedRadius; // Half circle circumference

  const elapsed = Math.max(totalDays - daysLeft, 0);
  const progress = Math.min(Math.max(elapsed / totalDays, 0), 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative flex justify-center items-center w-[140px] h-[80px] ml-8">
      <svg width={size} height={size / 2 + stroke} className="rotate-0">
        <path
          d={`
            M ${stroke / 2} ${size / 2}
            A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${
            size - stroke / 2
          } ${size / 2}
          `}
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          opacity={0.8}
        />
        <path
          d={`
            M ${stroke / 2} ${size / 2}
            A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${
            size - stroke / 2
          } ${size / 2}
          `}
          stroke="#7F56D9"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Centered Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center mt-3">
        <div className="text-[0.6rem] text-[#667085]">
          {daysLeft >= 0 ? "Expires in" : "Status"}
        </div>
        <div className="text-lg font-semibold text-[#101828] -mt-1">
          {daysLeft > 0
            ? `${daysLeft} days`
            : daysLeft === 0
            ? "Expires today"
            : "Expired"}
        </div>
      </div>
    </div>
  );
}
