import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError } from '../../lib/utils';
import { Settings2, User as UserIcon, ShieldAlert } from 'lucide-react';

interface AppUser {
  role: 'admin' | 'client';
  email: string;
  displayName: string;
  status: 'prospect' | 'agreed' | 'lost' | 'active';
  createdAt: any;
}

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  enableDemoMode: (role: 'admin' | 'client') => void;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState<'admin' | 'client' | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser && !demoMode) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          
          if (userSnap.exists()) {
            setAppUser(userSnap.data() as AppUser);
          } else {
            // Check if it's the admin
            const isOwner = firebaseUser.email === 'vishstudio.ltd@gmail.com';
            const newUser: Omit<AppUser, 'createdAt'> & { createdAt: any } = {
              role: isOwner ? 'admin' : 'client',
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              status: isOwner ? 'active' : 'prospect',
              createdAt: serverTimestamp()
            };
            
            await setDoc(userDocRef, newUser);
            setAppUser(newUser as AppUser);
          }
        } catch (error) {
          handleFirestoreError(error, 'get', 'users/me');
        }
      } else if (!demoMode) {
        setAppUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [demoMode]);

  const login = async () => {
    try {
      setDemoMode(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    setDemoMode(null);
    await signOut(auth);
  };

  const enableDemoMode = (role: 'admin' | 'client') => {
    setDemoMode(role);
  };

  const effectiveUser = demoMode ? ({ uid: `demo_${demoMode}`, email: `demo@${demoMode}.com`, displayName: `Demo ${demoMode === 'admin' ? 'Admin' : 'Client'}` } as User) : user;
  
  const effectiveAppUser = demoMode ? ({
      role: demoMode,
      email: `demo@${demoMode}.com`,
      displayName: `Demo ${demoMode === 'admin' ? 'Admin' : 'Client'}`,
      status: 'active',
      createdAt: new Date()
  } as AppUser) : appUser;

  return (
    <AuthContext.Provider value={{ 
      user: effectiveUser, 
      appUser: effectiveAppUser, 
      loading: loading && !demoMode, 
      login, 
      logout,
      enableDemoMode,
      isDemo: demoMode !== null
    }}>
      {children}
      
      {/* Floating Demo Bypass Menu */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2 group">
        <div className="flex flex-col gap-2 translate-y-4 opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300">
          <button 
            onClick={() => enableDemoMode('admin')}
            className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-[12px] shadow-lg hover:bg-gray-800 transition-colors text-xs font-bold uppercase tracking-widest whitespace-nowrap border border-gray-700"
          >
            <ShieldAlert size={14} />
            View as Admin
          </button>
          <button 
            onClick={() => enableDemoMode('client')}
            className="flex items-center gap-2 bg-white text-gray-900 border border-gray-200 px-4 py-2.5 rounded-[12px] shadow-lg hover:bg-gray-50 transition-colors text-xs font-bold uppercase tracking-widest whitespace-nowrap"
          >
            <UserIcon size={14} />
            View as Client
          </button>
        </div>
        <button className="h-12 w-12 bg-black text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform border-2 border-white/20">
          <Settings2 size={20} />
        </button>
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
