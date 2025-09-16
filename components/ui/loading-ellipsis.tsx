"use client"

import React, { useState, useEffect } from 'react';

interface LoadingEllipsisProps {
    text?: string;
    interval?: number; // Interval in ms for dot animation
}

const LoadingEllipsis: React.FC<LoadingEllipsisProps> = ({
    text = "Clients are being loaded",
    interval = 100, // Increased pace by 3x (300ms / 3 = 100ms)
}) => {
    const dotStates = ['.', '..', '...', '....']; // Order for animation from '.' to '....'
    const [dotIndex, setDotIndex] = useState(0); // Initialize with '.'

    useEffect(() => {
        const timer = setInterval(() => {
            setDotIndex((prevIndex) => (prevIndex + 1) % dotStates.length);
        }, interval);

        return () => clearInterval(timer);
    }, [interval]);

    return (
        <div className="text-left text-sm  text-[#475467]">
            {text}
            <span className="inline-block w-[2em] text-left"> {/* Adjusted width for dots */}
                {dotStates[dotIndex]}
            </span>
        </div>
    );
};

export default LoadingEllipsis;
