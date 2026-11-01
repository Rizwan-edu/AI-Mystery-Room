import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Compass, PlusCircle, Search } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#08090C]/95 border-b border-amber-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:border-amber-400 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Search className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-xl text-white">
                AI <span className="gold-gradient-text">MYSTERY ROOM</span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                INVESTIGATION
              </span>
            </div>
            <p className="text-xs text-neutral-400 tracking-wide hidden sm:block">
              Neural Detective Bureau • Powered by Gemini AI
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              isActive('/')
                ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/40'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <Link
            to="/create"
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              isActive('/create')
                ? 'text-amber-300 bg-amber-500/20 border border-amber-500/40 shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                : 'bg-gradient-to-r from-amber-600/30 to-amber-700/30 hover:from-amber-600/50 hover:to-amber-700/50 text-amber-200 border border-amber-500/30 hover:border-amber-400'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden xs:inline">New Case</span>
            <span className="xs:hidden">New</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
