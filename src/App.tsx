import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Curriculum from './pages/Curriculum';
import Lecturers from './pages/Lecturers';
import Facilities from './pages/Facilities';
import Contact from './pages/Contact';
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';
import ComingSoon from './pages/ComingSoon';
import NotFound from './pages/NotFound';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ArticleManager from './pages/admin/ArticleManager';
import CurriculumManager from './pages/admin/CurriculumManager';
import LecturerManager from './pages/admin/LecturerManager';
import FacilityManager from './pages/admin/FacilityManager';
import UserManager from './pages/admin/UserManager';
import StatsManager from './pages/admin/StatsManager';
import InboxManager from './pages/admin/InboxManager';

import { NewsProvider } from './context/NewsContext';
import { AcademicProvider } from './context/AcademicContext';
import { FacilityProvider } from './context/FacilityContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { UserProvider } from './context/UserContext';
import { MessageProvider } from './context/MessageContext';
import { ContentProvider } from './context/ContentContext';

const { BrowserRouter: Router, Routes, Route, Outlet, Navigate } = ReactRouterDOM;

// Helper component to wrap public pages
const PublicLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <UserProvider>
          <MessageProvider>
            <NewsProvider>
              <AcademicProvider>
                <FacilityProvider>
                  <ContentProvider>
                    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                      <Routes>
                        {/* Public Routes - Wrapped in Main Layout */}
                        <Route element={<PublicLayout />}>
                          <Route path="/" element={<Home />} />
                          <Route path="/about" element={<About />} />

                          {/* Academic Routes - Split */}
                          <Route path="/academic" element={<Navigate to="/academic/curriculum" replace />} />
                          <Route path="/academic/curriculum" element={<Curriculum />} />
                          <Route path="/academic/lecturers" element={<Lecturers />} />

                          <Route path="/facilities" element={<Facilities />} />
                          <Route path="/news" element={<NewsList />} />
                          <Route path="/news/:id" element={<NewsDetail />} />

                          {/* Tracer Routes */}
                          <Route path="/tracer/mahasiswa" element={<ComingSoon pageName="Tracer Mahasiswa" />} />
                          <Route path="/tracer/alumni" element={<ComingSoon pageName="Tracer Alumni" />} />
                          <Route path="/tracer/karir" element={<ComingSoon pageName="Tracer Karir" />} />

                          <Route path="/contact" element={<Contact />} />

                          {/* Catch All / 404 - Public Routes */}
                          <Route path="*" element={<NotFound />} />
                        </Route>

                        {/* Admin Routes - Standalone or Wrapped in AdminLayout */}
                        <Route path="/admin/login" element={<Login />} />

                        <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
                          <Route index element={<Dashboard />} />
                          <Route path="inbox" element={<InboxManager />} />
                          <Route path="stats" element={<StatsManager />} />
                          <Route path="articles" element={<ArticleManager />} />
                          <Route path="curriculum" element={<CurriculumManager />} />
                          <Route path="lecturers" element={<LecturerManager />} />
                          <Route path="facilities" element={<FacilityManager />} />
                          <Route path="users" element={<UserManager />} />
                        </Route>
                      </Routes>
                    </Router>
                  </ContentProvider>
                </FacilityProvider>
              </AcademicProvider>
            </NewsProvider>
          </MessageProvider>
        </UserProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;