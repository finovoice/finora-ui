import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

type DatePickerProps = {
  value: string;
  onChange: (date: string) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
};

function parseDate(str: string | null) {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export default function DatePicker({
  value,
  onChange,
  label,
  disabled,
  minDate,
  maxDate,
  placeholder,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedDate = parseDate(value);
  const min = parseDate(minDate ?? null);
  const max = parseDate(maxDate ?? null);

  const [calendarMonth, setCalendarMonth] = useState(
    selectedDate ?? new Date()
  );

  useEffect(() => {
    if (selectedDate) {
      setCalendarMonth(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
      );
    }
  }, [value]);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function daysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function isSameDay(d1: Date, d2: Date) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  function isDateDisabled(date: Date) {
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  }

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const startWeekday = new Date(year, month, 1).getDay();
  const daysCount = daysInMonth(year, month);

  const weeks: (Date | null)[][] = [];
  let dayCounter = 1 - startWeekday;
  while (dayCounter <= daysCount) {
    const week: (Date | null)[] = [];
    for (let i = 0; i < 7; i++, dayCounter++) {
      if (dayCounter < 1 || dayCounter > daysCount) {
        week.push(null);
      } else {
        week.push(new Date(year, month, dayCounter));
      }
    }
    weeks.push(week);
  }

  const yearRangeStart = min ? min.getFullYear() : year - 100;
  const yearRangeEnd = max ? max.getFullYear() : year + 10;
  const years = [];
  for (let y = yearRangeStart; y <= yearRangeEnd; y++) {
    years.push(y);
  }

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="w-full h-10 rounded-md border border-[#e4e7ec] text-[#344054] text-left px-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#7f56d9]"
        aria-label="Choose date"
      >
        {value || placeholder || "Select date"}
        <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute z-[9999] bottom-full mb-2 left-0 w-64 bg-white border border-[#e4e7ec] rounded-md shadow-lg flex flex-col">
          {/* Header with title + Close (X) icon only */}
          <div className="flex items-center justify-between p-3 border-b border-[#e4e7ec] sticky top-0 bg-white z-10">
            <div className="text-[#101828] font-semibold text-sm">
              Select Date
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="p-1 rounded hover:bg-[#f0eefd] text-[#7f56d9]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Month/Year nav */}

          <div className="flex justify-between items-center px-3 py-2 space-x-2 text-xs">
            {/* Previous month button */}
            <button
              type="button"
              onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
              className="p-1 rounded hover:bg-[#f0eefd] text-[#7f56d9]"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Month dropdown */}
            <select
              value={month}
              onChange={(e) =>
                setCalendarMonth(new Date(year, Number(e.target.value), 1))
              }
              className="border border-[#e4e7ec] rounded px-1 py-0.5 text-[#344054]"
              aria-label="Select month"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString("default", { month: "short" })}
                </option>
              ))}
            </select>

            {/* Year dropdown */}
            <select
              value={year}
              onChange={(e) =>
                setCalendarMonth(new Date(Number(e.target.value), month, 1))
              }
              className="border border-[#e4e7ec] rounded px-1 py-0.5 text-[#344054]"
              aria-label="Select year"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Next month button */}
            <button
              type="button"
              onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
              className="p-1 rounded hover:bg-[#f0eefd] text-[#7f56d9]"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Calendar grid */}
          <table className="w-full table-fixed text-center text-xs text-[#667085] select-none px-3 pb-3">
            <thead>
              <tr>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <th key={d} className="py-1">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, i) => (
                <tr key={i}>
                  {week.map((day, idx) => {
                    if (!day) return <td key={idx} />;
                    const disabled = isDateDisabled(day);
                    const selected = selectedDate
                      ? isSameDay(day, selectedDate)
                      : false;
                    return (
                      <td key={idx}>
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => {
                            onChange(formatDate(day));
                            setOpen(false);
                          }}
                          className={`w-7 h-7 rounded-full ${
                            selected
                              ? "bg-[#7f56d9] text-white"
                              : disabled
                              ? "text-[#cbd5e1] cursor-not-allowed"
                              : "hover:bg-[#f0eefd] text-[#344054]"
                          } focus:outline-none focus:ring-2 focus:ring-[#7f56d9]`}
                        >
                          {day.getDate()}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
