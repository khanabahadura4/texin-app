import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UNIVERSITIES_LIST } from '../data/mockData';
import { GraduationCap, Search, Filter, Building2, MapPin, Phone, Mail, ChevronRight, Award } from 'lucide-react';

interface AlumniDirectoryProps {
  onSelectUser: (userId: string) => void;
}

export const AlumniDirectory: React.FC<AlumniDirectoryProps> = ({ onSelectUser }) => {
  const { users, language } = useAuth();

  const [selectedUniversity, setSelectedUniversity] = useState<string>('BUTEX');
  const [selectedBatch, setSelectedBatch] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentUniObj = UNIVERSITIES_LIST.find(u => u.id === selectedUniversity) || UNIVERSITIES_LIST[0];

  // Filter users by selected university
  const universityAlumni = users.filter(user => {
    const matchesUni = user.education.university === selectedUniversity ||
      user.education.universityFullName.toLowerCase().includes(selectedUniversity.toLowerCase());

    const matchesBatch = selectedBatch === 'ALL' || user.education.batchNumber.toLowerCase().includes(selectedBatch.toLowerCase());

    const matchesDept = departmentFilter === 'ALL' || user.education.department.toLowerCase().includes(departmentFilter.toLowerCase());

    const matchesSearch = !searchQuery.trim() ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.currentPosition.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesUni && matchesBatch && matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl bg-[#005244] text-white p-6 sm:p-8 shadow-sm border border-brand-800 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-100 text-xs font-semibold border border-white/20">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{language === 'BN' ? 'ভার্সিটি অ্যালুমনাই ডিরেক্টরি' : 'University Alumni Network'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'BN'
              ? 'আপনার বিশ্ববিদ্যালয় বা কলেজের সব ব্যাচমেট ও সিনিয়র-জুনিয়রদের বর্তমান কর্মস্থল'
              : 'Find University Alumni & Batchmates Across Textile Factories'}
          </h1>
          <p className="text-sm text-brand-100/90">
            {language === 'BN'
              ? 'বুটেক্স, ডুয়েট, নাইটার, এমবিএসটিইউ সহ সকল টেক্সটাইল বিশ্ববিদ্যালয় ও কলেজের গ্র্যাজুয়েটদের তালিকা দেখুন এবং যোগাযোগ রাখুন।'
              : 'Connect with alumni from BUTEX, DUET, NITER, MBSTU, AUST and see which factories they are leading today.'}
          </p>
        </div>
      </div>

      {/* University Selector Grid */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>{language === 'BN' ? 'বিশ্ববিদ্যালয় বা কলেজ বেছে নিন' : 'Select Institution'}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {UNIVERSITIES_LIST.map(u => {
            const isSelected = u.id === selectedUniversity;
            const count = users.filter(usr => usr.education.university === u.id).length;

            return (
              <button
                key={u.id}
                onClick={() => setSelectedUniversity(u.id)}
                className={`p-3 rounded-2xl border text-left transition ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-blue-700 dark:text-blue-400">{u.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold">
                    {count} {language === 'BN' ? 'জন' : 'alumni'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">{u.fullName}</p>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{u.location}</span>
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtering Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span>{currentUniObj.fullName} ({currentUniObj.name}) {language === 'BN' ? 'অ্যালুমনাই সার্চ' : 'Alumni Search'}</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {universityAlumni.length} {language === 'BN' ? 'জন রেজাল্ট পাওয়া গেছে' : 'graduates found'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Department Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {language === 'BN' ? 'ডিপার্টমেন্ট (Department)' : 'Department'}
            </label>
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              <option value="ALL">All Departments (সকল বিভাগ)</option>
              <option value="Yarn">Yarn Engineering (Spinning)</option>
              <option value="Wet Process">Wet Process Engineering (Dyeing)</option>
              <option value="Fabric">Fabric Engineering (Weaving/Knitting)</option>
              <option value="Apparel">Apparel Engineering (Garments)</option>
              <option value="TEM">Textile Engineering Management (TEM)</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              🔍 {language === 'BN' ? 'নাম, বর্তমান কোম্পানি বা পদবী দিয়ে খুঁজুন' : 'Search Name, Factory or Position'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. Tanvir / Square Textiles / Manager"
                className="w-full pl-8 pr-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Alumni Results List */}
      {universityAlumni.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">
            {language === 'BN'
              ? `${selectedUniversity} প্রতিষ্ঠানের এই ডিপার্টমেন্ট বা ফিল্টারে কোন তথ্য নেই।`
              : `No alumni found for ${selectedUniversity} with the active search query.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {universityAlumni.map(alumnus => (
            <div
              key={alumnus.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-3"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onSelectUser(alumnus.id)}
                  className="shrink-0 focus:outline-none"
                >
                  <img
                    src={alumnus.avatarUrl}
                    alt={alumnus.firstName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500/30"
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <button
                      onClick={() => onSelectUser(alumnus.id)}
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 transition truncate text-left"
                    >
                      {alumnus.firstName} {alumnus.lastName}
                    </button>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] shrink-0">
                      {alumnus.education.batchNumber}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    {alumnus.currentPosition}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{alumnus.currentCompany}</span>
                  </p>
                </div>
              </div>

              {/* Department & Education info */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-0.5 text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {alumnus.education.department}
                </p>
                <p className="text-[11px] text-slate-400">
                  Passing Year: {alumnus.education.passingYear}
                </p>
              </div>

              {/* View Profile Action */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => onSelectUser(alumnus.id)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1"
                >
                  <span>{language === 'BN' ? 'প্রোফাইল দেখুন' : 'View Profile'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
