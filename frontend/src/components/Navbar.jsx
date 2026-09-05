import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Flag, Settings, LogOut, ChevronDown, Menu, X, BarChart3, Plus, FileCheck, Home, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserProfile } from "../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const response = await getUserProfile();
        setUser(response.user);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
    };
    loadUser();
  }, [token, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowDropdown(false);
    setShowMobileMenu(false);
    navigate('/auth');
  };

  const navLinks = location.pathname === "/" ? [
    { path: '/', label: 'Home', isAnchor: false },
    { path: '#how-it-works', label: 'How It Works', isAnchor: true },
    { path: '#features', label: 'Features', isAnchor: true },
    { path: '/safety-center', label: 'Safety Center', isAnchor: false },
  ] : [
    { path: '/', label: 'Home', icon: Home },
    { path: '/safety-center', label: 'Safety Center', icon: Shield },
    ...(isAuthenticated ? [
      { path: '/scanner', label: 'Scanner', icon: Plus },
      { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
      { path: '/history', label: 'History', icon: FileCheck },
      { path: '/report-scam', label: 'Report Scam', icon: Flag },
    ] : []),
  ];

  return (
    <header className="sticky top-0 z-50 py-3 px-4 sm:px-6">
      <div
        className={`max-w-6xl mx-auto rounded-full border transition-all duration-300 px-5 py-2.5 flex items-center justify-between ${
          scrolled
            ? "bg-[#080C13]/90 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "bg-[#0B111A]/60 backdrop-blur-lg border-white/10"
        }`}
      >
        {/* Logo */}
        <div
          className="group flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 p-[1px] shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <div className="w-full h-full bg-[#05070B] rounded-[7px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-indigo-400" strokeWidth={2.2} />
            </div>
          </div>
          <span className="font-display font-bold text-[18px] tracking-tight text-white flex items-center gap-1.5">
            ScamShield
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#05070B]/50 p-1 border border-white/5 rounded-full">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            if (link.isAnchor) {
              return (
                <a
                  key={link.path}
                  href={link.path}
                  className="px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all"
                >
                  {link.label}
                </a>
              );
            }
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`relative px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  isActive ? "text-white font-semibold" : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 rounded-full bg-white/10 border border-white/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-[#080C13] hover:border-indigo-500/50 transition-all cursor-pointer shadow-xs"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center font-mono text-[10px] font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="font-mono text-[11px] text-white max-w-[100px] truncate font-medium">
                  {user?.name || 'User'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-60 rounded-xl bg-[#0B111A] border border-white/10 shadow-2xl py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/10 bg-[#080C13]">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-indigo-400 block font-bold">AI Protection Clearance</span>
                      <p className="font-display font-semibold text-sm text-white mt-0.5">{user?.name || 'User'}</p>
                      <p className="font-mono text-xs text-[#94A3B8] truncate">{user?.email || ''}</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => { setShowDropdown(false); navigate('/dashboard'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-mono text-[11px] uppercase tracking-wider text-white hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                        Intelligence Dashboard
                      </button>
                      <button
                        onClick={() => { setShowDropdown(false); navigate('/report-scam'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-mono text-[11px] uppercase tracking-wider text-white hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <Flag className="w-3.5 h-3.5 text-violet-400" />
                        Report Threat
                      </button>
                    </div>
                    <div className="border-t border-white/10 my-1" />
                    <div className="p-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-mono text-[11px] uppercase tracking-wider text-[#F43F5E] hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="group relative font-mono text-[11px] uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2 rounded-full font-bold hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-full border border-white/10 bg-[#080C13] text-white"
          >
            {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 p-4 rounded-2xl bg-[#0B111A] border border-white/10 space-y-2 shadow-2xl"
          >
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  if (link.isAnchor) {
                    window.location.href = link.path;
                  } else {
                    navigate(link.path);
                  }
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-mono text-[11px] uppercase tracking-widest text-[#94A3B8] hover:text-white hover:bg-white/5 text-left"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => { setShowMobileMenu(false); navigate('/auth'); }}
                className="w-full bg-gradient-to-r from-[#00F5A0] to-[#00D9FF] text-[#05070B] font-mono text-[11px] uppercase tracking-widest py-2.5 rounded-xl font-bold text-center"
              >
                Get Started &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;