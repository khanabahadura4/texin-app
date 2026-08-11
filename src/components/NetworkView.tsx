import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';
import { UserPlus, Users, Check, X, Clock, MessageCircle, GraduationCap, Building2, UserMinus } from 'lucide-react';

interface NetworkViewProps {
  onSelectUser: (userId: string) => void;
  onOpenMessage: (userId: string) => void;
}

type NetworkTab = 'suggestions' | 'requests' | 'sent' | 'friends';

export const NetworkView: React.FC<NetworkViewProps> = ({ onSelectUser, onOpenMessage }) => {
  const {
    currentUser,
    users,
    friendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    removeFriend,
    language
  } = useAuth();

  const [tab, setTab] = useState<NetworkTab>('suggestions');

  if (!currentUser) return null;

  const incomingRequests = useMemo(
    () => friendRequests.filter(r => r.status === 'PENDING' && r.toUserId === currentUser.id),
    [friendRequests, currentUser.id]
  );
  const sentRequests = useMemo(
    () => friendRequests.filter(r => r.status === 'PENDING' && r.fromUserId === currentUser.id),
    [friendRequests, currentUser.id]
  );
  const acceptedRequests = useMemo(
    () => friendRequests.filter(r => r.status === 'ACCEPTED' && (r.fromUserId === currentUser.id || r.toUserId === currentUser.id)),
    [friendRequests, currentUser.id]
  );

  const friendIds = useMemo(
    () => new Set(acceptedRequests.map(r => (r.fromUserId === currentUser.id ? r.toUserId : r.fromUserId))),
    [acceptedRequests, currentUser.id]
  );
  const pendingUserIds = useMemo(
    () =>
      new Set([
        ...incomingRequests.map(r => r.fromUserId),
        ...sentRequests.map(r => r.toUserId)
      ]),
    [incomingRequests, sentRequests]
  );

  const friends = users.filter(u => friendIds.has(u.id));

  // "People You May Know": everyone except yourself, existing friends, and pending requests.
  // Ranked with same-university / same-factory people first, like a real suggestion feed would.
  const suggestions = useMemo(() => {
    const pool = users.filter(u => u.id !== currentUser.id && !friendIds.has(u.id) && !pendingUserIds.has(u.id));
    return pool.sort((a, b) => {
      const score = (u: UserProfile) =>
        (u.education?.university === currentUser.education?.university ? 2 : 0) +
        (u.currentCompany === currentUser.currentCompany ? 1 : 0);
      return score(b) - score(a);
    });
  }, [users, currentUser, friendIds, pendingUserIds]);

  const tabs: Array<{ key: NetworkTab; label: string; count?: number }> = [
    { key: 'suggestions', label: language === 'BN' ? 'সাজেশন' : 'Suggestions' },
    { key: 'requests', label: language === 'BN' ? 'রিকোয়েস্ট' : 'Requests', count: incomingRequests.length },
    { key: 'sent', label: language === 'BN' ? 'পাঠানো হয়েছে' : 'Sent', count: sentRequests.length },
    { key: 'friends', label: language === 'BN' ? 'ফ্রেন্ডস' : 'Friends', count: friends.length }
  ];

  const UserRow: React.FC<{ user: UserProfile; children: React.ReactNode }> = ({ user, children }) => (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex items-center gap-3">
      <button onClick={() => onSelectUser(user.id)} className="shrink-0">
        <img src={user.avatarUrl} alt={user.firstName} className="w-14 h-14 rounded-full object-cover" />
      </button>
      <div className="flex-1 min-w-0">
        <button
          onClick={() => onSelectUser(user.id)}
          className="font-bold text-sm text-slate-900 dark:text-white hover:text-[#005244] transition text-left block truncate"
        >
          {user.firstName} {user.lastName}
        </button>
        <p className="text-xs text-slate-500 line-clamp-1">{user.headline}</p>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <GraduationCap className="w-3 h-3" /> {user.education?.university}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3" /> {user.currentCompany}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">{children}</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
        <Users className="w-5 h-5 text-brand-600" />
        <span>{language === 'BN' ? 'নেটওয়ার্ক' : 'My Network'}</span>
      </h1>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 min-w-[100px] py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              tab === t.key
                ? 'bg-[#005244] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>{t.label}</span>
            {!!t.count && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  tab === t.key ? 'bg-white/25 text-white' : 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-400'
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SUGGESTIONS */}
      {tab === 'suggestions' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.length === 0 ? (
            <p className="text-xs text-slate-500 col-span-2 text-center py-8">
              {language === 'BN' ? 'আপাতত কোনো সাজেশন নেই।' : 'No suggestions right now.'}
            </p>
          ) : (
            suggestions.map(u => (
              <UserRow key={u.id} user={u}>
                <button
                  onClick={() => sendFriendRequest(u.id)}
                  className="px-3 py-1.5 bg-[#005244] hover:bg-[#002e26] text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{language === 'BN' ? 'অ্যাড ফ্রেন্ড' : 'Add Friend'}</span>
                </button>
              </UserRow>
            ))
          )}
        </div>
      )}

      {/* INCOMING REQUESTS */}
      {tab === 'requests' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {incomingRequests.length === 0 ? (
            <p className="text-xs text-slate-500 col-span-2 text-center py-8">
              {language === 'BN' ? 'কোনো ফ্রেন্ড রিকোয়েস্ট নেই।' : 'No pending friend requests.'}
            </p>
          ) : (
            incomingRequests.map(r => {
              const u = users.find(usr => usr.id === r.fromUserId);
              if (!u) return null;
              return (
                <UserRow key={r.id} user={u}>
                  <button
                    onClick={() => acceptFriendRequest(r.id)}
                    title={language === 'BN' ? 'গ্রহণ করুন' : 'Accept'}
                    className="p-2 bg-[#005244] hover:bg-[#002e26] text-white rounded-lg shadow-sm transition"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => declineFriendRequest(r.id)}
                    title={language === 'BN' ? 'বাতিল করুন' : 'Decline'}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </UserRow>
              );
            })
          )}
        </div>
      )}

      {/* SENT REQUESTS */}
      {tab === 'sent' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sentRequests.length === 0 ? (
            <p className="text-xs text-slate-500 col-span-2 text-center py-8">
              {language === 'BN' ? 'কোনো পাঠানো রিকোয়েস্ট নেই।' : "You haven't sent any requests."}
            </p>
          ) : (
            sentRequests.map(r => {
              const u = users.find(usr => usr.id === r.toUserId);
              if (!u) return null;
              return (
                <UserRow key={r.id} user={u}>
                  <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 mr-1">
                    <Clock className="w-3.5 h-3.5" />
                    {language === 'BN' ? 'পেন্ডিং' : 'Pending'}
                  </span>
                  <button
                    onClick={() => cancelFriendRequest(r.id)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs rounded-lg transition"
                  >
                    {language === 'BN' ? 'বাতিল' : 'Cancel'}
                  </button>
                </UserRow>
              );
            })
          )}
        </div>
      )}

      {/* FRIENDS */}
      {tab === 'friends' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {friends.length === 0 ? (
            <p className="text-xs text-slate-500 col-span-2 text-center py-8">
              {language === 'BN' ? 'এখনো কোনো ফ্রেন্ড নেই।' : 'No friends yet — try the Suggestions tab.'}
            </p>
          ) : (
            friends.map(u => (
              <UserRow key={u.id} user={u}>
                <button
                  onClick={() => onOpenMessage(u.id)}
                  title={language === 'BN' ? 'মেসেজ পাঠান' : 'Message'}
                  className="p-2 bg-[#005244] hover:bg-[#002e26] text-white rounded-lg shadow-sm transition"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeFriend(u.id)}
                  title={language === 'BN' ? 'আনফ্রেন্ড' : 'Unfriend'}
                  className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-500 hover:text-red-600 rounded-lg transition"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </UserRow>
            ))
          )}
        </div>
      )}
    </div>
  );
};
