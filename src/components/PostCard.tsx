import React, { useState } from 'react';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { Globe, GraduationCap, Building2, Heart, MessageSquare, Share2, Bookmark, Send, ShieldCheck } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onViewProfile?: (userId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onViewProfile }) => {
  const { currentUser, likePost, addComment, language } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  if (!currentUser) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  // Render Audience Badge based on post visibility settings
  const renderVisibilityBadge = () => {
    if (post.visibility === 'UNIVERSITY_ONLY') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <GraduationCap className="w-3 h-3 text-blue-600" />
          <span>🎓 Visible to: {post.targetUniversity || post.authorUniversity} Only</span>
        </span>
      );
    }
    if (post.visibility === 'FACTORY_ONLY') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Building2 className="w-3 h-3 text-amber-600" />
          <span>🏢 Visible to: {post.targetFactory || post.authorCompany} Employees Only</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
        <Globe className="w-3 h-3 text-slate-400" />
        <span>🌐 {language === 'BN' ? 'সবাই (Public)' : 'Anyone'}</span>
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-md">
      {/* Post Top Header */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <button
              onClick={() => onViewProfile && onViewProfile(post.authorId)}
              className="relative shrink-0 group focus:outline-none"
            >
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 group-hover:border-brand-600 transition"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-600 rounded-full border-2 border-white dark:border-slate-900" />
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewProfile && onViewProfile(post.authorId)}
                  className="font-bold text-sm text-slate-900 dark:text-white hover:text-[#005244] dark:hover:text-brand-400 transition text-left"
                >
                  {post.authorName}
                </button>
                <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {post.authorHeadline}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-[11px] text-slate-400">{post.createdAt}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                {renderVisibilityBadge()}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-3 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* Post Image Media */}
      {post.imageUrl && (
        <div className="mt-1 bg-slate-950 overflow-hidden max-h-96">
          <img
            src={post.imageUrl}
            alt="Post Attachment"
            className="w-full h-full object-cover max-h-96 hover:scale-105 transition duration-500"
          />
        </div>
      )}

      {/* Video Media (if video URL provided) */}
      {post.videoUrl && (
        <div className="mt-1 bg-slate-950 p-2">
          {post.videoUrl.includes('youtube') || post.videoUrl.includes('youtu.be') ? (
            <div className="aspect-video w-full rounded-xl overflow-hidden">
              <iframe
                src={post.videoUrl.replace('watch?v=', 'embed/')}
                title="Post Video"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              src={post.videoUrl}
              controls
              className="w-full max-h-80 rounded-xl"
            />
          )}
        </div>
      )}

      {/* Post Stats */}
      <div className="px-5 py-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20">
        <div className="flex items-center space-x-1">
          <span className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center text-white text-[10px] font-bold">
            👍
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{post.likes}</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline"
          >
            {post.comments.length} {language === 'BN' ? 'কমেন্ট' : 'comments'}
          </button>
          <span>•</span>
          <span>{post.reposts} {language === 'BN' ? 'শেয়ার' : 'reposts'}</span>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="px-3 py-1.5 flex items-center justify-around border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <button
          onClick={() => likePost(post.id)}
          className={`flex items-center space-x-1.5 py-2 px-3 rounded-xl transition ${
            post.likedByCurrentUser
              ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 font-bold'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.likedByCurrentUser ? 'fill-current text-rose-600' : ''}`} />
          <span>{post.likedByCurrentUser ? (language === 'BN' ? 'লাইকড' : 'Liked') : (language === 'BN' ? 'লাইক' : 'Like')}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1.5 py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <span>{language === 'BN' ? 'কমেন্ট' : 'Comment'}</span>
        </button>

        <button
          onClick={() => alert('Post link copied to clipboard!')}
          className="flex items-center space-x-1.5 py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Share2 className="w-4 h-4 text-brand-500" />
          <span>{language === 'BN' ? 'শেয়ার' : 'Repost'}</span>
        </button>

        <button
          onClick={() => alert('Post saved to bookmarks')}
          className="flex items-center space-x-1.5 py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Bookmark className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">{language === 'BN' ? 'সেভ' : 'Save'}</span>
        </button>
      </div>

      {/* Comment Section Drawer */}
      {showComments && (
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* Add Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.firstName}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-brand-500">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder={language === 'BN' ? 'আপনার মন্তব্য লিখুন...' : 'Add a comment...'}
                className="w-full bg-transparent text-xs focus:outline-none dark:text-white"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="p-1 text-brand-600 disabled:text-slate-300 dark:disabled:text-slate-700"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-2.5 pt-1">
            {post.comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-2">
                {language === 'BN' ? 'এখনো কোন মন্তব্য করা হয়নি। প্রথম কমেন্টটি করুন!' : 'No comments yet. Be the first to comment!'}
              </p>
            ) : (
              post.comments.map(c => (
                <div key={c.id} className="flex items-start space-x-2.5">
                  <img
                    src={c.authorAvatar}
                    alt={c.authorName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 bg-white dark:bg-slate-800/90 rounded-2xl p-2.5 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{c.authorName}</span>
                      <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">{c.authorHeadline}</p>
                    <p className="text-slate-800 dark:text-slate-200">{c.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
