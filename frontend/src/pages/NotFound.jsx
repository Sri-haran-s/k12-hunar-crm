import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-extrabold text-[#2563EB] leading-none mb-4">404</p>
      <h1 className="text-2xl font-bold text-[#172554] mb-3">Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-xs mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Home
      </Link>
    </div>
  );
}
