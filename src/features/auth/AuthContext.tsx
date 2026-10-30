import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, sanitizeErrorMessage } from '../../lib/supabase';
import { Profile } from '../../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null; requiresVerification: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  updateProfile: (data: { fullName: string; phone?: string; address?: string }) => Promise<{ error: string | null }>;
  loginAsDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'cleanhome_demo_user';
const LOCAL_STORAGE_PROFILE_KEY = 'cleanhome_demo_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch or sync user profile
  const fetchProfile = async (userId: string, userMetaName?: string) => {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (stored) {
        try {
          setProfile(JSON.parse(stored));
          return;
        } catch {
          // ignore error
        }
      }
      const demoProfile: Profile = {
        id: userId,
        full_name: userMetaName || 'Sarah Jenkins',
        phone: '+62 812-3456-7890',
        address: 'Jl. Kemang Raya No. 42, Jakarta Selatan',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(demoProfile);
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(demoProfile));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data as Profile);
      } else {
        // Fallback: If trigger hasn't fired or returned yet, create local profile state
        const safeProfile: Profile = {
          id: userId,
          full_name: userMetaName || 'CleanHome Customer',
          phone: null,
          address: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(safeProfile);
      }
    } catch {
      // Safe non-disclosing error suppression
    }
  };

  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      // Check for saved demo session in local storage
      const savedDemoUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (savedDemoUser) {
        try {
          const parsed = JSON.parse(savedDemoUser);
          setUser(parsed);
          fetchProfile(parsed.id, parsed.user_metadata?.full_name);
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        }
      }
      setIsLoading(false);
      return;
    }

    // Live Supabase Auth initialization
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id, session.user.user_metadata?.full_name);
          }
        }
      } catch {
        // Silent recovery
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.user_metadata?.full_name);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign up action
  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      const demoUser = {
        id: 'demo-user-' + Math.random().toString(36).substring(2, 9),
        email,
        user_metadata: { full_name: fullName },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const demoProfile: Profile = {
        id: demoUser.id,
        full_name: fullName,
        phone: null,
        address: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(demoUser);
      setProfile(demoProfile);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(demoProfile));
      return { error: null, requiresVerification: false };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error: sanitizeErrorMessage(error), requiresVerification: false };
      }

      // Check if email confirmation is required
      const requiresVerification = Boolean(data.user && !data.session);
      return { error: null, requiresVerification };
    } catch (err) {
      return { error: sanitizeErrorMessage(err), requiresVerification: false };
    }
  };

  // Sign in action
  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      const demoUser = {
        id: 'demo-user-12345',
        email,
        user_metadata: { full_name: 'Sarah Jenkins' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const demoProfile: Profile = {
        id: demoUser.id,
        full_name: 'Sarah Jenkins',
        phone: '+62 812-3456-7890',
        address: 'Jl. Kemang Raya No. 42, Jakarta Selatan',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(demoUser);
      setProfile(demoProfile);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(demoProfile));
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: sanitizeErrorMessage(error) };
      }

      return { error: null };
    } catch (err) {
      return { error: sanitizeErrorMessage(err) };
    }
  };

  // Demo user login for fast evaluation
  const loginAsDemoUser = () => {
    const demoUser = {
      id: 'demo-sarah-user-id',
      email: 'customer@cleanhome.id',
      user_metadata: { full_name: 'Sarah Jenkins' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User;

    const demoProfile: Profile = {
      id: demoUser.id,
      full_name: 'Sarah Jenkins',
      phone: '+62 812-8899-7766',
      address: 'Jl. Kemang Dahlia No. 18, Jakarta Selatan',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(demoUser);
    setProfile(demoProfile);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(demoProfile));
  };

  // Sign out action
  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
  };

  // Request password reset (Never disclose whether email exists)
  const requestPasswordReset = async (email: string) => {
    if (!isSupabaseConfigured) {
      // Neutral response in demo mode
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      // Neutral response to prevent email enumeration
      if (error && !error.message.includes('rate limit')) {
        return { error: null };
      }
      return { error: null };
    } catch {
      return { error: null };
    }
  };

  // Update password
  const updatePassword = async (password: string) => {
    if (!isSupabaseConfigured) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        return { error: sanitizeErrorMessage(error) };
      }
      return { error: null };
    } catch (err) {
      return { error: sanitizeErrorMessage(err) };
    }
  };

  // Update profile
  const updateProfile = async (data: { fullName: string; phone?: string; address?: string }) => {
    if (!user) return { error: 'Anda harus masuk terlebih dahulu' };

    const updatedProfile: Profile = {
      id: user.id,
      full_name: data.fullName,
      phone: data.phone || null,
      address: data.address || null,
      created_at: profile?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured) {
      setProfile(updatedProfile);
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updatedProfile));
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(updatedProfile)
        .eq('id', user.id);

      if (error) {
        return { error: sanitizeErrorMessage(error) };
      }

      setProfile(updatedProfile);
      return { error: null };
    } catch (err) {
      return { error: sanitizeErrorMessage(err) };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isConfigured: isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        requestPasswordReset,
        updatePassword,
        updateProfile,
        loginAsDemoUser,
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
