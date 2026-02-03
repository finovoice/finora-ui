import * as Toast from '@radix-ui/react-toast';
import { useEffect, useRef, useState } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
    title: string;
    description?: string;
    type?: ToastType;
    duration?: number;
    progress?: number; // Added for upload progress
}

interface ToastItem extends ToastOptions {
    id: string;
    open: boolean;
}

let triggerToast: (options: ToastOptions) => void = () => { };

export const ToastManager = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const toastIdRef = useRef(0);

    useEffect(() => {
        triggerToast = (opts) => {
            const id = String(toastIdRef.current++);
            setToasts((prevToasts) => [
                ...prevToasts,
                {
                    id,
                    open: true,
                    ...opts,
                    type: opts.type ?? 'info',
                    duration: opts.duration ?? 3000,
                },
            ]);
        };
    }, []);

    const handleOpenChange = (id: string, open: boolean) => {
        setToasts((prevToasts) =>
            prevToasts.map((toast) => (toast.id === id ? { ...toast, open } : toast))
        );
        // Remove toast from the DOM after it has closed
        if (!open) {
            setTimeout(() => {
                setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
            }, 200); // Match the data-[state=closed] duration
        }
    };

    const getIconSvgPath = (type: ToastType | undefined) => {
        switch (type) {
            case 'success':
                return "M5 13l4 4L19 7";
            case 'error':
                return "M6 18L18 6M6 6l12 12";
            case 'warning':
                return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z";
            case 'info':
            default:
                return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
        }
    };

    return (
        <Toast.Provider swipeDirection="right">
            {toasts.map((toast) => {
                const iconContainerClasses = {
                    success: 'bg-green-100',
                    error: 'bg-red-100',
                    warning: 'bg-yellow-100',
                    info: 'bg-blue-100',
                }[toast.type || 'info'];

                const iconClasses = {
                    success: 'text-green-600',
                    error: 'text-red-600',
                    warning: 'text-yellow-600',
                    info: 'text-blue-600',
                }[toast.type || 'info'];

                return (
                    <Toast.Root
                        key={toast.id}
                        className={`z-[9999] flex items-center gap-4 min-w-80 max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-4 outline-none focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2
                            data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full data-[state=open]:duration-300
                            data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full data-[state=closed]:duration-200
                        `}
                        open={toast.open}
                        onOpenChange={(open) => handleOpenChange(toast.id, open)}
                        duration={toast.duration}
                    >
                        <div className="flex-shrink-0">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${iconContainerClasses}`}>
                                <svg
                                    className={`w-4 h-4 ${iconClasses}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={getIconSvgPath(toast.type)}
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <Toast.Title className="block font-semibold text-gray-900 text-sm leading-5">
                                {toast.title}
                            </Toast.Title>
                            {toast.description && (
                                <Toast.Description className="text-gray-600 text-sm leading-5 mt-1">
                                    {toast.description}
                                </Toast.Description>
                            )}
                            {toast.progress !== undefined && toast.progress >= 0 && toast.progress <= 100 && (
                                <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-100 ease-out"
                                        style={{ width: `${toast.progress}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                        <Toast.Close asChild>
                            <button
                                className="flex-shrink-0 w-8 h-8 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 pressed:bg-gray-200 transition-colors flex items-center justify-center outline-none focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
                                aria-label="Close toast"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </Toast.Close>
                    </Toast.Root>
                );
            })}

            <Toast.Viewport className="fixed bottom-4 right-4 flex flex-col-reverse gap-2 z-[9999]" />
        </Toast.Provider>
    );
};

export const showToast = (options: ToastOptions) => {
    triggerToast(options);
};
