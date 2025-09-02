import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export function downloadCSV(headers: string[], filename: string) {
//   const csvContent = headers.join(',') + '\n';
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   if (link.download !== undefined) { // Feature detection for download attribute
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', filename);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }
// }

export function downloadCSV(
  headers: string[],
  filename: string,
  data?: [][]
) {
  // Build CSV content
  let csvContent = headers.join(',') + '\n';

  if (data && data.length > 0) {
    const rows = data.map(row => row.join(',')).join('\n');
    csvContent += rows + '\n';
  }

  // Create Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
