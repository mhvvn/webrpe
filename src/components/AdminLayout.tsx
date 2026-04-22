import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, Menu, Zap, Book, GraduationCap, Building, Users, ChevronLeft, ChevronRight, BarChart2, Globe, Mail } from 'lucide-react';
import { useUsers } from '../context/UserContext';
import { useMessages } from '../context/MessageContext';
import { Role } from '../types';

const { Link, useLocation, useNavigate } = ReactRouterDOM;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile toggle
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse
  const [isLoggingOut, setIsLoggingOut] = useState(false); // State to track voluntary logout
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useUsers();
  const { unreadCount } = useMessages();

  useEffect(() => {
    // Redirect to login if no user is authenticated AND we are not in the process of logging out
    if (!currentUser && !isLoggingOut) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate, isLoggingOut]);

  // Set Document Title for Admin
  useEffect(() => {
    document.title = "Admin | RPE";
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true); // Set flag to prevent useEffect from redirecting to /admin/login
    logout();
    navigate('/'); // Redirect to Main Website Home
  };

  if (!currentUser && !isLoggingOut) return null;

  // Define menu items availability by Role
  const allNavItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      allowedRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.LECTURER, Role.LABORAN, Role.STUDENT]
    },
    {
      name: 'Pesan Masuk',
      path: '/admin/inbox',
      icon: Mail,
      allowedRoles: [Role.SUPER_ADMIN, Role.ADMIN]
    },
    {
      name: 'Manajemen Statistik',
      path: '/admin/stats',
      icon: BarChart2,
      allowedRoles: [Role.SUPER_ADMIN, Role.ADMIN]
    },
    {
      name: 'Manajemen Berita',
      path: '/admin/articles',
      icon: FileText,
      allowedRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.LECTURER, Role.LABORAN, Role.STUDENT]
    },
    {
      name: 'Manajemen Kurikulum',
      path: '/admin/curriculum',
      icon: Book,
      allowedRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.LECTURER]
    },
    {
      name: 'Manajemen Dosen',
      path: '/admin/lecturers',
      icon: GraduationCap,
      allowedRoles: [Role.SUPER_ADMIN, Role.ADMIN]
    },
    {
      name: 'Manajemen Fasilitas',
      path: '/admin/facilities',
      icon: Building,
      allowedRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.LECTURER, Role.LABORAN]
    },
    {
      name: 'Manajemen User',
      path: '/admin/users',
      icon: Users,
      allowedRoles: [Role.SUPER_ADMIN, Role.ADMIN]
    },
  ];

  // Safety check for currentUser to prevent crash during render if null
  if (!currentUser) return null;

  const visibleNavItems = allNavItems.filter(item => item.allowedRoles.includes(currentUser.role));

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 bg-sea-900 text-white transform transition-all duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
          } ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Toggle Button (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-8 bg-sea-800 text-white p-1 rounded-full border border-sea-700 hover:bg-sea-700 shadow-md z-50 items-center justify-center"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="h-full flex flex-col overflow-hidden">
          {/* Sidebar Header */}
          <div className={`h-16 flex items-center border-b border-sea-800 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
            <Zap className={`text-amber-400 ${isCollapsed ? 'h-8 w-8' : 'h-6 w-6 mr-2'}`} />
            {!isCollapsed && <span className="font-bold text-lg tracking-wide whitespace-nowrap">Admin Panel</span>}
          </div>

          {/* User Role Badge in Sidebar */}
          <div className={`py-4 bg-sea-800/50 transition-all duration-300 ${isCollapsed ? 'px-2 text-center' : 'px-6'}`}>
            {!isCollapsed && <p className="text-xs text-sea-300 mb-1 whitespace-nowrap">Login sebagai:</p>}
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-2 h-2 rounded-full bg-green-400 shrink-0"></div>
              {!isCollapsed && <span className="font-bold text-sm text-white uppercase ml-2 truncate">{currentUser.role.replace('_', ' ')}</span>}
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
            {visibleNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={isCollapsed ? item.name : ''}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center py-3 rounded-lg transition-colors relative ${isCollapsed ? 'justify-center px-2' : 'px-4'
                    } ${isActive
                      ? 'bg-sea-800 text-amber-400'
                      : 'text-sea-100 hover:bg-sea-800 hover:text-white'
                    }`}
                >
                  <item.icon size={20} className={`${isCollapsed ? '' : 'mr-3'} shrink-0`} />
                  {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>}

                  {item.path === '/admin/inbox' && unreadCount > 0 && (
                    isCollapsed ? (
                      <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-sea-900"></div>
                    ) : (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[1.25rem] text-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-sea-800 space-y-2">

            {/* Link to Main Site (Without Logout) */}
            <Link
              to="/"
              title={isCollapsed ? 'Ke Website Utama' : ''}
              className={`flex items-center w-full py-2 text-sm font-medium text-sea-300 hover:text-white hover:bg-sea-800 rounded-lg transition ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
            >
              <Globe size={20} className={`${isCollapsed ? '' : 'mr-3'} shrink-0`} />
              {!isCollapsed && <span>Ke Website</span>}
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title={isCollapsed ? 'Keluar' : ''}
              className={`flex items-center w-full py-2 text-sm font-bold text-red-300 hover:bg-sea-800 hover:text-red-200 rounded-lg transition ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
            >
              <LogOut size={20} className={`${isCollapsed ? '' : 'mr-3'} shrink-0`} />
              {!isCollapsed && <span>Keluar</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-slate-600 rounded-md hover:bg-slate-100"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center ml-auto space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700">{currentUser.name}</p>
              <p className="text-xs text-slate-500">@{currentUser.username}</p>
            </div>
            <div className="h-9 w-9 bg-sea-100 rounded-full flex items-center justify-center overflow-hidden border border-sea-200">
              {currentUser.avatar_url ? (
                <img src={currentUser.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sea-700 font-bold">{currentUser.name.charAt(0)}</span>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;