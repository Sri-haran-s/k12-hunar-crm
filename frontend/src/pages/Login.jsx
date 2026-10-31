import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, GraduationCap, BookOpen, Users, BarChart3, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: BookOpen, text: 'Centralised inquiry management' },
  { icon: Users,    text: 'Student & parent tracking' },
  { icon: BarChart3, text: 'Real-time analytics dashboard' },
];

export default function Login() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Invalid credentials. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Left Decorative Panel (desktop only) ── */}
        <div className="hidden md:flex md:w-5/12 bg-[#172554] flex-col justify-between p-10 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#2563EB] opacity-10 -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#2563EB] opacity-10 translate-y-1/3 -translate-x-1/3" />

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-[#172554]" />
              </div>
              <div className="leading-tight">
                <p className="text-white font-bold text-lg leading-none">EduConnect</p>
                <p className="text-[#93C5FD] text-xs font-medium">Administration Portal</p>
              </div>
            </div>

            <h2 className="text-white text-2xl font-bold mb-3 leading-snug">
              Manage student inquiries with confidence
            </h2>
            <p className="text-[#93C5FD] text-sm leading-relaxed">
              Your all-in-one CRM platform for K-12 student enrollment, inquiry tracking, and parent communications.
            </p>
          </div>

          {/* Feature bullets */}
          <div className="relative z-10 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] bg-opacity-40 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-[#DBEAFE] text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="relative z-10 text-[#6B8FD6] text-xs mt-6">
            © {new Date().getFullYear()} K12 Hunar. All rights reserved.
          </p>
        </div>

        {/* ── Right: Login Form ── */}
        <div className="flex-1 bg-white flex flex-col justify-center px-8 py-10 md:px-12">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-[#172554] rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-[#172554]">EduConnect CRM</p>
              <p className="text-[10px] text-slate-400 font-medium">Administration Portal</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1E293B]">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your admin account to continue</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 font-bold text-xs">!</span>
              </div>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1E293B] mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" style={{ width: '1.125rem', height: '1.125rem' }} />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@school.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-[#F8FAFC] text-[#1E293B] text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1E293B] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" style={{ width: '1.125rem', height: '1.125rem' }} />
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 bg-[#F8FAFC] text-[#1E293B] text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? (
                    <EyeOff style={{ width: '1.125rem', height: '1.125rem' }} />
                  ) : (
                    <Eye style={{ width: '1.125rem', height: '1.125rem' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#93C5FD] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Restriction note */}
          <p className="mt-6 text-xs text-slate-400 text-center leading-relaxed">
            🔒 This portal is restricted to authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
}
