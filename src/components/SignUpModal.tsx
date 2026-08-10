import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UNIVERSITIES_LIST, INITIAL_FACTORIES } from '../data/mockData';
import { JobHistoryItem, UserProfile } from '../types';
import { X, Plus, Trash2, Building2, GraduationCap, Briefcase, User, Mail, Phone, Calendar, Sparkles, Camera, Upload, Loader2 } from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const { signUpUser, language } = useAuth();

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const [step, setStep] = useState<number>(1); // 1: Personal Info, 2: Education, 3: Present & Previous Work History

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Education state
  const [university, setUniversity] = useState('BUTEX');
  const [customUniversity, setCustomUniversity] = useState('');
  const [department, setDepartment] = useState('Yarn Engineering');
  const [batchNumber, setBatchNumber] = useState('41st Batch');
  const [passingYear, setPassingYear] = useState('2018');

  // Current Job / Factory
  const [currentCompany, setCurrentCompany] = useState('Square Textiles Ltd');
  const [customCompany, setCustomCompany] = useState('');
  const [currentPosition, setCurrentPosition] = useState('Executive Merchandiser');
  const [currentDepartment, setCurrentDepartment] = useState('Production');
  const [joiningYear, setJoiningYear] = useState('2021');
  const [location, setLocation] = useState('Dhaka, Bangladesh');

  // Previous Jobs
  const [previousJobs, setPreviousJobs] = useState<Omit<JobHistoryItem, 'id'>[]>([
    {
      companyName: 'Envoy Textiles Ltd',
      position: 'Junior Officer',
      department: 'Quality Assurance',
      startDate: '2019',
      endDate: '2021',
      description: 'Lab testing and fabric shade inspection.'
    }
  ]);

  const [skillsText, setSkillsText] = useState('Fabric Dyeing, Quality Control, Buyer Communication');

  if (!isOpen) return null;

  const handleAddPreviousJob = () => {
    setPreviousJobs(prev => [
      ...prev,
      {
        companyName: '',
        position: '',
        department: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ]);
  };

  const handleRemovePreviousJob = (index: number) => {
    setPreviousJobs(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreviousJobChange = (index: number, field: keyof Omit<JobHistoryItem, 'id'>, value: string) => {
    setPreviousJobs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedUniObj = UNIVERSITIES_LIST.find(u => u.id === university);
    const finalUniversityName = university === 'OTHER' ? customUniversity : university;
    const finalUniversityFullName = selectedUniObj ? selectedUniObj.fullName : finalUniversityName;

    const finalCompany = currentCompany === 'OTHER' ? customCompany : currentCompany;

    const headline = `${currentPosition} at ${finalCompany} | ${finalUniversityName} ${batchNumber}`;

    const formattedPreviousJobs: JobHistoryItem[] = previousJobs
      .filter(j => j.companyName.trim() !== '')
      .map((j, idx) => ({
        ...j,
        id: `pj-new-${idx}-${Date.now()}`
      }));

    const newUserProfile: Omit<UserProfile, 'id' | 'connectionsCount'> = {
      firstName,
      lastName,
      email,
      mobileNumber,
      birthDate,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      headline,
      bio: `Textile Engineering professional graduated from ${finalUniversityName} (${batchNumber}). Currently working as ${currentPosition} at ${finalCompany}.`,
      location,
      education: {
        university: finalUniversityName,
        universityFullName: finalUniversityFullName,
        department,
        batchNumber,
        passingYear
      },
      currentCompany: finalCompany,
      currentPosition,
      currentDepartment,
      joiningYear,
      previousJobs: formattedPreviousJobs,
      skills: skillsText.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters / পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }

    setSubmitting(true);
    setAuthError('');
    try {
      await signUpUser(newUserProfile, password, avatarFile);
      onClose();
    } catch (err: any) {
      setAuthError(err?.message || 'Sign up failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-brand-600 to-brand-800 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {language === 'BN' ? 'TexIn অ্যাকাউন্ট সাইন আপ (Create Profile)' : 'TexIn Sign Up & Registration'}
              </h2>
              <p className="text-xs text-brand-100">
                {language === 'BN' ? 'টেক্সটাইল ইঞ্জিনিয়ার ও কারখানা প্রফেশনালদের নেটওয়ার্কে যোগ দিন' : 'Join the Bangladesh Textile Professionals Network'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 py-3 text-xs font-semibold text-slate-500">
          <div className={`flex items-center space-x-2 mr-6 ${step === 1 ? 'text-brand-600 dark:text-brand-400 font-bold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-xs">1</span>
            <span>{language === 'BN' ? 'ব্যক্তিগত তথ্য (Personal Info)' : 'Personal Info'}</span>
          </div>
          <div className={`flex items-center space-x-2 mr-6 ${step === 2 ? 'text-brand-600 dark:text-brand-400 font-bold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-xs">2</span>
            <span>{language === 'BN' ? 'শিক্ষা (Education & University)' : 'Education & College'}</span>
          </div>
          <div className={`flex items-center space-x-2 ${step === 3 ? 'text-brand-600 dark:text-brand-400 font-bold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-xs">3</span>
            <span>{language === 'BN' ? 'চাকরি ও ফ্যাক্টরি তথ্য (Job History)' : 'Job & Factory History'}</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: PERSONAL INFO */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-brand-600" />
                {language === 'BN' ? '১. ব্যক্তিগত ও যোগাযোগের তথ্য' : '1. Personal Details'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {language === 'BN' ? 'ফার্স্ট নেম (First Name) *' : 'First Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="e.g. Tanvir"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {language === 'BN' ? 'লাস্ট নেম (Last Name) *' : 'Last Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="e.g. Ahmed"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <Mail className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                    {language === 'BN' ? 'ইমেইল এড্রেস (Email) *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. tanvir@gmail.com"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {language === 'BN' ? 'পাসওয়ার্ড (Password) *' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={language === 'BN' ? 'কমপক্ষে ৬ অক্ষর' : 'At least 6 characters'}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <Phone className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                    {language === 'BN' ? 'মোবাইল নম্বর (Mobile Number) *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value)}
                    placeholder="+88017XXXXXXXX"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <Calendar className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                    {language === 'BN' ? 'জন্ম তারিখ (Birth Date) *' : 'Birth Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {language === 'BN' ? 'প্রোফাইল ছবি (ঐচ্ছিক)' : 'Profile Photo (optional)'}
                  </label>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                    id="signup-avatar-upload"
                  />
                  <label
                    htmlFor="signup-avatar-upload"
                    className="w-full flex items-center gap-3 px-3 py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-brand-500 hover:bg-brand-50/40 dark:hover:bg-brand-950/20 transition"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-9 h-9 rounded-full object-cover border border-brand-300" />
                    ) : (
                      <span className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Camera className="w-4 h-4 text-slate-400" />
                      </span>
                    )}
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      {avatarFile
                        ? avatarFile.name
                        : (language === 'BN' ? 'ছবি বেছে নিতে ক্লিক করুন' : 'Click to choose a photo')}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!firstName || !lastName || !email || !mobileNumber) {
                      alert('Please fill out all required fields in Step 1.');
                      return;
                    }
                    setStep(2);
                  }}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg shadow transition"
                >
                  {language === 'BN' ? 'পরবর্তীধাপ: শিক্ষা (Next: Education) →' : 'Next: Education →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: EDUCATION */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-brand-600" />
                {language === 'BN' ? '২. বিশ্ববিদ্যালয় / কলেজ ও ব্যাচ ব্যাকগ্রাউন্ড' : '2. Education Background'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {language === 'BN' ? 'বিশ্ববিদ্যালয় / কলেজ (University or College) *' : 'University / College *'}
                  </label>
                  <select
                    value={university}
                    onChange={e => setUniversity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    <optgroup label={language === 'BN' ? '🏛️ সরকারি (Government)' : '🏛️ Government'}>
                      {UNIVERSITIES_LIST.filter(u => u.type === 'GOVT').map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} - {u.fullName}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label={language === 'BN' ? '🏢 বেসরকারি (Private)' : '🏢 Private'}>
                      {UNIVERSITIES_LIST.filter(u => u.type === 'PRIVATE').map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} - {u.fullName}
                        </option>
                      ))}
                    </optgroup>
                    <option value="OTHER">Other Institution / College</option>
                  </select>
                </div>

                {university === 'OTHER' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      {language === 'BN' ? 'প্রতিষ্ঠান এর নাম (Institution Name) *' : 'Specify University/College *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customUniversity}
                      onChange={e => setCustomUniversity(e.target.value)}
                      placeholder="e.g. Textile Engineering College, Noakhali"
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {language === 'BN' ? 'ডিপার্টমেন্ট / সাবজেক্ট (Department) *' : 'Department *'}
                  </label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    <option value="Yarn Engineering">Yarn Engineering (Spinning)</option>
                    <option value="Wet Process Engineering">Wet Process Engineering (Dyeing & Finishing)</option>
                    <option value="Fabric Engineering">Fabric Engineering (Weaving & Knitting)</option>
                    <option value="Apparel Engineering">Apparel Engineering (Garments/Merchandising)</option>
                    <option value="Textile Engineering Management">Textile Engineering Management (TEM)</option>
                    <option value="Dyes & Chemical Engineering">Dyes & Chemical Engineering</option>
                    <option value="Industrial & Production Engineering">Industrial & Production Engineering (IPE)</option>
                    <option value="Fashion & Design">Fashion & Design</option>
                    <option value="General Textile Engineering">General Textile Engineering</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {language === 'BN' ? 'ব্যাচ নম্বর (Batch Number) *' : 'Batch Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={batchNumber}
                    onChange={e => setBatchNumber(e.target.value)}
                    placeholder="e.g. 41st Batch / 2018 Batch"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {language === 'BN' ? 'পাসিং সাল (Passing / Graduation Year)' : 'Graduation Year'}
                  </label>
                  <input
                    type="text"
                    value={passingYear}
                    onChange={e => setPassingYear(e.target.value)}
                    placeholder="e.g. 2018"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  ← {language === 'BN' ? 'আগের ধাপ' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg shadow transition"
                >
                  {language === 'BN' ? 'পরবর্তীধাপ: চাকরি ইতিহাস (Next: Jobs) →' : 'Next: Work History →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: WORK HISTORY */}
          {step === 3 && (
            <div className="space-y-6">
              {/* PRESENT JOB */}
              <div className="p-4 bg-brand-50 dark:bg-brand-950/30 rounded-xl border border-brand-200 dark:border-brand-800/50 space-y-3">
                <h3 className="text-sm font-bold text-brand-800 dark:text-brand-300 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-600" />
                  {language === 'BN' ? 'বর্তমান চাকরি / ফ্যাক্টরি তথ্য (Present Factory Job)' : 'Present Factory Job'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'BN' ? 'ফ্যাক্টরি / কোম্পানি নাম (Factory/Company) *' : 'Factory / Company *'}
                    </label>
                    <select
                      value={currentCompany}
                      onChange={e => setCurrentCompany(e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    >
                      {INITIAL_FACTORIES.map(f => (
                        <option key={f.id} value={f.name}>
                          {f.name} ({f.location})
                        </option>
                      ))}
                      <option value="OTHER">Other Factory / Textile Group</option>
                    </select>
                  </div>

                  {currentCompany === 'OTHER' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'BN' ? 'ফ্যাক্টরির নাম লিখুন (Specify Factory Name) *' : 'Specify Factory Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={customCompany}
                        onChange={e => setCustomCompany(e.target.value)}
                        placeholder="e.g. Epyllion Composite Textiles"
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'BN' ? 'পদবী / পজিশন (Position/Designation) *' : 'Designation / Role *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={currentPosition}
                      onChange={e => setCurrentPosition(e.target.value)}
                      placeholder="e.g. Senior Merchandiser / AGM Spinning"
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'BN' ? 'ডিপার্টমেন্ট (Department)' : 'Department'}
                    </label>
                    <input
                      type="text"
                      value={currentDepartment}
                      onChange={e => setCurrentDepartment(e.target.value)}
                      placeholder="e.g. Dyeing / Marketing / QC"
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'BN' ? 'যোগদানের বছর (Joining Year)' : 'Joined Year'}
                    </label>
                    <input
                      type="text"
                      value={joiningYear}
                      onChange={e => setJoiningYear(e.target.value)}
                      placeholder="e.g. 2021"
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'BN' ? 'লোকেশন (Location)' : 'Location'}
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Gazipur / Valuka"
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* PREVIOUS JOB HISTORY */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-brand-600" />
                    {language === 'BN' ? 'পূর্ববর্তী চাকরির ইতিহাস (Previous Job History)' : 'Previous Job History'}
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddPreviousJob}
                    className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                  >
                    <Plus className="w-4 h-4" />
                    {language === 'BN' ? '+ চাকরি যোগ করুন' : '+ Add Previous Job'}
                  </button>
                </div>

                {previousJobs.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    {language === 'BN' ? 'কোন পূর্ববর্তী চাকরি যোগ করা হয়নি (No previous jobs added yet).' : 'No previous jobs added.'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {previousJobs.map((job, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 relative space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            {language === 'BN' ? `পূর্ববর্তী অভিজ্ঞতা #${idx + 1}` : `Previous Position #${idx + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePreviousJob(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder={language === 'BN' ? 'কোম্পানি / ফ্যাক্টরি নাম' : 'Company / Factory Name'}
                            value={job.companyName}
                            onChange={e => handlePreviousJobChange(idx, 'companyName', e.target.value)}
                            className="px-2.5 py-1.5 text-xs border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder={language === 'BN' ? 'পদবী / রোল' : 'Designation / Role'}
                            value={job.position}
                            onChange={e => handlePreviousJobChange(idx, 'position', e.target.value)}
                            className="px-2.5 py-1.5 text-xs border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder={language === 'BN' ? 'ডিপার্টমেন্ট' : 'Department'}
                            value={job.department || ''}
                            onChange={e => handlePreviousJobChange(idx, 'department', e.target.value)}
                            className="px-2.5 py-1.5 text-xs border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder={language === 'BN' ? 'শুরুর সাল (e.g. 2018)' : 'Start Year'}
                            value={job.startDate}
                            onChange={e => handlePreviousJobChange(idx, 'startDate', e.target.value)}
                            className="px-2.5 py-1.5 text-xs border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder={language === 'BN' ? 'শেষের সাল (e.g. 2021)' : 'End Year'}
                            value={job.endDate}
                            onChange={e => handlePreviousJobChange(idx, 'endDate', e.target.value)}
                            className="px-2.5 py-1.5 text-xs border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SKILLS */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'BN' ? 'দক্ষতা ও স্পেশালিটি (Key Skills - comma separated)' : 'Key Skills (comma separated)'}
                </label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={e => setSkillsText(e.target.value)}
                  placeholder="e.g. Yarn Testing, Wet Processing, Buyer Sourcing, Costing"
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              {authError && (
                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
                  {authError}
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  ← {language === 'BN' ? 'আগের ধাপ' : 'Back'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold text-sm rounded-lg shadow-lg transition flex items-center gap-2 disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4" />
                  {submitting
                    ? (language === 'BN' ? 'তৈরি হচ্ছে...' : 'Creating...')
                    : (language === 'BN' ? 'অ্যাকাউন্ট তৈরি করুন (Complete Registration)' : 'Complete Registration')}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
