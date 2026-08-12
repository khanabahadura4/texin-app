import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Globe,
  Lock,
  LogOut,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser, language, toggleLanguage, darkMode, toggleDarkMode, changePassword, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!currentUser) return null;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({
        type: 'error',
        text: language === 'BN' ? 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'New password must be at least 6 characters.'
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({
        type: 'error',
        text: language === 'BN' ? 'নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না।' : 'New password and confirmation do not match.'
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMsg({
        type: 'success',
        text: language === 'BN' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।' : 'Password updated successfully.'
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const code = err?.code || '';
      let msg = err?.message || (language === 'BN' ? 'পাসওয়ার্ড পরিবর্তন করা যায়নি।' : 'Could not change password.');
      if (code.includes('wrong-password') || code.includes('invalid-credential')) {
        msg = language === 'BN' ? 'বর্তমান পাসওয়ার্ড সঠিক নয়।' : 'Current password is incorrect.';
      }
      setPasswordMsg({ type: 'error', text: msg });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-[#005244] rounded-xl">
          <SettingsIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            {language === 'BN' ? 'সেটিংস' : 'Settings'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'BN' ? 'আপনার অ্যাকাউন্ট ও অ্যাপ কাস্টমাইজ করুন' : 'Manage your account & app preferences'}
          </p>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>{language === 'BN' ? 'অ্যাকাউন্ট তথ্য' : 'Account'}</span>
        </h3>
        <div className="flex items-center gap-3">
          <img src={currentUser.avatarUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
          <div>
            <p className="font-bold text-sm text-slate-900 dark:text-white">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Mail className="w-3 h-3" /> {currentUser.email}
            </p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          {darkMode ? <Moon className="w-4 h-4 text-brand-600" /> : <Sun className="w-4 h-4 text-brand-600" />}
          <span>{language === 'BN' ? 'অ্যাপিয়ারেন্স' : 'Appearance'}</span>
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {language === 'BN' ? 'ডার্ক মোড' : 'Dark Mode'}
            </p>
            <p className="text-xs text-slate-500">
              {language === 'BN' ? 'অ্যাপের রঙ সাদা বা ডার্ক করুন' : 'Switch the app between light and dark colors'}
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-14 h-8 rounded-full transition ${darkMode ? 'bg-brand-600' : 'bg-slate-300'}`}
          >
            <span
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center transition-all ${
                darkMode ? 'left-7' : 'left-1'
              }`}
            >
              {darkMode ? <Moon className="w-3.5 h-3.5 text-brand-700" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            </span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {language === 'BN' ? 'ভাষা' : 'Language'}
            </p>
            <p className="text-xs text-slate-500">
              {language === 'BN' ? 'বাংলা অথবা ইংরেজি বেছে নিন' : 'Choose Bangla or English'}
            </p>
          </div>
          <button
            onClick={toggleLanguage}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-brand-600" />
            {language === 'BN' ? 'বাংলা → English' : 'English → বাংলা'}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Lock className="w-4 h-4 text-brand-600" />
          <span>{language === 'BN' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Password'}</span>
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {language === 'BN' ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}
            </label>
            <input
              type={showPasswords ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {language === 'BN' ? 'নতুন পাসওয়ার্ড' : 'New Password'}
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {language === 'BN' ? 'কনফার্ম নতুন পাসওয়ার্ড' : 'Confirm New Password'}
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPasswords(prev => !prev)}
            className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1"
          >
            {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPasswords
              ? (language === 'BN' ? 'পাসওয়ার্ড লুকান' : 'Hide passwords')
              : (language === 'BN' ? 'পাসওয়ার্ড দেখান' : 'Show passwords')}
          </button>

          {passwordMsg && (
            <div
              className={`flex items-start gap-2 text-xs rounded-lg px-3 py-2 border ${
                passwordMsg.type === 'success'
                  ? 'text-green-700 bg-green-50 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900'
                  : 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900'
              }`}
            >
              {passwordMsg.type === 'success' ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              )}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isChangingPassword}
            className="px-5 py-2 bg-[#005244] hover:bg-[#002e26] disabled:opacity-60 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-1.5"
          >
            {isChangingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {language === 'BN' ? 'পাসওয়ার্ড আপডেট করুন' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/60 shadow-sm p-5 space-y-3">
        <h3 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-red-100 dark:border-red-900/60">
          <LogOut className="w-4 h-4" />
          <span>{language === 'BN' ? 'লগ আউট' : 'Log Out'}</span>
        </h3>
        <p className="text-xs text-slate-500">
          {language === 'BN'
            ? 'এই ডিভাইস থেকে আপনার TexIn অ্যাকাউন্ট থেকে সাইন আউট করুন।'
            : 'Sign out of your TexIn account on this device.'}
        </p>

        {!showLogoutConfirm ? (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            {language === 'BN' ? 'লগ আউট করুন' : 'Log Out'}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {language === 'BN' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?'}
            </span>
            <button
              onClick={() => logout()}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition"
            >
              {language === 'BN' ? 'হ্যাঁ, লগ আউট' : 'Yes, log out'}
            </button>
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              {language === 'BN' ? 'বাতিল' : 'Cancel'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
