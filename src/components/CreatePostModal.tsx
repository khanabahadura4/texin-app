import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AudienceVisibility } from '../types';
import { X, Image, Video, Globe, GraduationCap, Building2, Lock, Send, Layers } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, createPost, language } = useAuth();

  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [showMediaInput, setShowMediaInput] = useState<'image' | 'video' | null>(null);

  const [visibility, setVisibility] = useState<AudienceVisibility>('ANYONE');

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createPost({
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      visibility,
      targetUniversity: currentUser.education.university,
      targetFactory: currentUser.currentCompany
    });

    setContent('');
    setImageUrl('');
    setVideoUrl('');
    setShowMediaInput(null);
    setVisibility('ANYONE');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.firstName}
              className="w-10 h-10 rounded-full object-cover border border-brand-500"
            />
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                {currentUser.firstName} {currentUser.lastName}
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[240px]">
                {currentUser.headline}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Audience Visibility Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              {language === 'BN' ? 'পোস্টের ভিজিবিলিটি (ক নিবে/কে দেখতে পাবে?)' : 'Post Audience Visibility'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setVisibility('ANYONE')}
                className={`flex items-center justify-center space-x-1.5 p-2.5 rounded-xl border text-xs font-semibold transition ${
                  visibility === 'ANYONE'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Globe className="w-4 h-4 text-brand-600" />
                <span>{language === 'BN' ? 'সবাই (Anyone)' : 'Anyone'}</span>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('UNIVERSITY_ONLY')}
                className={`flex items-center justify-center space-x-1.5 p-2.5 rounded-xl border text-xs font-semibold transition ${
                  visibility === 'UNIVERSITY_ONLY'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>{currentUser.education.university} {language === 'BN' ? 'শুধু' : 'Only'}</span>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('FACTORY_ONLY')}
                className={`flex items-center justify-center space-x-1.5 p-2.5 rounded-xl border text-xs font-semibold transition ${
                  visibility === 'FACTORY_ONLY'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                <span className="truncate max-w-[100px]">{currentUser.currentCompany}</span>
              </button>
            </div>

            {/* Visibility explanation badge */}
            <div className="mt-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300 flex items-center space-x-2">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {visibility === 'ANYONE' && (language === 'BN' ? 'সব টেক্সটাইল মেম্বার ও পাবলিক ভিউয়ার এই পোস্টটি দেখতে পাবে।' : 'Visible to anyone on the TexIn network.')}
                {visibility === 'UNIVERSITY_ONLY' && (language === 'BN' ? `শুধু ${currentUser.education.university} বিশ্ববিদ্যালযয়ের অ্যালুমনাই ও ছাত্ররা দেখতে পাবে।` : `Restricted: Only alumni/students from ${currentUser.education.university} will see this.`)}
                {visibility === 'FACTORY_ONLY' && (language === 'BN' ? `শুধু ${currentUser.currentCompany} কারখানার কর্মরত অফিসাররা দেখতে পাবে।` : `Restricted: Only employees working at ${currentUser.currentCompany} will see this.`)}
              </span>
            </div>
          </div>

          {/* Text Area */}
          <div>
            <textarea
              rows={4}
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={
                language === 'BN'
                  ? 'টেক্সটাইল ফ্যাক্টরি আপডেট, ডায়িং প্যারামিটার, ইভেন্ট বা টেকনিক্যাল প্রশ্ন পোস্ট করুন...'
                  : 'Share factory updates, yarn specs, dyeing parameters, or alumni news...'
              }
              className="w-full p-3 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-slate-800 dark:text-white resize-none"
            />
          </div>

          {/* Optional Media Inputs */}
          {showMediaInput === 'image' && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'BN' ? 'ছবির ইউআরএল / ইমেজ লিংক' : 'Image URL'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowMediaInput(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-1.5 text-xs border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
              <div className="flex gap-2 pt-1 overflow-x-auto">
                <span className="text-[10px] text-slate-400 self-center">Sample images:</span>
                <button
                  type="button"
                  onClick={() => setImageUrl('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80')}
                  className="text-[10px] px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded hover:bg-brand-100"
                >
                  Spinning Machine
                </button>
                <button
                  type="button"
                  onClick={() => setImageUrl('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80')}
                  className="text-[10px] px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded hover:bg-brand-100"
                >
                  Dyehouse
                </button>
                <button
                  type="button"
                  onClick={() => setImageUrl('https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80')}
                  className="text-[10px] px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded hover:bg-brand-100"
                >
                  Denim Fabric
                </button>
              </div>
            </div>
          )}

          {showMediaInput === 'video' && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'BN' ? 'ভিডিও ইউআরএল / লিংক' : 'Video URL'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowMediaInput(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>
              <input
                type="url"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-1.5 text-xs border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>
          )}

          {/* Footer controls & Submit */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowMediaInput('image')}
                className={`p-2 rounded-lg text-xs font-medium flex items-center space-x-1 transition ${
                  showMediaInput === 'image'
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <Image className="w-4 h-4 text-brand-600" />
                <span>{language === 'BN' ? 'ছবি (Photo)' : 'Photo'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMediaInput('video')}
                className={`p-2 rounded-lg text-xs font-medium flex items-center space-x-1 transition ${
                  showMediaInput === 'video'
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <Video className="w-4 h-4 text-blue-600" />
                <span>{language === 'BN' ? 'ভিডিও (Video)' : 'Video'}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!content.trim()}
              className="px-5 py-2 bg-[#005244] hover:bg-[#002e26] disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow transition flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'BN' ? 'পোস্ট করুন' : 'Post Update'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
