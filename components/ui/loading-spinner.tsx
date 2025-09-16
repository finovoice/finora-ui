import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center">
            <div
                className="inline-block h-4 w-4 animate-spin rounded-full border-1 border-solid border-current border-r-transparent align-[-0.125em] text-gray-900 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
            </div>
        </div>
    );
};

export default LoadingSpinner;
