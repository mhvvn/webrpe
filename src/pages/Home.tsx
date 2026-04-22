import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Users, Trophy, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

const { Link } = ReactRouterDOM;

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=2070",
    alt: "Sustainable Energy"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=2070",
    alt: "Solar Panels"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2070",
    alt: "Laboratory"
  }
];

const AnimatedStat: React.FC<{ value: string }> = ({ value }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = React.useRef<HTMLHeadingElement>(null);

  const numMatch = value.match(/\d+/);
  const targetNumber = numMatch ? parseInt(numMatch[0], 10) : 0;
  // Memecah teks sebelum angka dan setelah angka (misalnya 'Rp1000+' -> prefix 'Rp', suffix '+')
  const prefix = numMatch && value.indexOf(numMatch[0]) > 0 ? value.substring(0, value.indexOf(numMatch[0])) : '';
  const suffix = numMatch ? value.substring(value.indexOf(numMatch[0]) + numMatch[0].length) : value;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (hasAnimated && targetNumber > 0) {
      let start = 0;
      const duration = 2000;
      const increment = targetNumber / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= targetNumber) {
          setCount(targetNumber);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);
      return () => clearInterval(timer);
    } else if (hasAnimated) {
      setCount(targetNumber);
    }
  }, [hasAnimated, targetNumber]);

  return (
    <h3 ref={elementRef} className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
      {targetNumber > 0 ? `${prefix}${count}${suffix}` : (hasAnimated ? value : '0')}
    </h3>
  );
};

const Home: React.FC = () => {
  const { news } = useNews();
  const { t } = useLanguage();
  const { stats } = useContent();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get top 3 news items
  const recentNews = news.slice(0, 3);

  // Auto-advance slides
  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  // Set Document Title
  useEffect(() => {
    document.title = "RPE | Teknologi Rekayasa Pembangkit Energi";
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div className="space-y-0">
      {/* Hero Section with Slideshow */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-sea-900 group">
        {/* Background Slides */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-sea-950/90 via-sea-900/60 to-sea-900/30" />
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition opacity-0 group-hover:opacity-100 hidden sm:block"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition opacity-0 group-hover:opacity-100 hidden sm:block"
        >
          <ChevronRight size={32} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-amber-400 w-8' : 'bg-white/50 hover:bg-white'
                }`}
            />
          ))}
        </div>

        {/* Static Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left w-full">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-sm font-semibold mb-6 backdrop-blur-sm">
              {t.hero.tag}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
              {t.hero.title_prefix} <span className="text-amber-400">{t.hero.title_suffix}</span>
            </h1>
            <p className="text-lg sm:text-xl text-sea-100 mb-8 leading-relaxed max-w-2xl drop-shadow-md">
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <Link to="/about" className="px-8 py-3.5 bg-sea-600 hover:bg-sea-500 text-white font-semibold rounded-lg shadow-lg shadow-sea-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center">
                {t.hero.btn_about} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="https://registrasi.polibatam.ac.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold rounded-lg transition-all flex items-center justify-center"
              >
                {t.hero.btn_register}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Highlights - Updated to Full Width */}
      <section className="py-16 bg-white dark:bg-slate-900 relative z-20 shadow-xl border-y border-slate-100 dark:border-slate-800 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
            {[
              { icon: Users, label: t.stats.students, value: stats.students },
              { icon: BookOpen, label: t.stats.courses, value: stats.courses },
              { icon: Trophy, label: t.stats.awards, value: stats.awards },
              { icon: Activity, label: t.stats.employment, value: stats.employment },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4">
                <div className="p-3 bg-sea-50 dark:bg-slate-800 text-sea-600 dark:text-sea-400 rounded-full mb-4">
                  <stat.icon size={28} />
                </div>
                <AnimatedStat value={stat.value} />
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t.sections.news_title}</h2>
              <p className="text-slate-600 dark:text-slate-400">{t.sections.news_subtitle}</p>
            </div>
            <Link to="/news" className="hidden sm:flex items-center text-sea-600 dark:text-sea-400 font-semibold hover:text-sea-700 dark:hover:text-sea-300 transition">
              {t.sections.view_all} <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentNews.map((news) => (
              <div key={news.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition group">
                <div className="h-48 overflow-hidden relative">
                  <img src={news.image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-sea-700 dark:text-sea-400">
                    {news.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs text-slate-400 mb-2 flex items-center space-x-2">
                    <span>{news.published_at}</span>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                    <span>{news.author_name}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-sea-600 dark:group-hover:text-sea-400 transition">
                    <Link to={`/news/${news.id}`}>{news.title}</Link>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">
                    {news.summary}
                  </p>
                  <Link to={`/news/${news.id}`} className="text-sm font-semibold text-sea-600 dark:text-sea-400 hover:underline">{t.sections.read_more}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-sea-900 dark:bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t.sections.cta_title}</h2>
          <p className="text-sea-200 dark:text-slate-400 text-lg mb-8">
            {t.sections.cta_desc}
          </p>
          <a
            href="https://registrasi.polibatam.ac.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-amber-500 hover:bg-amber-400 text-sea-950 font-bold rounded-lg transition shadow-lg transform hover:-translate-y-1"
          >
            {t.sections.cta_btn}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;