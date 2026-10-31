import { Link } from 'react-router-dom';
import { GraduationCap, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#172554] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left: Logo + Tagline */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold">
                  <span className="text-white">EduConnect</span>
                  <span className="text-blue-300 ml-1">CRM</span>
                </span>
                <span className="text-[10px] text-blue-300 font-medium tracking-wide">by K12 Hunar</span>
              </div>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed max-w-xs">
              Empowering students through connected learning.
            </p>
          </div>

          {/* Middle: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  to="/"
                  className="text-sm text-blue-200 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/inquiry"
                  className="text-sm text-blue-200 hover:text-white transition-colors"
                >
                  Submit Inquiry
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="text-sm text-blue-200 hover:text-white transition-colors"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Right: Contact */}
          <div id="contact">
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:support@k12hunar.edu"
                className="flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                support@k12hunar.edu
              </a>
              <p className="text-xs text-blue-300 leading-relaxed mt-1 border-l-2 border-blue-400/40 pl-3">
                This is a demonstration system built for educational and assessment purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-center text-xs text-blue-300">
            &copy; 2024 K12 Hunar EduConnect CRM. Built for hiring assessment purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
