import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import FilterBar from '../components/FilterBar';
import InquiryTable from '../components/InquiryTable';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { getInquiries, getStats, updateInquiryStatus } from '../services/api';
import { formatDate } from '../utils/helpers';
import {
  Menu, X, Inbox, Clock, CheckCircle2, Sparkles,
  GraduationCap, LogOut, User, ChevronRight, AlertCircle
} from 'lucide-react';

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-[#172554] mt-0.5">{value ?? '—'}</p>
      </div>
    </div>
  );
}

// ── Inquiry Detail Modal ───────────────────────────────────────────────────────
function InquiryModal({ inquiry, onClose, onStatusUpdated }) {
  const [status, setStatus] = useState(inquiry.status);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const handleUpdate = async () => {
    setSaving(true); setMsg(''); setIsError(false);
    try {
      await updateInquiryStatus(inquiry.id, status);
      setMsg('Status updated successfully.');
      onStatusUpdated(inquiry.id, status);
    } catch {
      setIsError(true);
      setMsg('Failed to update status. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#172554]">Inquiry Details</h2>
            <p className="text-xs text-slate-400 mt-0.5">ID: {inquiry.id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Grid info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', value: inquiry.name },
              { label: 'Email Address', value: inquiry.email },
              { label: 'Phone Number', value: inquiry.phone },
              { label: 'User Type', value: inquiry.user_type },
              { label: 'Category', value: inquiry.category },
              { label: 'Submitted On', value: formatDate(inquiry.created_at) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-lg px-4 py-3">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-semibold text-[#1E293B]">{value}</p>
              </div>
            ))}
          </div>

          {/* Current Status */}
          <div className="bg-slate-50 rounded-lg px-4 py-3">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Current Status</p>
            <StatusBadge status={inquiry.status} />
          </div>

          {/* Message */}
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Message / Query</p>
            <div className="bg-slate-50 rounded-lg px-4 py-3 text-sm text-[#1E293B] leading-relaxed whitespace-pre-wrap">
              {inquiry.message}
            </div>
          </div>

          {/* Status Update */}
          <div className="border border-slate-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-[#172554] mb-3">Update Status</p>
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="flex-1 min-w-[160px] border border-slate-200 rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <button
                onClick={handleUpdate}
                disabled={saving || status === inquiry.status}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {saving ? <LoadingSpinner size="sm" /> : <CheckCircle2 className="w-4 h-4" />}
                {saving ? 'Saving…' : 'Update Status'}
              </button>
            </div>
            {msg && (
              <p className={`mt-2 text-sm flex items-center gap-1.5 ${isError ? 'text-red-600' : 'text-green-600'}`}>
                {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                {msg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Page ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data state
  const [inquiries, setInquiries] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({ category: '', userType: '', search: '' });
  const [page, setPage] = useState(1);
  const searchTimer = useRef(null);

  // Fetch stats once on mount
  useEffect(() => {
    getStats()
      .then(res => setStats(res.data.data))
      .catch(() => {});
  }, []);

  // Fetch inquiries when filters or page change
  const fetchInquiries = useCallback(async (f, p) => {
    setIsLoading(true); setError('');
    try {
      const params = { page: p, limit: 10 };
      if (f.category) params.category = f.category;
      if (f.userType) params.userType = f.userType;
      if (f.search)   params.search   = f.search;
      const res = await getInquiries(params);
      setInquiries(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load inquiries.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries(filters, page);
  }, [filters, page, fetchInquiries]);

  // Debounced filter change
  const handleFilterChange = (key, value) => {
    if (key === 'search') {
      clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => {
        setPage(1);
        setFilters(prev => ({ ...prev, search: value }));
      }, 400);
    } else {
      setPage(1);
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleClearFilters = () => {
    setFilters({ category: '', userType: '', search: '' });
    setPage(1);
  };

  // Status update from table row or modal
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateInquiryStatus(id, newStatus);
      setInquiries(prev =>
        prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq)
      );
      // Refresh stats
      getStats().then(res => setStats(res.data.data)).catch(() => {});
    } catch {
      alert('Failed to update status. Please try again.');
    }
  };

  // After modal status update: patch local state + close
  const handleModalStatusUpdated = (id, newStatus) => {
    setInquiries(prev =>
      prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq)
    );
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
    }
    getStats().then(res => setStats(res.data.data)).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-[#172554] leading-tight">Inquiry Management</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Review, track, and manage incoming inquiries</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <User className="w-4 h-4" />
              <span className="truncate max-w-[180px]">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 px-4 sm:px-6 py-6 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Inquiries"
              value={stats?.total}
              icon={Inbox}
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <StatCard
              label="New"
              value={stats?.new}
              icon={Sparkles}
              color="text-indigo-600"
              bg="bg-indigo-50"
            />
            <StatCard
              label="In Progress"
              value={stats?.in_progress}
              icon={Clock}
              color="text-amber-600"
              bg="bg-amber-50"
            />
            <StatCard
              label="Resolved"
              value={stats?.resolved}
              icon={CheckCircle2}
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
          </div>

          {/* Table section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            {/* Section header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-base font-bold text-[#172554]">All Inquiries</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {pagination.total} total {pagination.total === 1 ? 'inquiry' : 'inquiries'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ChevronRight className="w-3 h-3" />
                Page {pagination.page} of {pagination.totalPages || 1}
              </div>
            </div>

            {/* Filter bar */}
            <div className="px-5 py-3 border-b border-slate-100">
              <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={handleClearFilters}
              />
            </div>

            {/* Table */}
            <InquiryTable
              inquiries={inquiries}
              isLoading={isLoading}
              error={error}
              pagination={pagination}
              onPageChange={setPage}
              onStatusUpdate={handleStatusUpdate}
              onViewDetail={setSelectedInquiry}
            />
          </div>
        </main>
      </div>

      {/* Detail modal */}
      {selectedInquiry && (
        <InquiryModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onStatusUpdated={handleModalStatusUpdated}
        />
      )}
    </div>
  );
}
