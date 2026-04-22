import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, ArrowLeft } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';

const { Link } = ReactRouterDOM;

const NotFound: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 font-sans text-center relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-1/3 left-[20%] animate-pulse opacity-10 dark:opacity-5 text-sea-500">
                <Search size={160} />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-lg mb-8 transform transition-transform hover:scale-105 duration-500">
                <div className="text-[12rem] md:text-[15rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-sea-400 via-sea-600 to-amber-500 select-none drop-shadow-xl mb-2">
                    404
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    Halaman Tidak Ditemukan
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                    Ops! Jalan buntu. Halaman yang Anda cari mungkin telah dipindahkan, direnovasi, atau memang tidak pernah ada.
                </p>

                <Link to="/" className="inline-flex items-center px-8 py-3.5 bg-sea-600 hover:bg-sea-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-sea-600/30 hover:shadow-sea-600/50 transform hover:-translate-y-1">
                    <ArrowLeft size={20} className="mr-2" />
                    Kembali ke {t.nav.home}
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
