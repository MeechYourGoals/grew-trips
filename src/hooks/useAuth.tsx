
import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  email?: string;
  phone?: string;
  displayName: string;
  avatar?: string;
  isPro: boolean;
  // Enhanced pro role system
  proRole?:
    | 'admin'
    | 'staff'
    | 'talent'
    | 'player'
    | 'crew'
    | 'security'
    | 'medical'
    | 'producer'
    | 'speakers'
    | 'guests'
    | 'coordinators'
    | 'logistics'
    | 'press';
  organizationId?: string;
  permissions: string[];
  notificationSettings: {
    messages: boolean;
    broadcasts: boolean;
    tripUpdates: boolean;
    email: boolean;
    push: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithPhone: (phone: string, code: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  switchRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    email: 'demo@example.com',
    displayName: 'Demo Admin',
    isPro: true,
    proRole: 'admin',
    organizationId: 'org-1',
    permissions: ['read', 'write', 'admin', 'finance', 'compliance'],
    notificationSettings: {
      messages: true,
      broadcasts: true,
      tripUpdates: true,
      email: true,
      push: false
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    // TODO: Implement Supabase auth
    setTimeout(() => {
      setUser({
        id: '1',
        email,
        displayName: 'Demo User',
        isPro: true,
        proRole: 'admin',
        organizationId: 'org-1',
        permissions: ['read', 'write', 'admin'],
        notificationSettings: {
          messages: true,
          broadcasts: true,
          tripUpdates: true,
          email: true,
          push: false
        }
      });
      setIsLoading(false);
    }, 1000);
  };

  const signInWithPhone = async (phone: string, code: string) => {
    setIsLoading(true);
    // TODO: Implement Supabase phone auth
    setTimeout(() => {
      setUser({
        id: '1',
        phone,
        displayName: 'Demo User',
        isPro: true,
        proRole: 'staff',
        organizationId: 'org-1',
        permissions: ['read', 'write'],
        notificationSettings: {
          messages: true,
          broadcasts: true,
          tripUpdates: true,
          email: true,
          push: false
        }
      });
      setIsLoading(false);
    }, 1000);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    // TODO: Implement Supabase signup
    setTimeout(() => {
      setUser({
        id: '1',
        email,
        displayName,
        isPro: false,
        permissions: ['read'],
        notificationSettings: {
          messages: true,
          broadcasts: true,
          tripUpdates: true,
          email: true,
          push: false
        }
      });
      setIsLoading(false);
    }, 1000);
  };

  const signOut = async () => {
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const switchRole = (role: string) => {
    if (user) {
      const rolePermissions: Record<string, string[]> = {
        admin: ['read', 'write', 'admin', 'finance', 'compliance'],
        staff: ['read', 'write'],
        talent: ['read'],
        player: ['read'],
        crew: ['read', 'write'],
        security: ['read', 'write'],
        medical: ['read', 'write', 'medical'],
        producer: ['read', 'write', 'admin'],
        speakers: ['read'],
        guests: ['read'],
        coordinators: ['read', 'write'],
        logistics: ['read', 'write'],
        press: ['read', 'write']
      };
      
      setUser({
        ...user,
        proRole: role as User['proRole'],
        permissions: rolePermissions[role] || ['read']
      });
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
      updateProfile,
      switchRole
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
