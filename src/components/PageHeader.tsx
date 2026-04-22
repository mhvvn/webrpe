
import React from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 py-16 text-center px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold text-sea-900 dark:text-white uppercase tracking-wider mb-6">
                    {title}
                </h1>
                <div className="w-24 h-1.5 bg-blue-400 mx-auto mb-8 rounded-full"></div>
                {description && (
                    <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
