import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Home, Building2, GraduationCap, Briefcase, User, Users, Globe, UserPlus, Sparkles, ChevronDown, Check, Sun, Moon, Settings, LogOut, MessageCircle } from 'lucide-react';

type Tab = 'feed' | 'factories' | 'alumni' | 'jobs' | 'network' | 'messages' | 'profile' | 'settings';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
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
  const { currentUser, logout, language, toggleLanguage, darkMode, toggleDarkMode, friendRequests, conversations } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  if (!currentUser) return null;

  const incomingRequestCount = friendRequests.filter(
    r => r.status === 'PENDING' && r.toUserId === currentUser.id
  ).length;
  const unreadMessageCount = conversations.filter(
    c => c.lastMessageSenderId && c.lastMessageSenderId !== currentUser.id
  ).length;

  const navItems: Array<{ tab: 'feed' | 'factories' | 'alumni' | 'jobs' | 'network' | 'messages'; icon: React.ReactNode; label: string; badge?: number }> = [
    { tab: 'feed', icon: <Home className="w-5 h-5" />, label: language === 'BN' ? 'হোম ফিড' : 'Feed' },
    { tab: 'factories', icon: <Building2 className="w-5 h-5" />, label: language === 'BN' ? 'ফ্যাক্টরি' : 'Factories' },
    { tab: 'alumni', icon: <GraduationCap className="w-5 h-5" />, label: language === 'BN' ? 'অ্যালুমনাই' : 'Alumni' },
    { tab: 'jobs', icon: <Briefcase className="w-5 h-5" />, label: language === 'BN' ? 'চাকরি' : 'Jobs' },
    { tab: 'network', icon: <Users className="w-5 h-5" />, label: language === 'BN' ? 'নেটওয়ার্ক' : 'Network', badge: incomingRequestCount },
    { tab: 'messages', icon: <MessageCircle className="w-5 h-5" />, label: language === 'BN' ? 'মেসেজ' : 'Messages', badge: unreadMessageCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#005244] text-white shadow-md transition-colors border-b border-brand-800">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 gap-2">
          {/* Brand Logo + Search (Facebook-style left cluster) */}
          <div className="flex items-center space-x-2 shrink-0 basis-0 flex-1">
            <button
              onClick={() => setActiveTab('feed')}
              className="flex items-center justify-center focus:outline-none group shrink-0"
              title="TexIn"
            >
              <div className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white font-black text-xl shadow-sm group-hover:bg-white/25 transition">
                T
              </div>
            </button>

            {/* Global Search — rounded pill like Facebook's */}
            <div className="relative hidden sm:block w-full max-w-[240px]">
              <Search className="w-3.5 h-3.5 text-brand-200/70 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'BN'
                    ? 'কারখানা, প্রকৌশলী, বিশ্ববিদ্যালয়...'
                    : 'Search Texin'
                }
                className="w-full pl-8 pr-3 py-2 text-xs bg-brand-950/40 border-none rounded-full text-white placeholder-brand-200/70 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>

          {/* Primary Navigation Tabs — icon-only, centered, underline active indicator */}
          <nav className="hidden md:flex items-stretch">
            {navItems.map(item => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                title={item.label}
                className={`relative flex items-center justify-center w-16 lg:w-24 h-14 transition ${
                  activeTab === item.tab
                    ? 'text-white'
                    : 'text-brand-200/70 hover:bg-white/10 rounded-lg'
                }`}
              >
                {item.icon}
                {!!item.badge && (
                  <span className="absolute top-2 right-4 lg:right-6 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
                {activeTab === item.tab && (
                  <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-white rounded-t-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Controls: minimal, Facebook-style — most options live in the profile menu */}
          <div className="flex items-center justify-end space-x-2 basis-0 flex-1">
            {/* Dark Mode Toggle — the one control people reach for constantly, so it stays visible */}
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 rounded-full bg-brand-950/40 hover:bg-brand-900/60 text-white transition flex items-center justify-center"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-brand-300" /> : <Moon className="w-4 h-4 text-brand-300" />}
            </button>

            {/* Sign Up Button */}
            <button
              onClick={onOpenSignUp}
              className="hidden lg:flex px-3.5 py-1.5 bg-white hover:bg-brand-50 text-[#005244] font-bold text-xs rounded-full shadow transition items-center space-x-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'BN' ? 'সাইন আপ' : 'Sign Up'}</span>
            </button>

            {/* Profile Dropdown & Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-1 pl-1 pr-2 py-1 rounded-full bg-brand-950/40 hover:bg-brand-900/60 transition"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.firstName}
                  className="w-7 h-7 rounded-full object-cover"
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

                  {/* Settings, Language, Log out */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 text-left p-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>{language === 'BN' ? 'সেটিংস' : 'Settings'}</span>
                    </button>

                    <button
                      onClick={toggleLanguage}
                      className="w-full flex items-center gap-2 text-left p-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      <Globe className="w-4 h-4 text-slate-400" />
                      <span>{language === 'BN' ? 'English-এ পরিবর্তন করুন' : 'বাংলায় পরিবর্তন করুন (Switch to Bangla)'}</span>
                    </button>

                    {/* Log out */}
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 text-left p-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{language === 'BN' ? 'লগ আউট' : 'Log out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search bar (Facebook shows the search field on its own row on small screens) */}
        <div className="sm:hidden pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-brand-200/70 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'BN' ? 'কারখানা, প্রকৌশলী, বিশ্ববিদ্যালয়...' : 'Search Texin'}
              className="w-full pl-8 pr-3 py-2 text-xs bg-brand-950/40 border-none rounded-full text-white placeholder-brand-200/70 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
        </div>

        {/* Mobile bottom tab row (icon-only, matches the desktop center nav), scrolls if it overflows */}
        <nav className="md:hidden flex items-stretch overflow-x-auto border-t border-brand-800/60">
          {navItems.map(item => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              title={item.label}
              className={`relative flex-1 min-w-[15%] flex items-center justify-center h-11 transition ${
                activeTab === item.tab ? 'text-white' : 'text-brand-200/70'
              }`}
            >
              {item.icon}
              {!!item.badge && (
                <span className="absolute top-1 right-3 min-w-[15px] h-[15px] px-0.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
              {activeTab === item.tab && (
                <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-white rounded-t-full" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
