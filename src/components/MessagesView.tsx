import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatMessage } from '../types';
import { Send, MessageCircle, Search, ArrowLeft } from 'lucide-react';

interface MessagesViewProps {
  openWithUserId: string | null;
  onSelectUser: (userId: string) => void;
  onConsumeOpenWithUserId: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  openWithUserId,
  onSelectUser,
  onConsumeOpenWithUserId
}) => {
  const { currentUser, users, conversations, sendMessage, subscribeToMessages, language } = useAuth();

  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return null;

  // If NetworkView (or a PostCard/profile) asked to open a specific person's chat, jump to it.
  useEffect(() => {
    if (openWithUserId) {
      setActiveUserId(openWithUserId);
      onConsumeOpenWithUserId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openWithUserId]);

  const conversationIdFor = (userIdA: string, userIdB: string) => [userIdA, userIdB].sort().join('_');

  const otherUserFor = (conv: (typeof conversations)[number]) => {
    const otherId = conv.participantIds.find(id => id !== currentUser.id);
    return users.find(u => u.id === otherId);
  };

  const sortedConversations = useMemo(
    () => [...conversations].sort((a, b) => (b.updatedAtISO || '').localeCompare(a.updatedAtISO || '')),
    [conversations]
  );

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return sortedConversations;
    const q = searchQuery.toLowerCase();
    return sortedConversations.filter(c => {
      const u = otherUserFor(c);
      return u && (u.firstName + ' ' + u.lastName).toLowerCase().includes(q);
    });
  }, [sortedConversations, searchQuery, users]);

  const activeUser = activeUserId ? users.find(u => u.id === activeUserId) : null;

  // Subscribe to the active conversation's message thread live.
  useEffect(() => {
    if (!activeUserId) {
      setMessages([]);
      return;
    }
    const convId = conversationIdFor(currentUser.id, activeUserId);
    const unsub = subscribeToMessages(convId, setMessages);
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUserId, currentUser.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !activeUserId) return;
    const text = draft.trim();
    setDraft('');
    await sendMessage(activeUserId, text);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 sm:grid-cols-[280px_1fr] h-[70vh] min-h-[420px]">
        {/* Conversation list */}
        <div className={`border-r border-slate-100 dark:border-slate-800 flex-col ${activeUserId ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 space-y-2">
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 px-1">
              <MessageCircle className="w-4 h-4 text-brand-600" />
              <span>{language === 'BN' ? 'মেসেজ' : 'Messages'}</span>
            </h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={language === 'BN' ? 'সার্চ করুন...' : 'Search messages'}
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8 px-4">
                {language === 'BN'
                  ? 'এখনো কোনো কথোপকথন নেই। নেটওয়ার্ক থেকে কাউকে মেসেজ পাঠিয়ে শুরু করুন।'
                  : 'No conversations yet. Message a friend from My Network to start.'}
              </p>
            ) : (
              filteredConversations.map(conv => {
                const u = otherUserFor(conv);
                if (!u) return null;
                const isActive = activeUserId === u.id;
                const isUnread = conv.lastMessageSenderId && conv.lastMessageSenderId !== currentUser.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveUserId(u.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition ${
                      isActive ? 'bg-brand-50 dark:bg-brand-950/40' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <img src={u.avatarUrl} alt={u.firstName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className={`text-[11px] truncate ${isUnread ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                        {conv.lastMessage || (language === 'BN' ? 'কথোপকথন শুরু করুন' : 'Say hello')}
                      </p>
                    </div>
                    {isUnread && <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Active chat thread */}
        <div className={`flex-col ${activeUserId ? 'flex' : 'hidden sm:flex'}`}>
          {!activeUser ? (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400 px-6 text-center">
              {language === 'BN' ? 'মেসেজ দেখতে বাম দিক থেকে একজনকে বেছে নিন।' : 'Select a conversation to start chatting.'}
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setActiveUserId(null)}
                  className="sm:hidden p-1 -ml-1 text-slate-500"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button onClick={() => onSelectUser(activeUser.id)} className="shrink-0">
                  <img src={activeUser.avatarUrl} alt={activeUser.firstName} className="w-9 h-9 rounded-full object-cover" />
                </button>
                <div className="min-w-0">
                  <button
                    onClick={() => onSelectUser(activeUser.id)}
                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-[#005244] transition text-left block truncate"
                  >
                    {activeUser.firstName} {activeUser.lastName}
                  </button>
                  <p className="text-[11px] text-slate-400 truncate">{activeUser.headline}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50 dark:bg-slate-950/20">
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">
                    {language === 'BN' ? 'এখনো কোনো মেসেজ নেই। প্রথম মেসেজটি পাঠান!' : 'No messages yet. Say hello!'}
                  </p>
                ) : (
                  messages.map(m => {
                    const isMine = m.senderId === currentUser.id;
                    return (
                      <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                            isMine
                              ? 'bg-[#005244] text-white rounded-br-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-sm'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Composer */}
              <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  placeholder={language === 'BN' ? 'একটি মেসেজ লিখুন...' : 'Write a message...'}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="p-2.5 bg-[#005244] hover:bg-[#002e26] disabled:opacity-40 text-white rounded-full shadow-sm transition shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
