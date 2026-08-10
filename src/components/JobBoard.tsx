import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { JobPosting } from '../types';
import { Briefcase, Building2, MapPin, Clock, DollarSign, Plus, CheckCircle, X } from 'lucide-react';

export const JobBoard: React.FC = () => {
  const { jobs, addJob, language } = useAuth();
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [showAddJobModal, setShowAddJobModal] = useState(false);

  // Add job form state
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('Square Textiles Ltd');
  const [location, setLocation] = useState('Gazipur');
  const [jobType, setJobType] = useState<'Full-time' | 'Contract' | 'Internship'>('Full-time');
  const [experienceRequired, setExperienceRequired] = useState('3-5 Years');
  const [targetUniversity, setTargetUniversity] = useState('BUTEX / DUET Preferred');
  const [salaryRange, setSalaryRange] = useState('BDT 60,000 - 80,000');
  const [description, setDescription] = useState('');

  const handleApply = (jobId: string) => {
    if (!appliedJobIds.includes(jobId)) {
      setAppliedJobIds(prev => [...prev, jobId]);
      alert(language === 'BN' ? 'আপনার TexIn প্রোফাইল দিয়ে আবেদন সফলভাবে জমা দেয়া হয়েছে!' : 'Application submitted with your TexIn Profile!');
    }
  };

  const handleAddJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !companyName.trim()) return;

    addJob({
      title: title.trim(),
      companyName: companyName.trim(),
      factoryLogo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80',
      location: location.trim(),
      jobType,
      experienceRequired,
      targetUniversity,
      salaryRange,
      description: description.trim() || 'Textile engineering role in factory floor operations.',
      requirements: ['B.Sc. in Textile Engineering', 'Relevant factory floor experience']
    });

    setTitle('');
    setShowAddJobModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-[#005244] text-white p-6 sm:p-8 shadow-sm border border-brand-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-100 text-xs font-semibold border border-white/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{language === 'BN' ? 'টেক্সটাইল জব পোর্টাল' : 'Textile Sector Careers'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'BN'
              ? 'বাংলাদেশের শীর্ষ টেক্সটাইল কারখানার জব সার্কুলার ও নিয়োগ বিজ্ঞপ্তি'
              : 'Textile Factory Engineering & Merchandising Job Circulars'}
          </h1>
          <p className="text-sm text-brand-100/90">
            {language === 'BN'
              ? 'স্পিনিং, উইভিং, ডাইং, নিটিং, মারচেন্ডাইজিং ও ইএআই পজিশনের সরাসরি নিয়োগ।'
              : 'Direct hiring for Textile Engineers, Merchandisers, Quality Leads & Dyehouse Managers.'}
          </p>

          <button
            onClick={() => setShowAddJobModal(true)}
            className="mt-3 px-4 py-2 bg-white hover:bg-brand-50 text-[#005244] font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'BN' ? 'জব সার্কুলার পোস্ট করুন' : 'Post Job Circular'}</span>
          </button>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map(job => {
          const isApplied = appliedJobIds.includes(job.id);

          return (
            <div
              key={job.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src={job.factoryLogo}
                  alt={job.companyName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-[10px] uppercase">
                    {job.jobType}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">
                    {job.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#004182] dark:text-blue-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.companyName}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.experienceRequired}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5 font-semibold text-blue-900 dark:text-blue-300">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                  <span>{job.salaryRange}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                {job.description}
              </p>

              {job.targetUniversity && (
                <p className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/50 p-2 rounded-lg border border-blue-100 dark:border-blue-900">
                  🎓 Preference: {job.targetUniversity}
                </p>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{job.postedDate}</span>
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={isApplied}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                    isApplied
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-[#004182] hover:bg-[#003366] text-white shadow-sm'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span>{language === 'BN' ? 'আবেদন সম্পন্ন' : 'Applied'}</span>
                    </>
                  ) : (
                    <span>{language === 'BN' ? 'সহজে আবেদন করুন' : 'Apply Now'}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Job Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {language === 'BN' ? 'নতুন জব সার্কুলার প্রকাশ করুন' : 'Post Textile Job Circular'}
              </h3>
              <button onClick={() => setShowAddJobModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddJobSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Job Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Senior Dyeing Master"
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Company / Factory Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Experience Required</label>
                  <input
                    type="text"
                    value={experienceRequired}
                    onChange={e => setExperienceRequired(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Salary Range</label>
                  <input
                    type="text"
                    value={salaryRange}
                    onChange={e => setSalaryRange(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Key responsibilities and shift timings..."
                  className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
