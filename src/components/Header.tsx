import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Home, Building2, GraduationCap, Briefcase, User, Users, Globe, UserPlus, Sparkles, ChevronDown, Check, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeTab: 'feed' | 'factories' | 'alumni' | 'jobs' | 'profile';
  setActiveTab: (tab: 'feed' | 'factories' | 'alumni' | 'jobs' | 'profile') => void;
  onOpenSignUp: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSignUp,
  searchQuery,
  setSearchQuery
}) => {
  const { currentUser, logout, language, toggleLanguage, darkMode, toggleDarkMode } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-40 bg-[#005244] text-white shadow-md transition-colors border-b border-brand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setActiveTab('feed')}
              className="flex items-center space-x-2 focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white font-black text-xl shadow-sm group-hover:bg-white/25 transition">
                T
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                  Tex<span className="text-brand-300">In</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-800/80 text-brand-100 font-semibold uppercase tracking-wider border border-brand-700">
                    Textile Network
                  </span>
                </span>
                <p className="text-[10px] text-brand-100/80 font-medium">
                  {language === 'BN' ? 'টেক্সটাইল প্রফেশনাল প্ল্যাটফর্ম' : 'Textile Sector Platform'}
                </p>
              </div>
            </button>

            {/* Global Search */}
            <div className="relative hidden md:block w-60 lg:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'BN'
                    ? 'কারখানা, প্রকৌশলী, বিশ্ববিদ্যালয়...'
                    : 'Search factory, engineer, university...'
                }
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-brand-950/40 border border-brand-700/60 rounded-lg text-white placeholder-brand-200/70 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <Search className="w-4 h-4 text-brand-200/70 absolute left-3 top-2" />
            </div>
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex flex-col sm:flex-row items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'feed'
                  ? 'bg-white text-[#005244] font-bold shadow-sm'
                  : 'text-brand-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'BN' ? 'হোম ফিড' : 'Feed'}</span>
            </button>

            <button
              onClick={() => setActiveTab('factories')}
              className={`flex flex-col sm:flex-row items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition relative ${
                activeTab === 'factories'
                  ? 'bg-white text-[#005244] font-bold shadow-sm'
                  : 'text-brand-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{language === 'BN' ? 'ফ্যাক্টরি' : 'Factories'}</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-300 rounded-full animate-ping" />
            </button>

            <button
              onClick={() => setActiveTab('alumni')}
              className={`flex flex-col sm:flex-row items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'alumni'
                  ? 'bg-white text-[#005244] font-bold shadow-sm'
                  : 'text-brand-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{language === 'BN' ? 'অ্যালুমনাই' : 'Alumni'}</span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex flex-col sm:flex-row items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'jobs'
                  ? 'bg-white text-[#005244] font-bold shadow-sm'
                  : 'text-brand-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'BN' ? 'চাকরি' : 'Jobs'}</span>
            </button>
          </nav>

          {/* Right Controls: Language, Sign Up & User Profile Switcher */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg bg-brand-950/40 hover:bg-brand-900/60 text-[11px] font-bold text-white transition flex items-center gap-1 border border-brand-700/60"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-brand-300" />
              <span>{language === 'BN' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg bg-brand-950/40 hover:bg-brand-900/60 text-white transition border border-brand-700/60"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-brand-300" /> : <Moon className="w-3.5 h-3.5 text-brand-300" />}
            </button>

            {/* Sign Up Button */}
            <button
              onClick={onOpenSignUp}
              className="px-3.5 py-1.5 bg-white hover:bg-brand-50 text-[#005244] font-bold text-xs rounded-lg shadow transition flex items-center space-x-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{language === 'BN' ? 'সাইন আপ' : 'Sign Up'}</span>
            </button>

            {/* Profile Dropdown & Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-1 p-1 rounded-xl hover:bg-white/10 transition"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.firstName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-brand-300/80"
                />
                <ChevronDown className="w-3.5 h-3.5 text-brand-200" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 space-y-3 text-slate-900 dark:text-slate-100">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg">
                    <p className="font-bold text-xs text-slate-900 dark:text-white">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.headline}</p>
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowProfileMenu(false);
                      }}
                      className="mt-2 w-full py-1.5 bg-[#005244] hover:bg-[#002e26] text-white font-bold text-xs rounded-lg shadow transition"
                    >
                      {language === 'BN' ? 'প্রোফাইল দেখুন' : 'View Profile'}
                    </button>
                  </div>

                  {/* Log out */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left p-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition"
                    >
                      {language === 'BN' ? 'লগ আউট' : 'Log out'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
