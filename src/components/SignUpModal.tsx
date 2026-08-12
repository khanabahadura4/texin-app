import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';
import { X, Mail, Phone, Calendar, Sparkles, Lock } from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const { signUpUser, language } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setAuthError(
        language === 'BN'
          ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'
          : 'Password must be at least 6 characters'
      );
      return;
    }

    // Everything besides the essentials is left blank/empty for now — the person
    // fills in education, current job, skills, etc. later from their Profile page.
    const newUserProfile: Omit<UserProfile, 'id' | 'connectionsCount'> = {
      firstName,
      lastName,
      email,
      mobileNumber,
      birthDate,
      gender,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      headline: language === 'BN' ? 'নতুন সদস্য' : 'New TexIn member',
      bio: '',
      location: '',
      education: {
        university: '',
        universityFullName: '',
        department: '',
        batchNumber: '',
        passingYear: ''
      },
      currentCompany: '',
      currentPosition: '',
      currentDepartment: '',
      joiningYear: '',
      previousJobs: [],
      skills: []
    };

    setSubmitting(true);
    setAuthError('');
    try {
      await signUpUser(newUserProfile, password, null);
      onClose();
    } catch (err: any) {
      setAuthError(err?.message || 'Sign up failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-brand-600 to-brand-800 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {language === 'BN' ? 'TexIn অ্যাকাউন্ট তৈরি করুন' : 'Create your TexIn account'}
              </h2>
              <p className="text-[11px] text-brand-100">
                {language === 'BN'
                  ? 'বাকি তথ্য পরে প্রোফাইল থেকে যোগ করতে পারবেন'
                  : "You can add the rest from your profile later"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'BN' ? 'প্রথম নাম' : 'First Name'}
              </label>
              <input
                required
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'BN' ? 'শেষ নাম' : 'Last Name'}
              </label>
              <input
                required
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {language === 'BN' ? 'জিমেইল' : 'Gmail'}
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {language === 'BN' ? 'মোবাইল নম্বর' : 'Mobile Number'}
            </label>
            <input
              required
              type="tel"
              value={mobileNumber}
              onChange={e => setMobileNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {language === 'BN' ? 'জন্ম তারিখ' : 'Birth Date'}
              </label>
              <input
                required
                type="date"
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'BN' ? 'লিঙ্গ' : 'Gender'}
              </label>
              <select
                required
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                <option value="">{language === 'BN' ? 'নির্বাচন করুন' : 'Select'}</option>
                <option value="Male">{language === 'BN' ? 'পুরুষ' : 'Male'}</option>
                <option value="Female">{language === 'BN' ? 'মহিলা' : 'Female'}</option>
                <option value="Other">{language === 'BN' ? 'অন্যান্য' : 'Other'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              {language === 'BN' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={language === 'BN' ? 'কমপক্ষে ৬ অক্ষর' : 'At least 6 characters'}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          {authError && (
            <div className="text-xs text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold text-sm rounded-lg shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            {submitting
              ? (language === 'BN' ? 'তৈরি হচ্ছে...' : 'Creating...')
              : (language === 'BN' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account')}
          </button>

          <p className="text-[11px] text-center text-slate-400">
            {language === 'BN'
              ? 'ভার্সিটি, কারখানা, স্কিল ইত্যাদি পরে প্রোফাইল থেকে যোগ করতে পারবেন।'
              : 'You can add your university, factory, skills and more from your Profile afterwards.'}
          </p>
        </form>
      </div>
    </div>
  );
};
