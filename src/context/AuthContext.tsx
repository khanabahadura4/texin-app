import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
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
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  signUpUser: (
    newProfileData: Omit<UserProfile, 'id' | 'connectionsCount'>,
    password: string,
    avatarFile?: File | null
  ) => Promise<void>;
  updateProfile: (updated: UserProfile) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  uploadCoverImage: (file: File) => Promise<string>;
  uploadPostImage: (file: File) => Promise<string>;
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

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('You must be logged in to change your password.');
    }
    // Firebase requires a fresh login before allowing a sensitive op like updatePassword.
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
  };

  // Generic helper: upload a File to Firebase Storage at `path` and return its public URL.
  const uploadFileToStorage = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!firebaseUser) throw new Error('Not logged in');
    return uploadFileToStorage(file, `avatars/${firebaseUser.uid}/${Date.now()}-${file.name}`);
  };

  const uploadCoverImage = async (file: File): Promise<string> => {
    if (!firebaseUser) throw new Error('Not logged in');
    return uploadFileToStorage(file, `covers/${firebaseUser.uid}/${Date.now()}-${file.name}`);
  };

  const uploadPostImage = async (file: File): Promise<string> => {
    if (!firebaseUser) throw new Error('Not logged in');
    return uploadFileToStorage(file, `posts/${firebaseUser.uid}/${Date.now()}-${file.name}`);
  };

  const signUpUser = async (
    newProfileData: Omit<UserProfile, 'id' | 'connectionsCount'>,
    password: string,
    avatarFile?: File | null
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, newProfileData.email, password);

    let avatarUrl = newProfileData.avatarUrl;
    if (avatarFile) {
      try {
        avatarUrl = await uploadFileToStorage(avatarFile, `avatars/${cred.user.uid}/${Date.now()}-${avatarFile.name}`);
      } catch (err) {
        // Non-fatal: keep the fallback avatar URL if the photo upload fails.
        console.error('Avatar upload failed during sign up:', err);
      }
    }

    const newUser: Omit<UserProfile, 'id'> = {
      ...newProfileData,
      avatarUrl,
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
    if (!currentUser) throw new Error('You must be logged in to post.');

    const newPost: Record<string, unknown> = {
      authorId: currentUser.id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      authorAvatar:
        currentUser.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      authorHeadline: currentUser.headline || `${currentUser.currentPosition} at ${currentUser.currentCompany}`,
      authorUniversity: currentUser.education.university,
      authorCompany: currentUser.currentCompany,
      content: postData.content,
      visibility: postData.visibility,
      createdAt: 'Just now',
      createdAtISO: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      reposts: 0,
      comments: []
    };

    // IMPORTANT: Firestore rejects `undefined` field values with a thrown error.
    // Only attach optional fields when they actually have a value.
    if (postData.imageUrl) newPost.imageUrl = postData.imageUrl;
    if (postData.videoUrl) newPost.videoUrl = postData.videoUrl;
    if (postData.visibility === 'UNIVERSITY_ONLY') {
      newPost.targetUniversity = postData.targetUniversity || currentUser.education.university;
    }
    if (postData.visibility === 'FACTORY_ONLY') {
      newPost.targetFactory = postData.targetFactory || currentUser.currentCompany;
    }

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
        resetPassword,
        changePassword,
        signUpUser,
        updateProfile,
        uploadAvatar,
        uploadCoverImage,
        uploadPostImage,
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
