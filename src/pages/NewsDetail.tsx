import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Tag, FileText, Download, ExternalLink, Image as ImageIcon, Film, FileSpreadsheet, FileType, Search, ChevronRight } from 'lucide-react';
import { useNews } from '../context/NewsContext';

const { useParams, Link } = ReactRouterDOM;

const NewsDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = ReactRouterDOM.useNavigate();
    const { news } = useNews();
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const article = news.find((item) => item.id === id);

    // Recent news (exclude current, take top 5)
    const recentNews = news
        .filter(item => item.id !== id)
        .slice(0, 5);

    // Unique categories
    const categories = Array.from(new Set(news.map(item => item.category))).filter(Boolean);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/news?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    if (!article) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Artikel Tidak Ditemukan</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
                <Link to="/news" className="px-6 py-2 bg-sea-600 text-white rounded-lg hover:bg-sea-700 transition">
                    Kembali ke Berita
                </Link>
            </div>
        );
    }

    const getFileIcon = (mimeType: string) => {
        if (mimeType.includes('pdf')) return <FileText className="text-red-500" />;
        if (mimeType.includes('sheet') || mimeType.includes('csv') || mimeType.includes('excel')) return <FileSpreadsheet className="text-green-500" />;
        if (mimeType.includes('word') || mimeType.includes('document')) return <FileType className="text-blue-500" />;
        if (mimeType.startsWith('video/')) return <Film className="text-purple-500" />;
        if (mimeType.startsWith('image/')) return <ImageIcon className="text-amber-500" />;
        return <FileText className="text-slate-500" />;
    };

    const videos = article.attachments?.filter(a => a.type === 'video') || [];
    const documents = article.attachments?.filter(a => a.type === 'document') || [];

    // Merge gallery URLs and uploaded images
    const allImages = [
        ...(article.gallery_urls || []),
        ...(article.attachments?.filter(a => a.type === 'image').map(a => a.url) || [])
    ];

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen pb-20 pt-24">
            {/* Lightbox Overlay */}
            {activeImage && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setActiveImage(null)}>
                    <button className="absolute top-4 right-4 text-white hover:text-sea-400">
                        <span className="text-4xl">&times;</span>
                    </button>
                    <img src={activeImage} alt="Fullscreen" className="max-w-full max-h-[90vh] rounded shadow-2xl" />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* NEW HERO SECTION */}
                <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-xl mb-12 group">
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-black/20"></div>

                    <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end">
                        <Link
                            to="/news"
                            className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center text-white/90 hover:text-white transition group/link bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-black/40"
                        >
                            <ArrowLeft size={18} className="mr-2 group-hover/link:-translate-x-1 transition-transform" />
                            <span className="font-medium text-sm">Kembali ke Daftar Berita</span>
                        </Link>

                        <div className="max-w-4xl relative z-10">
                            <span className="inline-block px-4 py-1.5 bg-amber-500 text-sea-900 text-xs font-bold uppercase tracking-wider rounded-md mb-6 shadow-lg">
                                {article.category}
                            </span>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight shadow-black/10 drop-shadow-md">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-medium">
                                <div className="flex items-center">
                                    <User size={18} className="mr-2 text-amber-400" />
                                    <span>{article.author_name}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-6"></div>
                                    <Calendar size={18} className="mr-2 text-amber-400" />
                                    <span>{article.published_at}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content & Sidebar Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* LEFT COLUMN: Main Content */}
                    <div className="lg:col-span-2">

                        {/* Article Body */}
                        <div className="prose prose-lg prose-slate max-w-none text-gray-700 dark:text-gray-300">
                            {/* Summary */}
                            {article.summary && (
                                <p className="font-bold text-xl leading-relaxed text-gray-800 dark:text-gray-100 mb-6 border-l-4 border-amber-500 pl-4">
                                    {article.summary}
                                </p>
                            )}

                            {/* Paragraphs */}
                            {article.content.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-6 leading-8 text-justify">
                                    {paragraph || "..."}
                                </p>
                            ))}
                        </div>

                        {/* Associated Content (Videos, Galleries, etc) */}
                        {/* Video Section */}
                        {videos.length > 0 && (
                            <div className="mt-10 mb-10">
                                <h3 className="flex items-center text-xl font-bold text-gray-800 dark:text-white mb-6 border-l-4 border-sea-600 pl-4">
                                    Video Dokumentasi
                                </h3>
                                <div className="space-y-6">
                                    {videos.map((vid) => (
                                        <div key={vid.id} className="w-full rounded-xl overflow-hidden shadow-lg bg-black">
                                            <video controls className="w-full">
                                                <source src={vid.url} type={vid.mimeType} />
                                            </video>
                                            <div className="p-3 bg-white dark:bg-slate-800">
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{vid.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery Section */}
                        {allImages.length > 0 && (
                            <div className="mt-12">
                                <h3 className="flex items-center text-xl font-bold text-gray-800 dark:text-white mb-6 border-l-4 border-sea-600 pl-4">
                                    Galeri Foto
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {allImages.map((url, idx) => (
                                        <div
                                            key={idx}
                                            className="relative group cursor-pointer overflow-hidden rounded-lg h-40 shadow-sm"
                                            onClick={() => setActiveImage(url)}
                                        >
                                            <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                                                <ImageIcon className="text-white opacity-0 group-hover:opacity-100" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Documents / Attachments */}
                        {(article.pdf_url || documents.length > 0) && (
                            <div className="mt-12 p-6 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                <h3 className="flex items-center text-lg font-bold text-gray-800 dark:text-white mb-4">
                                    <FileText className="mr-2 text-sea-600" /> Dokumen Lampiran
                                </h3>
                                <div className="space-y-3">
                                    {article.pdf_url && (
                                        <a href={article.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-sea-400 transition group">
                                            <div className="flex items-center">
                                                <FileText className="text-red-500 mr-3" size={20} />
                                                <span className="font-medium text-gray-700 dark:text-gray-200">{article.pdf_name || "Lampiran Utama.pdf"}</span>
                                            </div>
                                            <Download size={18} className="text-gray-400 group-hover:text-sea-600" />
                                        </a>
                                    )}
                                    {documents.map((doc) => (
                                        <a href={doc.url} download={doc.name} key={doc.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-sea-400 transition group">
                                            <div className="flex items-center">
                                                <div className="mr-3">{getFileIcon(doc.mimeType)}</div>
                                                <div>
                                                    <p className="font-medium text-gray-700 dark:text-gray-200 text-sm">{doc.name}</p>
                                                    <p className="text-xs text-gray-500">{(doc.size ? (doc.size / 1024).toFixed(0) + ' KB' : 'File')}</p>
                                                </div>
                                            </div>
                                            <Download size={18} className="text-gray-400 group-hover:text-sea-600" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Share */}
                        <div className="mt-12 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
                            <div className="flex items-center space-x-2">
                                <Tag size={16} className="text-gray-400" />
                                <div className="flex gap-2">
                                    <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium">Polibatam</span>
                                    <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium">RPE</span>
                                    <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium">{article.category}</span>
                                </div>
                            </div>
                            <button className="flex items-center text-gray-500 hover:text-sea-600 transition font-medium text-sm">
                                <Share2 size={16} className="mr-2" /> Bagikan
                            </button>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sidebar (Search & Recent) */}
                    <div className="lg:col-span-1 space-y-10 pl-0 lg:pl-6">

                        {/* Search Box */}
                        <div role="search">
                            <h3 className="text-lg font-bold text-sea-900 dark:text-sea-400 mb-5 uppercase tracking-wide border-b-2 border-sea-900 pb-2 inline-block">
                                Pencarian
                            </h3>
                            <form onSubmit={handleSearch} className="relative group">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Pencarian berita..."
                                    className="w-full bg-sea-50 dark:bg-slate-800 border-none rounded-lg py-4 px-5 pr-12 focus:ring-2 focus:ring-sea-500 focus:outline-none transition shadow-inner"
                                />
                                <button type="submit" className="absolute right-2 top-2 bottom-2 bg-sea-600 hover:bg-sea-700 text-white w-10 rounded-md flex items-center justify-center transition">
                                    <Search size={18} />
                                </button>
                            </form>
                        </div>

                        {/* Recent News */}
                        <div>
                            <h3 className="text-lg font-bold text-sea-900 dark:text-sea-400 mb-6 uppercase tracking-wide border-b-2 border-sea-900 pb-2 inline-block">
                                Berita Terbaru
                            </h3>
                            <div className="space-y-6">
                                {recentNews.map(item => (
                                    <Link to={`/news/${item.id}`} key={item.id} className="flex gap-4 group">
                                        <div className="w-24 h-20 shrink-0 overflow-hidden rounded-lg shadow-sm">
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-between py-0.5">
                                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-snug group-hover:text-sea-600 transition line-clamp-2">
                                                {item.title}
                                            </h4>
                                            <span className="text-xs text-gray-500">{item.published_at}</span>
                                        </div>
                                    </Link>
                                ))}
                                {recentNews.length === 0 && <p className="text-gray-500 text-sm">Tidak ada berita terbaru.</p>}
                            </div>
                        </div>

                        {/* News by Category */}
                        {categories.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-sea-900 dark:text-sea-400 mb-8 uppercase tracking-wide border-b-2 border-sea-900 pb-2 inline-block">
                                    Kategori
                                </h3>
                                <div className="space-y-8">
                                    {categories.map((cat) => {
                                        const catNews = news.filter(n => n.category === cat && n.id !== id).slice(0, 3);
                                        if (catNews.length === 0) return null;
                                        return (
                                            <div key={cat}>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-sea-800 dark:text-sea-400 uppercase text-sm border-l-4 border-sea-500 pl-3">
                                                        {cat}
                                                    </h4>
                                                    <Link to={`/news?category=${cat}`} className="text-xs text-sea-600 hover:underline">Lihat Semua</Link>
                                                </div>
                                                <div className="space-y-4">
                                                    {catNews.map(item => (
                                                        <Link to={`/news/${item.id}`} key={item.id} className="flex gap-3 group">
                                                            <div className="w-16 h-12 shrink-0 overflow-hidden rounded-md shadow-sm">
                                                                <img
                                                                    src={item.image_url}
                                                                    alt={item.title}
                                                                    className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                                                                />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-medium text-gray-700 dark:text-gray-300 text-xs leading-snug group-hover:text-sea-600 transition line-clamp-2">
                                                                    {item.title}
                                                                </h5>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
};

export default NewsDetail;