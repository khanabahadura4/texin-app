import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UNIVERSITIES_LIST } from '../data/mockData';
import { FactoryInfo, UserProfile } from '../types';
import { Building2, Search, Filter, GraduationCap, MapPin, Briefcase, Phone, Mail, ChevronRight, Plus, Users, Sparkles, X, CheckCircle2 } from 'lucide-react';

interface FactoryDirectoryProps {
  onSelectUser: (userId: string) => void;
}

export const FactoryDirectory: React.FC<FactoryDirectoryProps> = ({ onSelectUser }) => {
  const { factories, users, addFactory, language } = useAuth();

  const [selectedFactoryId, setSelectedFactoryId] = useState<string>(factories[0]?.id || '');
  const [selectedUniversityFilter, setSelectedUniversityFilter] = useState<string>('ALL');
  const [batchFilter, setBatchFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedContactUser, setSelectedContactUser] = useState<UserProfile | null>(null);
  const [showAddFactoryModal, setShowAddFactoryModal] = useState<boolean>(false);

  // New factory modal state
  const [newFacName, setNewFacName] = useState('');
  const [newFacCode, setNewFacCode] = useState('');
  const [newFacCategory, setNewFacCategory] = useState<'Spinning' | 'Composite' | 'Apparel/Garments' | 'Dyeing & Printing' | 'Denim/Woven' | 'Accessories'>('Composite');
  const [newFacLocation, setNewFacLocation] = useState('');
  const [newFacEst, setNewFacEst] = useState('');
  const [newFacDesc, setNewFacDesc] = useState('');

  const currentFactory = factories.find(f => f.id === selectedFactoryId) || factories[0];

  // Employees working at current selected factory
  const factoryEmployees = users.filter(user => {
    const isAtFactory = user.currentCompany.toLowerCase().includes(currentFactory?.codeName.toLowerCase() || '') ||
      user.currentCompany.toLowerCase().includes(currentFactory?.name.toLowerCase() || '');

    const matchesUniversity = selectedUniversityFilter === 'ALL' || user.education.university === selectedUniversityFilter;

    const matchesBatch = !batchFilter.trim() || user.education.batchNumber.toLowerCase().includes(batchFilter.toLowerCase());

    const matchesSearch = !searchQuery.trim() ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.currentPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.currentDepartment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.education.university.toLowerCase().includes(searchQuery.toLowerCase());

    return isAtFactory && matchesUniversity && matchesBatch && matchesSearch;
  });

  const handleAddFactorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacName.trim()) return;

    addFactory({
      name: newFacName.trim(),
      codeName: newFacCode.trim() || newFacName.trim(),
      category: newFacCategory,
      location: newFacLocation.trim() || 'Dhaka, Bangladesh',
      establishedYear: newFacEst.trim() || '2000',
      totalEmployees: 1000,
      description: newFacDesc.trim() || 'Textile manufacturing factory in Bangladesh.',
      logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80'
    });

    setNewFacName('');
    setNewFacCode('');
    setShowAddFactoryModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative rounded-xl bg-[#005244] text-white p-6 sm:p-8 shadow-sm overflow-hidden border border-brand-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-100 text-xs font-semibold mb-3 border border-white/20">
            <Building2 className="w-3.5 h-3.5" />
            <span>{language === 'BN' ? 'ফ্যাক্টরি ও অ্যালুমনাই ডিরেক্টরি' : 'Factory & Alumni Directory'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'BN'
              ? 'যেকোনো টেক্সটাইল কারখানায় কোন বিশ্ববিদ্যালয় বা কলেজের কে কোন পদে কর্মরত আছেন খুঁজুন'
              : 'Find University Alumni & Employees at Any Textile Factory'}
          </h1>
          <p className="mt-2 text-sm text-brand-100/90 leading-relaxed">
            {language === 'BN'
              ? 'স্কয়ার টেক্সটাইল, বেক্সিমকো, ডিবিএল, এনভয় সহ বাংলাদেশের শীর্ষ টেক্সটাইল মিলগুলোতে বুটেক্স, ডুয়েট, নাইটার ও অন্যান্য ইন্সটিটিউটের সিনিয়র-জুনিয়রদের অবস্থান জানুন।'
              : 'Explore alumni networks across major textile factories (Square, Beximco, DBL, Envoy, Pacific Jeans) categorized by University, Batch, and Designation.'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddFactoryModal(true)}
              className="px-4 py-2 bg-white hover:bg-brand-50 text-[#005244] font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'BN' ? 'নতুন কারখানার তথ্য যোগ করুন' : 'Add New Factory'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Factory Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            <span>{language === 'BN' ? 'কারখানা নির্বাচন করুন (Select Textile Factory)' : 'Select Factory'}</span>
          </h2>
          <span className="text-xs text-slate-500">
            {factories.length} {language === 'BN' ? 'টি কারখানা নিবন্ধিত' : 'Factories listed'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {factories.map(f => {
            const isSelected = f.id === currentFactory.id;
            const empCount = users.filter(u =>
              u.currentCompany.toLowerCase().includes(f.codeName.toLowerCase()) ||
              u.currentCompany.toLowerCase().includes(f.name.toLowerCase())
            ).length;

            return (
              <button
                key={f.id}
                onClick={() => setSelectedFactoryId(f.id)}
                className={`p-3 rounded-2xl border text-left transition relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/60 ring-2 ring-brand-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 mb-2">
                    <img src={f.logoUrl} alt={f.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {f.codeName}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{f.category}</p>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-brand-700 dark:text-brand-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {empCount} {language === 'BN' ? 'জন' : 'alumni'}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Factory Detail Header */}
      {currentFactory && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="h-32 sm:h-40 relative">
            <img src={currentFactory.bannerUrl} alt={currentFactory.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
              <div className="flex items-center space-x-4">
                <img
                  src={currentFactory.logoUrl}
                  alt={currentFactory.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg bg-white"
                />
                <div>
                  <h2 className="text-xl font-bold">{currentFactory.name}</h2>
                  <p className="text-xs text-slate-200 flex items-center gap-2 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-400" />
                    <span>{currentFactory.location}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-brand-500/30 text-brand-300 font-semibold text-[10px]">
                      {currentFactory.category}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentFactory.description}
            </p>
          </div>
        </div>
      )}

      {/* FILTER BAR FOR FINDING SPECIFIC COLLEGE/UNIVERSITY MEMBERS */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-600" />
              <span>
                {language === 'BN'
                  ? `${currentFactory.name} এ নিয়োজিত ইঞ্জিনিয়ার ও অফিসার ফিল্টার`
                  : `Filter Employees at ${currentFactory.codeName}`}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'BN'
                ? 'কলেজ/বিশ্ববিদ্যালয়, ব্যাচ ও পদবী সিলেক্ট করে সুনির্দিষ্ট ব্যক্তিকে খুজে বের করুন'
                : 'Narrow down employees by university alumni network, batch number, or position.'}
            </p>
          </div>

          <span className="px-3 py-1 bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 text-xs font-bold rounded-full self-start sm:self-auto">
            {factoryEmployees.length} {language === 'BN' ? 'জন কর্মকর্তা পাওয়া গেছে' : 'matches found'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* University / College Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              🎓 {language === 'BN' ? 'বিশ্ববিদ্যালয় / কলেজ (College/University)' : 'University / College'}
            </label>
            <select
              value={selectedUniversityFilter}
              onChange={e => setSelectedUniversityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium border rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              <option value="ALL">All Universities & Colleges (সব শিক্ষা প্রতিষ্ঠান)</option>
              {UNIVERSITIES_LIST.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} - {u.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Batch Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              🏷️ {language === 'BN' ? 'ব্যাচ নাম্বার (Batch Number)' : 'Batch Number'}
            </label>
            <input
              type="text"
              value={batchFilter}
              onChange={e => setBatchFilter(e.target.value)}
              placeholder="e.g. 40th Batch / 2018"
              className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              🔍 {language === 'BN' ? 'নাম বা পদবী দিয়ে খুঁজুন (Name / Role)' : 'Search Name / Designation'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. Merchandiser / Tanvir"
                className="w-full pl-8 pr-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* EMPLOYEE LIST GRID */}
      {factoryEmployees.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">
            {language === 'BN'
              ? 'এই ফিল্টারে কোনো কর্মকর্তা বা অ্যালুমনাই পাওয়া যায়নি'
              : 'No employees matched your specific filters'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {language === 'BN'
              ? 'বিশ্ববিদ্যালয় বা ব্যাচ ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন অথবা নতুন প্রোফাইল তৈরি করুন।'
              : 'Try clearing the university or batch search filter to see all employees working at this factory.'}
          </p>
          <button
            onClick={() => {
              setSelectedUniversityFilter('ALL');
              setBatchFilter('');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-semibold text-xs rounded-xl hover:bg-brand-200 transition"
          >
            {language === 'BN' ? 'সব ফিল্টার রিসেট করুন' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factoryEmployees.map(emp => (
            <div
              key={emp.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-4 relative"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onSelectUser(emp.id)}
                  className="shrink-0 focus:outline-none"
                >
                  <img
                    src={emp.avatarUrl}
                    alt={emp.firstName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500/30"
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <button
                      onClick={() => onSelectUser(emp.id)}
                      className="font-bold text-base text-slate-900 dark:text-white hover:text-brand-600 transition truncate text-left"
                    >
                      {emp.firstName} {emp.lastName}
                    </button>
                    <span className="px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 font-extrabold text-[10px] shrink-0">
                      🎓 {emp.education.university}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                    {emp.currentPosition}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.currentCompany} ({emp.currentDepartment})</span>
                  </p>
                </div>
              </div>

              {/* Education & Batch Info Pill */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    {emp.education.universityFullName || emp.education.university}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{emp.education.batchNumber}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {language === 'BN' ? 'ডিপার্টমেন্ট:' : 'Dept:'} {emp.education.department} ({emp.education.passingYear})
                </p>
              </div>

              {/* Previous Experience Summary */}
              {emp.previousJobs && emp.previousJobs.length > 0 && (
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {language === 'BN' ? 'পূর্ববর্তী অভিজ্ঞতা (Previous Job History)' : 'Previous Positions'}
                  </span>
                  <div className="space-y-1">
                    {emp.previousJobs.map(pj => (
                      <div key={pj.id} className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                          • {pj.position} @ {pj.companyName}
                        </span>
                        <span className="text-slate-400 text-[10px]">{pj.startDate} - {pj.endDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onSelectUser(emp.id)}
                  className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1"
                >
                  <span>{language === 'BN' ? 'সম্পূর্ণ প্রোফাইল দেখুন' : 'View Full Profile'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setSelectedContactUser(emp)}
                  className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-600" />
                  <span>{language === 'BN' ? 'যোগাযোগ' : 'Contact'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTACT INFORMATION MODAL */}
      {selectedContactUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <img src={selectedContactUser.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedContactUser.firstName} {selectedContactUser.lastName}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedContactUser.currentPosition}</p>
                </div>
              </div>
              <button onClick={() => setSelectedContactUser(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-xl border border-brand-200 dark:border-brand-800 flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-600" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Mobile Number</span>
                  <a href={`tel:${selectedContactUser.mobileNumber}`} className="text-sm font-bold text-brand-700 dark:text-brand-300 hover:underline">
                    {selectedContactUser.mobileNumber}
                  </a>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                  <a href={`mailto:${selectedContactUser.email}`} className="text-sm font-bold text-blue-700 dark:text-blue-300 hover:underline">
                    {selectedContactUser.email}
                  </a>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedContactUser(null)}
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl"
            >
              {language === 'BN' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* ADD NEW FACTORY MODAL */}
      {showAddFactoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-600" />
                <span>{language === 'BN' ? 'নতুন টেক্সটাইল কারখানার তথ্য যোগ করুন' : 'Add New Textile Factory'}</span>
              </h3>
              <button onClick={() => setShowAddFactoryModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFactorySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Factory Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newFacName}
                  onChange={e => setNewFacName(e.target.value)}
                  placeholder="e.g. Epyllion Composite Textiles Ltd"
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Short / Display Name
                  </label>
                  <input
                    type="text"
                    value={newFacCode}
                    onChange={e => setNewFacCode(e.target.value)}
                    placeholder="e.g. Epyllion Group"
                    className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newFacCategory}
                    onChange={e => setNewFacCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    <option value="Spinning">Spinning</option>
                    <option value="Composite">Composite</option>
                    <option value="Apparel/Garments">Apparel/Garments</option>
                    <option value="Dyeing & Printing">Dyeing & Printing</option>
                    <option value="Denim/Woven">Denim/Woven</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newFacLocation}
                    onChange={e => setNewFacLocation(e.target.value)}
                    placeholder="e.g. Gazipur / Narayanganj"
                    className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Established Year
                  </label>
                  <input
                    type="text"
                    value={newFacEst}
                    onChange={e => setNewFacEst(e.target.value)}
                    placeholder="e.g. 2002"
                    className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={newFacDesc}
                  onChange={e => setNewFacDesc(e.target.value)}
                  placeholder="State-of-the-art knitwear & dyeing unit..."
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFactoryModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold shadow"
                >
                  Save Factory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
