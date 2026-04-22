import React from 'react';
import { Target, Eye, CheckCircle, Download } from 'lucide-react';
import { ACCREDITATION_CERT_URL } from '../constants';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../context/LanguageContext';

const About: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title={t.about.title}
                description={t.about.subtitle}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 sm:p-12 mb-12 border border-slate-100 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 border-b dark:border-slate-700 pb-4">{t.about.history_title}</h2>
                    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                        <p className="mb-4">
                            {t.about.history_p1}
                        </p>
                        <p>
                            {t.about.history_p2}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Visi */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border-l-4 border-sea-500">
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-sea-50 dark:bg-slate-800 rounded-lg text-sea-600 dark:text-sea-400 mr-4">
                                <Eye size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.about.vision_title}</h2>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                            {t.about.vision_text}
                        </p>
                    </div>

                    {/* Misi */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-amber-50 dark:bg-slate-800 rounded-lg text-amber-600 dark:text-amber-500 mr-4">
                                <Target size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.about.mission_title}</h2>
                        </div>
                        <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                            {[t.about.mission_1, t.about.mission_2, t.about.mission_3].map((item, idx) => (
                                <li key={idx} className="flex items-start">
                                    <CheckCircle size={20} className="text-amber-500 mr-3 mt-1 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Akreditasi Section Updated */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 shadow-lg border border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        {/* Left: Image & Download */}
                        <div className="flex flex-col items-center">
                            <div className="relative group w-full max-w-md shadow-2xl border-8 border-white dark:border-slate-800 rounded-lg overflow-hidden mb-6 transform transition hover:scale-[1.02]">
                                <img
                                    src={ACCREDITATION_CERT_URL}
                                    alt="Sertifikat Akreditasi"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300"></div>
                            </div>
                            <a
                                href={ACCREDITATION_CERT_URL}
                                download="Sertifikat_Akreditasi_RPE.jpg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 bg-sea-600 hover:bg-sea-700 text-white font-bold rounded-lg shadow-lg shadow-sea-600/20 transition-all transform hover:-translate-y-1"
                            >
                                <Download size={20} className="mr-2" />
                                Unduh Sertifikat
                            </a>
                        </div>

                        {/* Right: Text Content */}
                        <div className="text-left">
                            <h2 className="text-3xl font-extrabold text-sea-500 dark:text-sea-400 mb-6 uppercase tracking-wide">
                                {t.about.accreditation_title}
                            </h2>
                            <div className="prose prose-lg prose-slate dark:prose-invert text-slate-600 dark:text-slate-300 mb-8">
                                <p>
                                    {t.about.accreditation_p1}
                                </p>
                                <p>
                                    {t.about.accreditation_p2}
                                </p>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="text-center bg-sea-50 dark:bg-slate-800 px-8 py-4 rounded-xl shadow-sm border border-sea-200 dark:border-slate-700">
                                    <span className="text-3xl font-extrabold text-sea-700 dark:text-sea-400">{t.about.rank_label}</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold uppercase tracking-wider">
                                        {t.about.rank_source}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;