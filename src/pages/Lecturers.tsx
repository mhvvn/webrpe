
import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, BookOpen, GraduationCap, Award, Clapperboard, Search, Mail, User, Briefcase, Globe, X, ZoomIn } from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../context/LanguageContext';

import Skeleton from '../components/Skeleton';

const Lecturers: React.FC = () => {
    const { t } = useLanguage();
    const { lecturers, loading } = useAcademic();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Skeleton Component
    const LecturerSkeleton = () => (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-full">
            <Skeleton className="h-72 w-full rounded-none" />
            <div className="p-6 flex-1 flex flex-col space-y-4">
                <Skeleton className="h-4 w-1/3" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-6 w-24 rounded-md" />
                </div>
                <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="mt-auto space-y-2 pt-4">
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
            </div>
        </div>
    );

    // Filter logic
    const filteredLecturers = lecturers.filter(lecturer => {
        const term = searchTerm.toLowerCase();
        return (
            lecturer.name.toLowerCase().includes(term) ||
            (lecturer.nik && lecturer.nik.toLowerCase().includes(term)) ||
            lecturer.specialization.toLowerCase().includes(term) ||
            lecturer.title.toLowerCase().includes(term)
        );
    });

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
                    <button
                        className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300 z-50"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Full view"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl scale-100 animate-zoom-in"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
            <PageHeader
                title={t.academic.lecturers.title}
                description={t.academic.lecturers.subtitle}
            />

            {/* Search Bar Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-12">
                <div className="max-w-xl mx-auto relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="text-slate-400" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder={t.academic.lecturers.search_placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg transition-all"
                    />
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <LecturerSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredLecturers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredLecturers.map((lecturer) => (
                            <div key={lecturer.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col">

                                {/* Full Width Image Section */}
                                <div
                                    className="relative h-72 w-full overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer group/image"
                                    onClick={() => setSelectedImage(lecturer.image_url)}
                                >
                                    <img
                                        src={lecturer.image_url}
                                        alt={lecturer.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 group-hover/image:scale-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-90 transition-opacity duration-300 group-hover/image:opacity-70"></div>

                                    {/* Hover hint */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                                        <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300">
                                            <ZoomIn size={18} className="mr-2" />
                                            <span className="text-sm font-medium">{t.academic.lecturers.view_photo}</span>
                                        </div>
                                    </div>

                                    {/* Title Badge Floating */}
                                    <div className="absolute top-4 right-4">
                                        <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wide shadow-sm">
                                            {lecturer.title}
                                        </span>
                                    </div>

                                    {/* Name Overlay */}
                                    <div className="absolute bottom-0 left-0 w-full p-6">
                                        <h3 className="text-2xl font-bold text-white leading-tight mb-2 text-shadow-sm">
                                            {lecturer.name}
                                        </h3>
                                        {lecturer.nik && (
                                            <div className="flex items-center text-slate-300 text-xs font-mono">
                                                <span className="opacity-70 mr-2">{t.academic.lecturers.nik}</span>
                                                <span className="bg-white/10 px-2 py-0.5 rounded text-white">{lecturer.nik}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex-1 flex flex-col">

                                    {/* Specialization Section */}
                                    <div className="mb-6">
                                        <div className="flex items-center mb-2">
                                            <Briefcase size={16} className="text-amber-500 mr-2" />
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.academic.lecturers.specialization}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {lecturer.specialization.split(',').map((spec, idx) => (
                                                <span key={idx} className="px-2.5 py-1 rounded-md bg-sea-50 dark:bg-slate-800 text-sea-700 dark:text-sea-300 text-xs font-semibold border border-sea-100 dark:border-slate-700">
                                                    {spec.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Education History */}
                                    {lecturer.education_history && lecturer.education_history.length > 0 && (
                                        <div className="mb-6">
                                            <div className="flex items-center mb-3">
                                                <GraduationCap size={16} className="text-sea-600 mr-2" />
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.academic.lecturers.education}</span>
                                            </div>
                                            <div className="space-y-3 relative before:absolute before:left-[5px] before:top-1 before:h-full before:w-[1px] before:bg-slate-200 dark:before:bg-slate-700">
                                                {lecturer.education_history.map((edu, idx) => (
                                                    <div key={idx} className="relative pl-4 flex flex-col">
                                                        {/* Dot indicator */}
                                                        <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-sea-400 dark:border-sea-500 z-10"></div>
                                                        <span className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
                                                            {edu}
                                                        </span>
                                                        {/* Optional: Parsing logic could be added here if formatted string provided */}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Email */}
                                    <div className="mt-auto mb-6 space-y-2">
                                        <a
                                            href={`mailto:${lecturer.email}`}
                                            className="flex items-center w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-sea-300 transition group/email"
                                        >
                                            <div className="p-2 bg-white dark:bg-slate-700 rounded-lg text-slate-400 group-hover/email:text-sea-500 transition-colors mr-3 shadow-sm">
                                                <Mail size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-slate-400">{t.academic.lecturers.email_primary}</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate group-hover/email:text-sea-600 transition-colors">
                                                    {lecturer.email}
                                                </p>
                                            </div>
                                        </a>

                                        {lecturer.email_secondary && (
                                            <a
                                                href={`mailto:${lecturer.email_secondary}`}
                                                className="flex items-center w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-sea-300 transition group/email-sec"
                                            >
                                                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg text-slate-400 group-hover/email-sec:text-amber-500 transition-colors mr-3 shadow-sm">
                                                    <Mail size={16} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-slate-400">{t.academic.lecturers.email_alt}</p>
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate group-hover/email-sec:text-amber-600 transition-colors">
                                                        {lecturer.email_secondary}
                                                    </p>
                                                </div>
                                            </a>
                                        )}
                                    </div>

                                    {/* Social & Academic Links (Organized Groups) */}
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">

                                        {/* Academic Group */}
                                        {(lecturer.social_links?.sinta || lecturer.social_links?.scopus || lecturer.social_links?.google_scholar) && (
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Academic</p>
                                                <div className="flex gap-2">
                                                    {lecturer.social_links?.sinta && (
                                                        <a href={lecturer.social_links.sinta} target="_blank" rel="noreferrer" title="SINTA"
                                                            className="w-9 h-9 flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:border-yellow-400 bg-white dark:bg-slate-800 rounded-lg transition-all transform hover:-translate-y-0.5 group/sinta hover:shadow-md">
                                                            <img src="/images/sinta-logo.png" alt="SINTA" className="w-5 h-5 object-contain opacity-70 group-hover/sinta:opacity-100 transition-opacity" />
                                                        </a>
                                                    )}
                                                    {lecturer.social_links?.scopus && (
                                                        <a href={lecturer.social_links.scopus} target="_blank" rel="noreferrer" title="Scopus"
                                                            className="w-9 h-9 flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:border-orange-400 bg-white dark:bg-slate-800 rounded-lg transition-all transform hover:-translate-y-0.5 group/scopus hover:shadow-md">
                                                            <img src="/images/scopus-logo.png" alt="Scopus" className="w-5 h-5 object-contain opacity-70 group-hover/scopus:opacity-100 transition-opacity" />
                                                        </a>
                                                    )}
                                                    {lecturer.social_links?.google_scholar && (
                                                        <a href={lecturer.social_links.google_scholar} target="_blank" rel="noreferrer" title="Google Scholar"
                                                            className="w-9 h-9 flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-slate-800 rounded-lg transition-all transform hover:-translate-y-0.5 group/scholar hover:shadow-md">
                                                            <img src="/images/google-scholar-logo.png" alt="Google Scholar" className="w-5 h-5 object-contain opacity-70 group-hover/scholar:opacity-100 transition-opacity" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Social Media Group */}
                                        {(lecturer.social_links?.linkedin || lecturer.social_links?.facebook || lecturer.social_links?.instagram || lecturer.social_links?.twitter || lecturer.social_links?.tiktok || (lecturer.social_links?.others && lecturer.social_links.others.length > 0)) && (
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Social Media</p>
                                                <div className="flex gap-2 flex-wrap">
                                                    {lecturer.social_links?.linkedin && (
                                                        <a href={lecturer.social_links.linkedin} target="_blank" rel="noreferrer" title="LinkedIn"
                                                            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-[#0077b5] border border-slate-200 dark:border-slate-700 hover:border-[#0077b5] bg-white dark:bg-slate-800 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-md">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4">
                                                                <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {lecturer.social_links?.facebook && (
                                                        <a href={lecturer.social_links.facebook} target="_blank" rel="noreferrer" title="Facebook"
                                                            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-[#1877F2] border border-slate-200 dark:border-slate-700 hover:border-[#1877F2] bg-white dark:bg-slate-800 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-md">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4">
                                                                <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {lecturer.social_links?.instagram && (
                                                        <a href={lecturer.social_links.instagram} target="_blank" rel="noreferrer" title="Instagram"
                                                            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-[#E4405F] border border-slate-200 dark:border-slate-700 hover:border-[#E4405F] bg-white dark:bg-slate-800 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-md">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4">
                                                                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1 9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {lecturer.social_links?.twitter && (
                                                        <a href={lecturer.social_links.twitter} target="_blank" rel="noreferrer" title="X (Twitter)"
                                                            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-black dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-800 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-md">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4">
                                                                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {lecturer.social_links?.tiktok && (
                                                        <a href={lecturer.social_links.tiktok} target="_blank" rel="noreferrer" title="TikTok"
                                                            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-black dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-800 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-md">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4">
                                                                <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {lecturer.social_links?.others?.map((link, i) => (
                                                        <a key={i} href={link.url} target="_blank" rel="noreferrer" title={link.label}
                                                            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-sea-600 border border-slate-200 dark:border-slate-700 hover:border-sea-400 bg-white dark:bg-slate-800 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-md">
                                                            <Globe size={16} />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-4">
                            <User size={48} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t.academic.lecturers.not_found}</h3>
                        <p className="text-slate-500 dark:text-slate-400 whitespace-pre-line">
                            {t.academic.lecturers.not_found_desc.replace('{term}', searchTerm)}
                        </p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-6 px-6 py-2 bg-sea-600 text-white rounded-full hover:bg-sea-700 transition"
                        >
                            {t.academic.lecturers.reset}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lecturers;
