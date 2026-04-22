
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Calendar, User, ArrowRight, Rss } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import PageHeader from '../components/PageHeader';
import Skeleton from '../components/Skeleton';

const { Link } = ReactRouterDOM;

const NewsList: React.FC = () => {
  const { news, loading } = useNews();

  // Skeleton Loader Component
  const NewsSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full animate-pulse">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-6 flex-1 flex flex-col space-y-4">
        <div className="flex space-x-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-20 w-full" />
        <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800">
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      {/* Header */}
      <PageHeader
        title="Berita & Kegiatan"
        description="Informasi terkini mengenai prestasi mahasiswa, agenda akademik, dan perkembangan teknologi di lingkungan RPE."
      />

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <NewsSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.length > 0 ? (
              news.map((item) => (
                <article key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                  {/* Image */}
                  <div className="h-56 overflow-hidden relative group">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${item.category === 'Academic' ? 'bg-blue-500/90 text-white' :
                        item.category === 'Event' ? 'bg-amber-500/90 text-white' :
                          item.category === 'Student' ? 'bg-green-500/90 text-white' :
                            'bg-sea-600/90 text-white'
                        }`}>
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3 space-x-3">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>{item.published_at}</span>
                      </div>
                      <div className="flex items-center">
                        <User size={14} className="mr-1" />
                        <span>{item.author_name}</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3 line-clamp-2 hover:text-sea-600 dark:hover:text-sea-400 transition-colors">
                      <Link to={`/news/${item.id}`}>
                        {item.title}
                      </Link>
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 flex-1">
                      {item.summary}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Link
                        to={`/news/${item.id}`}
                        className="inline-flex items-center text-sm font-semibold text-sea-600 dark:text-sea-400 hover:text-sea-700 dark:hover:text-sea-300 transition"
                      >
                        Baca Selengkapnya <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full py-24 flex flex-col items-center justify-center text-center animate-fade-in-up">
                <div className="relative mb-8 group cursor-pointer">
                  <div className="absolute inset-0 bg-amber-100 dark:bg-slate-800 rounded-full animate-ping opacity-50 duration-1000"></div>
                  <div className="relative flex items-center justify-center w-32 h-32 bg-white dark:bg-slate-900 rounded-full border-4 border-sea-50 dark:border-slate-800 shadow-xl text-amber-500 z-10 transition-transform duration-500 group-hover:scale-110">
                    <Rss size={56} className="text-amber-500" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-3">Berita Sedang Disiapkan</h3>
                <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
                  Belum ada publikasi atau pengumuman terbaru saat ini. Pantau terus halaman ini untuk mendapatkan informasi akademik terkini!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsList;