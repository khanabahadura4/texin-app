import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile, Post, Comment, FactoryInfo, JobPosting, AudienceVisibility } from '../types';
import { INITIAL_FACTORIES, INITIAL_JOBS } from '../data/mockData';

interface AuthContextType {
  currentUser: UserProfile | null;
  authReady: boolean;
  users: UserProfile[];
  factories: FactoryInfo[];
  posts: Post[];
  jobs: JobPosting[];
  language: 'BN' | 'EN';
  toggleLanguage: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUpUser: (
    newProfileData: Omit<UserProfile, 'id' | 'connectionsCount'>,
    password: string
  ) => Promise<void>;
  updateProfile: (updated: UserProfile) => Promise<void>;
  createPost: (postData: {
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    visibility: AudienceVisibility;
    targetUniversity?: string;
    targetFactory?: string;
  }) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  addComment: (postId: string, commentText: string) => Promise<void>;
  addFactory: (factoryData: Omit<FactoryInfo, 'id'>) => Promise<void>;
  addJob: (jobData: Omit<JobPosting, 'id' | 'postedDate'>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [factories, setFactories] = useState<FactoryInfo[]>(INITIAL_FACTORIES);
  const [posts, setPosts] = useState<Post[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>(INITIAL_JOBS);

  const [language, setLanguage] = useState<'BN' | 'EN'>(() => {
    const saved = localStorage.getItem('texin_lang');
    return (saved as 'BN' | 'EN') || 'BN';
  });

  useEffect(() => {
    localStorage.setItem('texin_lang', language);
  }, [language]);

  const toggleLanguage = () => setLanguage(prev => (prev === 'BN' ? 'EN' : 'BN'));

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('texin_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    localStorage.setItem('texin_dark_mode', String(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Track Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setFirebaseUser(user);
      setAuthReady(true);
      if (!user) setCurrentUser(null);
    });
    return unsub;
  }, []);

  // Live-sync current user's profile doc from Firestore
  useEffect(() => {
    if (!firebaseUser) return;
    const unsub = onSnapshot(doc(db, 'users', firebaseUser.uid), snap => {
      if (snap.exists()) {
        setCurrentUser({ id: snap.id, ...(snap.data() as Omit<UserProfile, 'id'>) });
      }
    });
    return unsub;
  }, [firebaseUser]);

  // Live-sync all users (for directory / alumni search)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<UserProfile, 'id'>) })));
    });
    return unsub;
  }, []);

  // Live-sync posts, newest first
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAtISO', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Post, 'id'>) })));
    });
    return unsub;
  }, []);

  // Live-sync factories (falls back to bundled seed list if Firestore is empty)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'factories'), snap => {
      if (snap.empty) {
        setFactories(INITIAL_FACTORIES);
      } else {
        setFactories(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<FactoryInfo, 'id'>) })));
      }
    });
    return unsub;
  }, []);

  // Live-sync job postings
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'jobs'), snap => {
      if (snap.empty) {
        setJobs(INITIAL_JOBS);
      } else {
        setJobs(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<JobPosting, 'id'>) })));
      }
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const signUpUser = async (
    newProfileData: Omit<UserProfile, 'id' | 'connectionsCount'>,
    password: string
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, newProfileData.email, password);
    const newUser: Omit<UserProfile, 'id'> = {
      ...newProfileData,
      connectionsCount: 1
    };
    await setDoc(doc(db, 'users', cred.user.uid), newUser);
  };

  const updateProfile = async (updated: UserProfile) => {
    const { id, ...rest } = updated;
    await setDoc(doc(db, 'users', id), rest, { merge: true });
  };

  const createPost = async (postData: {
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    visibility: AudienceVisibility;
    targetUniversity?: string;
    targetFactory?: string;
  }) => {
    if (!currentUser) return;
    const newPost: Omit<Post, 'id'> & { createdAtISO: string } = {
      authorId: currentUser.id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      authorAvatar:
        currentUser.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      authorHeadline: currentUser.headline || `${currentUser.currentPosition} at ${currentUser.currentCompany}`,
      authorUniversity: currentUser.education.university,
      authorCompany: currentUser.currentCompany,
      content: postData.content,
      imageUrl: postData.imageUrl,
      videoUrl: postData.videoUrl,
      visibility: postData.visibility,
      targetUniversity:
        postData.visibility === 'UNIVERSITY_ONLY'
          ? postData.targetUniversity || currentUser.education.university
          : undefined,
      targetFactory:
        postData.visibility === 'FACTORY_ONLY'
          ? postData.targetFactory || currentUser.currentCompany
          : undefined,
      createdAt: 'Just now',
      createdAtISO: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      reposts: 0,
      comments: []
    };
    await addDoc(collection(db, 'posts'), newPost);
  };

  const likePost = async (postId: string) => {
    if (!currentUser) return;
    const target = posts.find(p => p.id === postId);
    if (!target) return;
    const alreadyLiked = (target.likedBy || []).includes(currentUser.id);
    await updateDoc(doc(db, 'posts', postId), {
      likedBy: alreadyLiked ? arrayRemove(currentUser.id) : arrayUnion(currentUser.id),
      likes: alreadyLiked ? Math.max(0, (target.likes || 0) - 1) : (target.likes || 0) + 1
    });
  };

  const addComment = async (postId: string, commentText: string) => {
    if (!commentText.trim() || !currentUser) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      authorId: currentUser.id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      authorAvatar: currentUser.avatarUrl,
      authorHeadline: currentUser.headline,
      content: commentText.trim(),
      createdAt: 'Just now',
      likes: 0
    };
    await updateDoc(doc(db, 'posts', postId), {
      comments: arrayUnion(newComment)
    });
  };

  const addFactory = async (factoryData: Omit<FactoryInfo, 'id'>) => {
    await addDoc(collection(db, 'factories'), factoryData);
  };

  const addJob = async (jobData: Omit<JobPosting, 'id' | 'postedDate'>) => {
    await addDoc(collection(db, 'jobs'), { ...jobData, postedDate: 'Just now' });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authReady,
        users,
        factories,
        posts,
        jobs,
        language,
        toggleLanguage,
        darkMode,
        toggleDarkMode,
        login,
        logout,
        signUpUser,
        updateProfile,
        createPost,
        likePost,
        addComment,
        addFactory,
        addJob
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
