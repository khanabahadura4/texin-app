import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AudienceVisibility } from '../types';
import { X, Image, Video, Globe, GraduationCap, Building2, Lock, Send, Layers, Upload, Loader2, AlertCircle } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, createPost, uploadPostImage, language } = useAuth();

  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [showMediaInput, setShowMediaInput] = useState<'image' | 'video' | null>(null);

  const [visibility, setVisibility] = useState<AudienceVisibility>('ANYONE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !currentUser) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg(language === 'BN' ? 'শুধুমাত্র ছবি ফাইল আপলোড করা যাবে।' : 'Only image files can be uploaded.');
      return;
    }
    setErrorMsg('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setContent('');
    handleRemoveImage();
    setVideoUrl('');
    setShowMediaInput(null);
    setVisibility('ANYONE');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      let uploadedImageUrl: string | undefined;
      if (imageFile) {
        uploadedImageUrl = await uploadPostImage(imageFile);
      }

      await createPost({
        content: content.trim(),
        imageUrl: uploadedImageUrl,
        videoUrl: videoUrl.trim() || undefined,
        visibility,
        targetUniversity: currentUser.education.university,
        targetFactory: currentUser.currentCompany
      });

      resetForm();
      onClose();
    } catch (err: any) {
      console.error('Post creation failed:', err);
      setErrorMsg(
        err?.message ||
          (language === 'BN' ? 'পোস্ট করা যায়নি। আবার চেষ্টা করুন।' : 'Could not create the post. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
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
            onClick={() => {
              resetForm();
              onClose();
            }}
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
                  {language === 'BN' ? 'ডিভাইস থেকে ছবি আপলোড করুন' : 'Upload a photo from your device'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowMediaInput(null);
                    handleRemoveImage();
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
                id="post-image-upload"
              />

              {!imagePreview ? (
                <label
                  htmlFor="post-image-upload"
                  className="flex flex-col items-center justify-center gap-1.5 py-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-brand-500 hover:bg-brand-50/40 dark:hover:bg-brand-950/20 transition"
                >
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">
                    {language === 'BN' ? 'ছবি বেছে নিতে ক্লিক করুন' : 'Click to choose a photo'}
                  </span>
                </label>
              ) : (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-56 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
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

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Footer controls & Submit */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowMediaInput(prev => (prev === 'image' ? null : 'image'))}
                className={`p-2 rounded-lg text-xs font-medium flex items-center space-x-1 transition ${
                  showMediaInput === 'image' || imagePreview
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <Image className="w-4 h-4 text-brand-600" />
                <span>{language === 'BN' ? 'ছবি (Photo)' : 'Photo'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMediaInput(prev => (prev === 'video' ? null : 'video'))}
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
              disabled={!content.trim() || isSubmitting}
              className="px-5 py-2 bg-[#005244] hover:bg-[#002e26] disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow transition flex items-center space-x-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>
                {isSubmitting
                  ? (language === 'BN' ? 'পোস্ট হচ্ছে...' : 'Posting...')
                  : (language === 'BN' ? 'পোস্ট করুন' : 'Post Update')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
