import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Menu, X, Zap, Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, ChevronDown, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const { Link, useLocation } = ReactRouterDOM;

interface LayoutProps {
  children: React.ReactNode;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const isHome = location.pathname === '/';

  // Pages that should have the dark header style
  const isDarkPage =
    (isHome && scrolled) ||
    location.pathname === '/about' ||
    location.pathname.startsWith('/academic') ||
    location.pathname.startsWith('/news') ||
    location.pathname === '/facilities' ||
    location.pathname === '/contact';

  // Navbar is transparent ONLY if we are on Home page AND haven't scrolled yet.
  // Otherwise (other pages OR scrolled), it is solid.
  const isTransparent = isHome && !scrolled;

  // Use light mode header styles (dark text on white/light bg) only if transparent is false AND we are not on the specific dark pages
  const isLightModeHeader = !isTransparent && !isDarkPage;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Navigation Data Structure
  const navItems = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.about, path: '/about' },
    {
      name: t.nav.academic,
      path: '/academic/curriculum', // Default fallback
      type: 'dropdown',
      subItems: [
        { name: t.nav.curriculum, path: '/academic/curriculum' },
        { name: t.nav.lecturers, path: '/academic/lecturers' }
      ]
    },
    { name: t.nav.facilities, path: '/facilities' },
    { name: t.nav.news, path: '/news' },
    {
      name: t.nav.tracer,
      path: '/tracer/mahasiswa', // Default fallback
      type: 'dropdown',
      subItems: [
        { name: t.nav.tracer_student, path: '/tracer/mahasiswa' },
        { name: t.nav.tracer_alumni, path: '/tracer/alumni' },
        { name: t.nav.tracer_career, path: '/tracer/karir' }
      ]
    },
    { name: t.nav.contact, path: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${!isTransparent ? (isDarkPage ? 'bg-sea-950' : 'bg-white') + ' dark:bg-slate-900 shadow-lg py-2' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`p-2 rounded-lg transition-all duration-300 ${isLightModeHeader ? 'bg-sea-50 dark:bg-slate-800' : 'bg-white/10 backdrop-blur-md'}`}>
              <Zap className={`h-6 w-6 transition-colors ${isLightModeHeader ? 'text-sea-600 dark:text-sea-400' : 'text-amber-400'}`} />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-lg leading-tight ${isLightModeHeader ? 'text-sea-900 dark:text-white' : 'text-white'}`}>
                RPE
              </span>
              <span className={`text-xs ${isLightModeHeader ? 'text-sea-600 dark:text-sea-300' : 'text-sea-200'}`}>
                Teknologi Rekayasa Pembangkit Energi
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navItems.map((item) => {
              if (item.type === 'dropdown') {
                const isActive = item.subItems?.some(sub => location.pathname.startsWith(sub.path));
                return (
                  <div key={item.name} className="relative group">
                    <button
                      className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-amber-400 ${isActive
                        ? 'text-amber-500 font-bold'
                        : isLightModeHeader ? 'text-slate-600 dark:text-slate-300' : 'text-slate-100 hover:text-white hover:scale-105'
                        }`}
                    >
                      {item.name}
                      <ChevronDown size={14} className="ml-1 mt-0.5" />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute left-0 mt-0 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left">
                      <div className="py-1">
                        {item.subItems?.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            className={`block px-4 py-2 text-sm ${location.pathname === sub.path
                              ? 'bg-sea-50 dark:bg-slate-700 text-sea-600 dark:text-sea-300 font-medium'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-sea-600'
                              }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-amber-400 ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                    ? 'text-amber-500 font-bold'
                    : isLightModeHeader ? 'text-slate-600 dark:text-slate-300' : 'text-slate-100 hover:text-white hover:scale-105'
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ml-2 font-mono text-xs font-bold ${isLightModeHeader
                ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              aria-label="Toggle Language"
            >
              <Globe size={14} />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ml-1 ${isLightModeHeader
                ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Toggle Mobile */}
            <button
              onClick={toggleLanguage}
              className={`px-2 py-1 rounded flex items-center space-x-1 font-mono text-xs font-bold ${isLightModeHeader
                ? 'text-slate-600 dark:text-slate-300'
                : 'text-white'
                }`}
            >
              <Globe size={14} />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${isLightModeHeader
                ? 'text-slate-600 dark:text-slate-300'
                : 'text-white'
                }`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${isLightModeHeader ? 'text-slate-700 dark:text-white' : 'text-white'}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-xl absolute w-full max-h-[80vh] overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              if (item.type === 'dropdown') {
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="px-3 py-2 text-base font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-md">
                      {item.name}
                    </div>
                    <div className="pl-6 space-y-1 border-l-2 border-slate-100 dark:border-slate-700 ml-3">
                      {item.subItems?.map(sub => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className={`block px-3 py-2 rounded-md text-sm font-medium ${location.pathname === sub.path
                            ? 'text-sea-600 dark:text-sea-400'
                            : 'text-slate-500 dark:text-slate-400 hover:text-sea-600 dark:hover:text-sea-400'
                            }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path
                    ? 'bg-sea-50 dark:bg-slate-800 text-sea-700 dark:text-sea-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-sea-600'
                    }`}
                >
                  {item.name}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
              <Link
                to="/admin/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800"
              >
                {t.nav.admin}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};


const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-sea-950 dark:bg-black text-white pt-16 pb-8 border-t border-sea-900 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-sea-800 dark:bg-slate-800 rounded-lg">
                <Zap className="h-6 w-6 text-amber-500" />
              </div>
              <span className="font-bold text-xl">RPE Polibatam</span>
            </div>
            <p className="text-sea-200 dark:text-slate-400 text-sm leading-relaxed">
              {t.footer.desc}
            </p>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold text-lg mb-4 text-white">{t.footer.quick_links}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sea-200 dark:text-slate-400 text-sm">
                <li><a href="https://jurnal.polibatam.ac.id/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">Jurnal</a></li>
                <li><a href="https://beasiswa.polibatam.ac.id/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">Beasiswa</a></li>
                <li><a href="https://helpdesk.polibatam.ac.id/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">Helpdesk</a></li>
                <li><a href="https://p2m.polibatam.ac.id/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">Penelitian</a></li>
                <li><a href="https://sim.polibatam.ac.id/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">Sistem Informasi Akademik</a></li>
              </ul>
              <ul className="space-y-2 text-sea-200 dark:text-slate-400 text-sm">
                <li><a href="https://learning.polibatam.ac.id/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">E-Learning</a></li>
                <li><a href="https://repository.polibatam.ac.id/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">Repository</a></li>
                <li><a href="https://lib.polibatam.ac.id/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">Perpustakaan</a></li>
                <li><a href="https://www.iapolbat.org/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">Ikatan Alumni Polibatam</a></li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">{t.footer.contact}</h3>
            <ul className="space-y-3 text-sea-200 dark:text-slate-400 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="mt-0.5 text-amber-500 shrink-0" />
                <span>Jl. Ahmad Yani, Batam Kota, Kota Batam, Kepulauan Riau 29461</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-amber-500 shrink-0" />
                <span>+62 778 469856</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-amber-500 shrink-0" />
                <span>info.rpe@polibatam.ac.id</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">{t.footer.follow}</h3>
            <div className="flex flex-wrap gap-3 mt-4">
              <a href="#" className="p-2.5 bg-sea-900 dark:bg-slate-800 rounded-full hover:bg-amber-500 hover:text-white transition-all text-sea-200">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2.5 bg-sea-900 dark:bg-slate-800 rounded-full hover:bg-amber-500 hover:text-white transition-all text-sea-200">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2.5 bg-sea-900 dark:bg-slate-800 rounded-full hover:bg-amber-500 hover:text-white transition-all text-sea-200">
                <Youtube size={18} />
              </a>
              <a href="#" className="p-2.5 bg-sea-900 dark:bg-slate-800 rounded-full hover:bg-amber-500 hover:text-white transition-all text-sea-200">
                <TikTokIcon size={18} />
              </a>
              <a href="#" className="p-2.5 bg-sea-900 dark:bg-slate-800 rounded-full hover:bg-amber-500 hover:text-white transition-all text-sea-200">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2.5 bg-sea-900 dark:bg-slate-800 rounded-full hover:bg-amber-500 hover:text-white transition-all text-sea-200">
                <XIcon size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-sea-900 dark:border-slate-800 text-center text-sea-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Teknologi Rekayasa Pembangkit Energi. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className={`flex-grow ${isHome ? 'pt-0' : 'pt-16'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;