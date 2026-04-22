
import React from 'react';

interface SkeletonProps {
    className?: string; // Expect Tailwind classes explicitly (e.g. w-full, h-32)
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
    return (
        <div
            className={`bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md ${className}`}
        />
    );
};

export default Skeleton;
