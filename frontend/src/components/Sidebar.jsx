import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  LogOut,
  GraduationCap,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/admin/dashboard',
    exact: true,
  },
  {
    label: 'All Inquiries',
    icon: ClipboardList,
    // Scrolls to the inquiries table on the same dashboard page
    to: '/admin/dashboard#inquiries',
    exact: false,
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const handleNavClick = (to) => {
    // If there's an anchor, scroll after navigation
    if (to.includes('#')) {
      const [, hash] = to.split('#');
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    onClose?.();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#172554] text-white">
      {/* ── Header / Logo ── */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[#1e3a8a]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-[#172554]" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-sm">EduConnect</span>
              <span className="bg-[#2563EB] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                CRM
              </span>
            </div>
            <span className="text-[#93C5FD] text-[10px] font-medium">Admin Panel</span>
          </div>
        </div>
        {/* Close button (mobile only) */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md hover:bg-[#1e3a8a] transition-colors text-[#93C5FD] hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-[#6B8FD6] uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => {
          // For the anchor link we match the base path
          const basePath = to.split('#')[0];
          return (
            <NavLink
              key={label}
              to={basePath}
              onClick={() => handleNavClick(to)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-[#BFDBFE] hover:bg-[#1e3a8a] hover:text-white'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: '1.125rem', height: '1.125rem' }} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* ── Admin Profile + Logout ── */}
      <div className="px-3 pb-5 space-y-1 border-t border-[#1e3a8a] pt-4">
        {/* Profile row */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1e3a8a]">
          <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-semibold truncate">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-[#93C5FD] text-[10px] truncate">{user?.email || 'admin@school.edu'}</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#FCA5A5] hover:bg-red-900/30 hover:text-red-300 transition-all duration-150"
        >
          <LogOut className="flex-shrink-0" style={{ width: '1.125rem', height: '1.125rem' }} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar (fixed) ── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 z-40 shadow-xl">
        {sidebarContent}
      </aside>

      {/* ── Mobile Overlay Sidebar ── */}
      <>
        {/* Backdrop */}
        <div
          className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
          aria-hidden="true"
        />
        {/* Slide-in panel */}
        <aside
          className={`md:hidden fixed left-0 top-0 h-screen w-64 z-50 shadow-2xl transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </aside>
      </>
    </>
  );
}
