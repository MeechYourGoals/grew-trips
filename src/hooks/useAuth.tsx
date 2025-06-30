
import { useState, useEffect, createContext, useContext } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  displayName: string;
  avatar?: string;
  isPro: boolean;
  notificationSettings: {
    messages: boolean;
    broadcasts: boolean;
    tripUpdates: boolean;
    email: boolean;
    push: boolean;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithPhone: (phone: string, code: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultSettings = {
  messages: true,
  broadcasts: true,
  tripUpdates: true,
  email: true,
  push: false,
};

const mapUser = (sbUser: SupabaseUser): AuthUser => ({
  id: sbUser.id,
  email: sbUser.email ?? undefined,
  phone: sbUser.phone ?? undefined,
  displayName: sbUser.user_metadata?.displayName || sbUser.email || '',
  avatar: sbUser.user_metadata?.avatar,
  isPro: sbUser.user_metadata?.isPro ?? false,
  notificationSettings: sbUser.user_metadata?.notificationSettings || defaultSettings,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(mapUser(data.user));
      }
      setIsLoading(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setIsLoading(false);
      throw error;
    }
    setIsLoading(false);
  };

  const signInWithPhone = async (phone: string, code: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone, token: code });
    if (error) {
      setIsLoading(false);
      throw error;
    }
    setIsLoading(false);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { displayName } },
    });
    if (error) {
      setIsLoading(false);
      throw error;
    }
    setIsLoading(false);
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) return;
    const { error } = await supabase.auth.updateUser({ data: updates });
    if (!error) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signInWithPhone,
      signUp,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
