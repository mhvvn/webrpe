import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HardHat, Wrench, Settings, ArrowLeft } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';

const { Link } = ReactRouterDOM;

interface ComingSoonProps {
    pageName?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ pageName }) => {
    const { t } = useLanguage();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 font-sans text-center relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-1/4 left-1/4 animate-pulse opacity-10 dark:opacity-5 text-sea-500 transform -rotate-45">
                <Settings size={120} />
            </div>
            <div className="absolute bottom-1/4 right-1/4 animate-pulse opacity-10 dark:opacity-5 text-amber-500 delay-500">
                <Wrench size={100} />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-lg mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 mb-8 mx-auto shadow-inner relative">
                    <HardHat size={64} className="animate-bounce" />
                    {/* Small animated gear */}
                    <div className="absolute -bottom-2 -right-2 text-sea-600 dark:text-sea-400 animate-spin-slow">
                        <Settings size={32} />
                    </div>
                </div>

                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                    <span className="text-sea-600 dark:text-sea-400">{pageName || 'Fitur'}</span> <br /> Dalam Pengembangan
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                    Kami sedang bekerja keras untuk membangun halaman ini agar menjadi lebih sempurna. Silakan kembali dalam waktu dekat untuk melihat fitur terbarunya.
                </p>

                <Link to="/" className="inline-flex items-center px-6 py-3 bg-sea-600 hover:bg-sea-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <ArrowLeft size={20} className="mr-2" />
                    {t.nav.home}
                </Link>
            </div>
        </div>
    );
};

export default ComingSoon;
