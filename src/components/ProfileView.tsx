import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProfile, JobHistoryItem } from '../types';
import { UNIVERSITIES_LIST, INITIAL_FACTORIES } from '../data/mockData';
import { Building2, GraduationCap, MapPin, Phone, Mail, Calendar, Briefcase, Award, Edit3, Plus, Trash2, X, Check, ArrowLeft, ShieldCheck, Camera, Loader2, UserPlus, UserCheck, Clock, MessageCircle } from 'lucide-react';

interface ProfileViewProps {
  userId: string;
  onBack?: () => void;
  onOpenMessage?: (userId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userId, onBack, onOpenMessage }) => {
  const {
    currentUser,
    users,
    updateProfile,
    uploadAvatar,
    uploadCoverImage,
    language,
    friendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    removeFriend
  } = useAuth();

  if (!currentUser) return null;

  const user = users.find(u => u.id === userId) || currentUser;
  const isOwnProfile = user.id === currentUser.id;

  // Friend/connection status between currentUser and this profile's user.
  const relevantRequest = friendRequests.find(
    r =>
      (r.fromUserId === currentUser.id && r.toUserId === user.id) ||
      (r.fromUserId === user.id && r.toUserId === currentUser.id)
  );
  const isFriend = relevantRequest?.status === 'ACCEPTED';
  const isPendingSentByMe = relevantRequest?.status === 'PENDING' && relevantRequest.fromUserId === currentUser.id;
  const isPendingReceivedByMe = relevantRequest?.status === 'PENDING' && relevantRequest.toUserId === currentUser.id;

  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isOwnProfile) return;
    setPhotoError('');
    setIsUploadingAvatar(true);
    try {
      const url = await uploadAvatar(file);
      await updateProfile({ ...user, avatarUrl: url });
    } catch (err: any) {
      setPhotoError(err?.message || (language === 'BN' ? 'ছবি আপলোড করা যায়নি।' : 'Photo upload failed.'));
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isOwnProfile) return;
    setPhotoError('');
    setIsUploadingCover(true);
    try {
      const url = await uploadCoverImage(file);
      await updateProfile({ ...user, coverImageUrl: url });
    } catch (err: any) {
      setPhotoError(err?.message || (language === 'BN' ? 'কভার ছবি আপলোড করা যায়নি।' : 'Cover photo upload failed.'));
    } finally {
      setIsUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // Edit form states
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [headline, setHeadline] = useState(user.headline);
  const [bio, setBio] = useState(user.bio || '');
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber);
  const [email, setEmail] = useState(user.email);
  const [birthDate, setBirthDate] = useState(user.birthDate);
  const [location, setLocation] = useState(user.location);
  const [currentCompany, setCurrentCompany] = useState(user.currentCompany);
  const [currentPosition, setCurrentPosition] = useState(user.currentPosition);
  const [currentDepartment, setCurrentDepartment] = useState(user.currentDepartment);
  const [joiningYear, setJoiningYear] = useState(user.joiningYear);

  // Previous jobs editing state
  const [previousJobs, setPreviousJobs] = useState<JobHistoryItem[]>(user.previousJobs || []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser: UserProfile = {
      ...user,
      firstName,
      lastName,
      headline,
      bio,
      mobileNumber,
      email,
      birthDate,
      location,
      currentCompany,
      currentPosition,
      currentDepartment,
      joiningYear,
      previousJobs
    };

    updateProfile(updatedUser);
    setIsEditing(false);
  };

  const handleAddPreviousJob = () => {
    setPreviousJobs(prev => [
      ...prev,
      {
        id: `pj-${Date.now()}`,
        companyName: '',
        position: '',
        department: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ]);
  };

  const handleRemovePreviousJob = (id: string) => {
    setPreviousJobs(prev => prev.filter(j => j.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Back Navigation */}
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'BN' ? 'আগের পাতায় ফিরে যান' : 'Back to Directory'}</span>
        </button>
      )}

      {/* Main Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
        {/* Cover Image */}
        <div className="h-44 sm:h-56 relative bg-gradient-to-r from-brand-900 via-brand-950 to-slate-900 group">
          {user.coverImageUrl && (
            <img src={user.coverImageUrl} alt="Cover" className="w-full h-full object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

          {isOwnProfile && (
            <>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="hidden"
              />
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
                className="absolute bottom-3 right-4 px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-900 dark:text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 sm:opacity-100"
              >
                {isUploadingCover ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-brand-600" />
                )}
                <span>{language === 'BN' ? 'কভার ছবি পরিবর্তন' : 'Change Cover'}</span>
              </button>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-900 dark:text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-600" />
                <span>{language === 'BN' ? 'প্রোফাইল এডিট করুন' : 'Edit Profile'}</span>
              </button>
            </>
          )}

          {/* Friend / Message actions — shown on other people's profiles */}
          {!isOwnProfile && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {isFriend ? (
                <>
                  <span className="px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-brand-600" />
                    <span>{language === 'BN' ? 'ফ্রেন্ড' : 'Friends'}</span>
                  </span>
                  {onOpenMessage && (
                    <button
                      onClick={() => onOpenMessage(user.id)}
                      className="px-3 py-1.5 bg-[#005244] hover:bg-[#002e26] text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{language === 'BN' ? 'মেসেজ' : 'Message'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => removeFriend(user.id)}
                    title={language === 'BN' ? 'আনফ্রেন্ড' : 'Unfriend'}
                    className="p-2 bg-white/90 dark:bg-slate-900/90 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-500 hover:text-red-600 rounded-xl shadow-lg transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : isPendingSentByMe && relevantRequest ? (
                <button
                  onClick={() => cancelFriendRequest(relevantRequest.id)}
                  className="px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === 'BN' ? 'রিকোয়েস্ট বাতিল করুন' : 'Cancel Request'}</span>
                </button>
              ) : isPendingReceivedByMe && relevantRequest ? (
                <button
                  onClick={() => acceptFriendRequest(relevantRequest.id)}
                  className="px-3 py-1.5 bg-[#005244] hover:bg-[#002e26] text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'BN' ? 'রিকোয়েস্ট গ্রহণ করুন' : 'Accept Request'}</span>
                </button>
              ) : (
                <button
                  onClick={() => sendFriendRequest(user.id)}
                  className="px-3 py-1.5 bg-[#005244] hover:bg-[#002e26] text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{language === 'BN' ? 'অ্যাড ফ্রেন্ড' : 'Add Friend'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile Info Header */}
        <div className="px-6 sm:px-8 pb-8 relative">
          {photoError && (
            <div className="mb-3 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
              {photoError}
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            <div className="relative inline-block group/avatar">
              <img
                src={user.avatarUrl}
                alt={user.firstName}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white dark:border-slate-900 shadow-xl bg-white"
              />
              <span className="absolute bottom-2 right-2 w-5 h-5 bg-brand-500 rounded-full border-2 border-white dark:border-slate-900" />

              {isOwnProfile && (
                <>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    title={language === 'BN' ? 'প্রোফাইল ছবি পরিবর্তন করুন' : 'Change profile photo'}
                    className="absolute inset-0 flex items-center justify-center rounded-3xl bg-slate-950/0 group-hover/avatar:bg-slate-950/50 transition text-white opacity-0 group-hover/avatar:opacity-100"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6" />
                    )}
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 font-extrabold text-xs border border-brand-300 dark:border-brand-800">
                🎓 {user.education.university} ({user.education.batchNumber})
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-xs border border-amber-300 dark:border-amber-800">
                🏢 {user.currentCompany}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h1>
              <ShieldCheck className="w-6 h-6 text-brand-500" />
            </div>

            <p className="text-sm font-semibold text-brand-700 dark:text-brand-400">
              {user.headline}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.location}</span>
              <span>•</span>
              <span className="font-semibold text-brand-600">{user.connectionsCount} {language === 'BN' ? 'নেটওয়ার্ক কানেকশন' : 'connections'}</span>
            </p>

            {user.bio && (
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                {user.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Contact Info & Education & Work Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Contact Details */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Phone className="w-4 h-4 text-brand-600" />
              <span>{language === 'BN' ? 'যোগাযোগের তথ্য (Contact Info)' : 'Contact Details'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">{language === 'BN' ? 'মোবাইল নম্বর' : 'Mobile Number'}</span>
                <a href={`tel:${user.mobileNumber}`} className="font-bold text-slate-800 dark:text-slate-200 hover:text-brand-600">
                  {user.mobileNumber}
                </a>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">{language === 'BN' ? 'ইমেইল এড্রেস' : 'Email Address'}</span>
                <a href={`mailto:${user.email}`} className="font-bold text-slate-800 dark:text-slate-200 hover:text-brand-600">
                  {user.email}
                </a>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">{language === 'BN' ? 'জন্ম তারিখ' : 'Birth Date'}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {user.birthDate}
                </span>
              </div>
            </div>
          </div>

          {/* Education Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>{language === 'BN' ? 'শিক্ষাগত যোগ্যতা (Education)' : 'Educational Background'}</span>
            </h3>

            <div className="space-y-1 text-xs">
              <h4 className="font-extrabold text-blue-700 dark:text-blue-400 text-sm">
                {user.education.universityFullName || user.education.university}
              </h4>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {user.education.department}
              </p>
              <div className="flex items-center justify-between text-slate-500 pt-1 text-[11px]">
                <span>Batch: <strong className="text-slate-700 dark:text-slate-300">{user.education.batchNumber}</strong></span>
                <span>Passed: <strong>{user.education.passingYear}</strong></span>
              </div>
            </div>
          </div>

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{language === 'BN' ? 'টেক্সটাইল স্কিলসমূহ (Skills)' : 'Technical Skills'}</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {user.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Present & Previous Job History Timeline */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Briefcase className="w-4 h-4 text-brand-600" />
              <span>{language === 'BN' ? 'বর্তমান ও পূর্ববর্তী চাকরির ইতিহাস' : 'Present & Previous Job History'}</span>
            </h3>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-200 dark:before:bg-brand-900">
              {/* PRESENT JOB */}
              <div className="relative">
                <span className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-brand-600 border-2 border-white dark:border-slate-900 shadow" />
                <div className="bg-brand-50/80 dark:bg-brand-950/40 p-4 rounded-2xl border border-brand-200 dark:border-brand-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-brand-600 text-white font-bold text-[10px] uppercase">
                      {language === 'BN' ? 'বর্তমান চাকরি' : 'Present Position'}
                    </span>
                    <span className="text-xs font-semibold text-brand-700 dark:text-brand-400">
                      {user.joiningYear} - Present
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white pt-1">
                    {user.currentPosition}
                  </h4>
                  <p className="text-xs font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-brand-600" />
                    <span>{user.currentCompany} ({user.currentDepartment})</span>
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{user.location}</span>
                  </p>
                </div>
              </div>

              {/* PREVIOUS JOBS */}
              {user.previousJobs && user.previousJobs.map(pj => (
                <div key={pj.id} className="relative">
                  <span className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-900" />
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                        {language === 'BN' ? 'পূর্ববর্তী চাকরি' : 'Previous Job'}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {pj.startDate} - {pj.endDate}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-1">
                      {pj.position}
                    </h4>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{pj.companyName} {pj.department ? `(${pj.department})` : ''}</span>
                    </p>
                    {pj.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">
                        {pj.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-brand-600" />
                <span>{language === 'BN' ? 'আপনার প্রোফাইল এডিট করুন' : 'Edit Profile Information'}</span>
              </h3>
              <button onClick={() => setIsEditing(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-slate-300">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Mobile Number</label>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Present Factory / Company</label>
                  <input
                    type="text"
                    value={currentCompany}
                    onChange={e => setCurrentCompany(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Present Position</label>
                  <input
                    type="text"
                    value={currentPosition}
                    onChange={e => setCurrentPosition(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Edit Previous Jobs */}
              <div className="space-y-2 pt-2 border-t dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase dark:text-slate-300">Previous Jobs</span>
                  <button
                    type="button"
                    onClick={handleAddPreviousJob}
                    className="text-xs text-brand-600 font-semibold"
                  >
                    + Add Job
                  </button>
                </div>

                {previousJobs.map((pj, idx) => (
                  <div key={pj.id} className="p-3 border rounded-lg dark:border-slate-700 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => handleRemovePreviousJob(pj.id)}
                      className="absolute top-2 right-2 text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={pj.companyName}
                        onChange={e => {
                          const val = e.target.value;
                          setPreviousJobs(prev => prev.map(item => item.id === pj.id ? { ...item, companyName: val } : item));
                        }}
                        className="px-2 py-1 text-xs border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Position"
                        value={pj.position}
                        onChange={e => {
                          const val = e.target.value;
                          setPreviousJobs(prev => prev.map(item => item.id === pj.id ? { ...item, position: val } : item));
                        }}
                        className="px-2 py-1 text-xs border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white text-xs font-bold rounded-lg shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
