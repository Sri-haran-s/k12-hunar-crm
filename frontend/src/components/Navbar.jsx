import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#172554] rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">
                <span className="text-[#172554]">EduConnect</span>
                <span className="text-[#2563EB] ml-1">CRM</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">by K12 Hunar</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-[#1E293B] hover:text-[#2563EB] transition-colors"
            >
              Home
            </Link>
            <button
              onClick={() => scrollTo('about')}
              className="text-sm font-medium text-[#1E293B] hover:text-[#2563EB] transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="text-sm font-medium text-[#1E293B] hover:text-[#2563EB] transition-colors"
            >
              Contact
            </button>
            <Link
              to="/admin/login"
              className="text-sm font-medium border border-[#2563EB] text-[#2563EB] px-4 py-1.5 rounded-lg hover:bg-[#2563EB] hover:text-white transition-all duration-200"
            >
              Admin Login
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-[#1E293B] hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-4 shadow-lg">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-[#1E293B] hover:text-[#2563EB] transition-colors"
          >
            Home
          </Link>
          <button
            onClick={() => scrollTo('about')}
            className="text-sm font-medium text-[#1E293B] hover:text-[#2563EB] transition-colors text-left"
          >
            About
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="text-sm font-medium text-[#1E293B] hover:text-[#2563EB] transition-colors text-left"
          >
            Contact
          </button>
          <Link
            to="/admin/login"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium border border-[#2563EB] text-[#2563EB] px-4 py-2 rounded-lg hover:bg-[#2563EB] hover:text-white transition-all duration-200 text-center"
          >
            Admin Login
          </Link>
        </div>
      )}
    </nav>
  );
}
