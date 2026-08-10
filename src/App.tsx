import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { SignUpModal } from './components/SignUpModal';
import { FactoryDirectory } from './components/FactoryDirectory';
import { AlumniDirectory } from './components/AlumniDirectory';
import { ProfileView } from './components/ProfileView';
import { JobBoard } from './components/JobBoard';
import { UNIVERSITIES_LIST } from './data/mockData';
import { Building2, GraduationCap, Plus, Users, Globe, Lock, ShieldCheck, Sparkles, Filter, Briefcase, Award, ArrowRight, Sun, Moon } from 'lucide-react';

function MainApp() {
  const { currentUser, posts, factories, language } = useAuth();
  if (!currentUser) return null;

  const [activeTab, setActiveTab] = useState<'feed' | 'factories' | 'alumni' | 'jobs' | 'profile'>('feed');
  const [selectedProfileUserId, setSelectedProfileUserId] = useState<string | null>(null);

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [feedFilter, setFeedFilter] = useState<'ALL' | 'UNIVERSITY' | 'FACTORY'>('ALL');

  const handleSelectUser = (userId: string) => {
    setSelectedProfileUserId(userId);
    setActiveTab('profile');
  };

  // Filter posts based on visibility permissions & active tab filter
  const visiblePosts = posts.filter(post => {
    // Check Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesText = post.content.toLowerCase().includes(q) ||
        post.authorName.toLowerCase().includes(q) ||
        post.authorCompany.toLowerCase().includes(q) ||
        post.authorUniversity.toLowerCase().includes(q);
      if (!matchesText) return false;
    }

    // Audience Visibility Check:
    // Anyone: visible to all
    if (post.visibility === 'ANYONE') {
      if (feedFilter === 'UNIVERSITY') {
        return post.targetUniversity === currentUser.education.university || post.authorUniversity === currentUser.education.university;
      }
      if (feedFilter === 'FACTORY') {
        return post.targetFactory === currentUser.currentCompany || post.authorCompany === currentUser.currentCompany;
      }
      return true;
    }

    // University Only: visible if user is from that university
    if (post.visibility === 'UNIVERSITY_ONLY') {
      const targetUni = post.targetUniversity || post.authorUniversity;
      const matchesUni = currentUser.education.university === targetUni;
      if (!matchesUni) return false;

      if (feedFilter === 'FACTORY') return false; // Factory tab won't show university restricted post
      return true;
    }

    // Factory Only: visible if user works at that factory
    if (post.visibility === 'FACTORY_ONLY') {
      const targetFac = post.targetFactory || post.authorCompany;
      const matchesFac = currentUser.currentCompany.toLowerCase().includes(targetFac.toLowerCase()) ||
        targetFac.toLowerCase().includes(currentUser.currentCompany.toLowerCase());
      if (!matchesFac) return false;

      if (feedFilter === 'UNIVERSITY') return false;
      return true;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          if (tab !== 'profile') setSelectedProfileUserId(null);
        }}
        onOpenSignUp={() => setIsSignUpOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: HOME FEED */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: User Card & Quick Shortcuts */}
            <div className="lg:col-span-3 space-y-4">
              {/* Profile Card */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="h-14 bg-gradient-to-r from-brand-800 via-[#005244] to-brand-950 relative">
                  <img
                    src={currentUser.avatarUrl}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover border-2 border-white dark:border-slate-900 absolute -bottom-7 left-4 shadow-md bg-white p-0.5"
                  />
                </div>
                <div className="p-4 pt-9 space-y-2">
                  <button
                    onClick={() => handleSelectUser(currentUser.id)}
                    className="font-bold text-base text-slate-900 dark:text-white hover:text-[#005244] transition text-left block"
                  >
                    {currentUser.firstName} {currentUser.lastName}
                  </button>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {currentUser.headline}
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{language === 'BN' ? 'ভার্সিটি:' : 'University'}</span>
                      <span className="font-semibold text-brand-700 dark:text-brand-400">{currentUser.education.university}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{language === 'BN' ? 'কারখানা:' : 'Factory'}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[130px]">{currentUser.currentCompany}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Factory Lookup Shortcut Widget */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-600" />
                  <span>{language === 'BN' ? 'ফ্যাক্টরি সার্চ সার্কিউট' : 'Quick Filters'}</span>
                </h3>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {language === 'BN'
                    ? 'যেকোনো কারখানায় আপনার বিশ্ববিদ্যালয়ের বন্ধুদের খুঁজুন:'
                    : 'Find batchmates working at major textile plants:'}
                </p>

                <div className="space-y-1.5">
                  {factories.slice(0, 4).map(f => (
                    <button
                      key={f.id}
                      onClick={() => setActiveTab('factories')}
                      className="w-full text-left px-3 py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-brand-50 dark:hover:bg-brand-950/50 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between transition"
                    >
                      <span className="truncate">{f.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column: Feed & Post Creation Bar */}
            <div className="lg:col-span-6 space-y-4">
              {/* Create Post Prompt Box */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={currentUser.avatarUrl}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <button
                    onClick={() => setIsCreatePostOpen(true)}
                    className="flex-1 text-left px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-full text-xs text-slate-400 font-medium transition border border-slate-200 dark:border-slate-700"
                  >
                    {language === 'BN'
                      ? 'টেক্সটাইল আপডেট বা টেকনিক্যাল তথ্য শেয়ার করুন...'
                      : 'Start a post... (Share yarn specs, factory updates)'}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    {language === 'BN' ? 'পোস্টে টার্গেট এরিয়া সিলেক্ট করা যাবে' : 'Target Audience Controls Available'}
                  </span>
                  <button
                    onClick={() => setIsCreatePostOpen(true)}
                    className="px-3.5 py-1.5 bg-[#005244] hover:bg-[#002e26] text-white font-bold rounded-lg transition text-xs flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'BN' ? 'পোস্ট তৈরি করুন' : 'Create Post'}</span>
                  </button>
                </div>
              </div>

              {/* Feed Filters Tabs */}
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold">
                <button
                  onClick={() => setFeedFilter('ALL')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    feedFilter === 'ALL'
                      ? 'bg-[#005244] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  🌐 {language === 'BN' ? 'সব পোস্ট (All Feed)' : 'All Posts'}
                </button>

                <button
                  onClick={() => setFeedFilter('UNIVERSITY')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    feedFilter === 'UNIVERSITY'
                      ? 'bg-brand-700 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  🎓 {currentUser.education.university} {language === 'BN' ? 'অ্যালুমনাই ফিড' : 'Alumni Feed'}
                </button>

                <button
                  onClick={() => setFeedFilter('FACTORY')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    feedFilter === 'FACTORY'
                      ? 'bg-brand-900 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  🏢 {currentUser.currentCompany.split(' ')[0]} {language === 'BN' ? 'ফ্যাক্টরি ফিড' : 'Factory Feed'}
                </button>
              </div>

              {/* Posts List */}
              <div className="space-y-4">
                {visiblePosts.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500">
                      {language === 'BN'
                        ? 'এই ফিল্টারে কোন পোস্ট পাওয়া যায়নি। প্রথম আপডেটটি আপনিই পোস্ট করুন!'
                        : 'No posts found in this feed view. Be the first to share an update!'}
                    </p>
                  </div>
                ) : (
                  visiblePosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onViewProfile={handleSelectUser}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Right Sidebar: Platform Rules & Featured Directory */}
            <div className="lg:col-span-3 space-y-4">
              {/* Professional Emerald Verify & Audience Info Banner */}
              <div className="bg-[#005244] text-white rounded-xl p-5 shadow-sm relative overflow-hidden space-y-3">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
                <div className="flex items-center space-x-2 text-brand-200 font-bold text-xs relative z-10">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>{language === 'BN' ? 'টার্গেট অডিয়েন্স ও ভেরিফিকেশন' : 'Audience & Degree Verification'}</span>
                </div>
                <p className="text-xs text-brand-100/90 leading-relaxed relative z-10">
                  {language === 'BN'
                    ? 'আপনার ডিগ্রি বা সার্টিফাইড ব্যাজ পান এবং পোস্টে সুনির্দিষ্ট অডিয়েন্স সেট করুন:'
                    : 'Get your Verified Professional badge and control post visibility:'}
                </p>
                <ul className="text-xs text-brand-100/80 space-y-1.5 relative z-10">
                  <li className="flex items-start space-x-1.5">
                    <span className="text-white font-bold">🌐 Anyone:</span>
                    <span>{language === 'BN' ? 'সকল টেক্সটাইল সদস্য' : 'All Textile members'}</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-brand-200 font-bold">🎓 Alumni:</span>
                    <span>{language === 'BN' ? 'নির্দিষ্ট ভার্সিটির সাবেক ছাত্ররা' : 'Restricted to university grads'}</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-brand-300 font-bold">🏢 Factory:</span>
                    <span>{language === 'BN' ? 'একই টেক্সটাইল কারখানার কর্মীবৃন্দ' : 'Restricted to factory colleagues'}</span>
                  </li>
                </ul>
              </div>

              {/* Universities Directory List Widget */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  <span>{language === 'BN' ? 'বিশ্ববিদ্যালয় নেটওয়ার্ক' : 'Alumni Networks'}</span>
                </h3>

                <div className="space-y-2">
                  {UNIVERSITIES_LIST.slice(0, 5).map(u => (
                    <button
                      key={u.id}
                      onClick={() => setActiveTab('alumni')}
                      className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs flex items-center justify-between transition"
                    >
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{u.name}</span>
                        <span className="text-[10px] text-slate-400">{u.location}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FACTORY DIRECTORY */}
        {activeTab === 'factories' && (
          <FactoryDirectory onSelectUser={handleSelectUser} />
        )}

        {/* TAB 3: ALUMNI DIRECTORY */}
        {activeTab === 'alumni' && (
          <AlumniDirectory onSelectUser={handleSelectUser} />
        )}

        {/* TAB 4: JOB BOARD */}
        {activeTab === 'jobs' && (
          <JobBoard />
        )}

        {/* TAB 5: PROFILE VIEW */}
        {activeTab === 'profile' && (
          <ProfileView
            userId={selectedProfileUserId || currentUser.id}
            onBack={selectedProfileUserId ? () => setSelectedProfileUserId(null) : undefined}
          />
        )}
      </main>

      {/* CREATE POST MODAL */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />

      {/* SIGN UP MODAL */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />
    </div>
  );
}

function AuthGate() {
  const { currentUser, authReady } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-slate-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <LoginScreen onOpenSignUp={() => setShowSignUp(true)} />
        <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
      </>
    );
  }

  return <MainApp />;
}

function LoginScreen({ onOpenSignUp }: { onOpenSignUp: () => void }) {
  const { login, language, darkMode, toggleDarkMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4 relative">
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        title="Toggle Dark Mode"
      >
        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-[#005244] rounded-2xl mb-3">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Texin</h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'BN' ? 'বাংলাদেশের টেক্সটাইল প্রফেশনাল নেটওয়ার্ক' : "Bangladesh's Textile Professional Network"}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {language === 'BN' ? 'ইমেইল' : 'Email'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {language === 'BN' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold text-sm rounded-lg shadow-lg transition disabled:opacity-60"
          >
            {submitting ? '...' : (language === 'BN' ? 'লগ ইন করুন' : 'Log In')}
          </button>
        </form>

        <button
          onClick={onOpenSignUp}
          className="w-full mt-4 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          {language === 'BN' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create New Account'}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
