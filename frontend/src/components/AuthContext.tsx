import { createContext, useContext, ReactNode } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  signup: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { openSignIn, openSignUp, signOut } = useClerk();

  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.firstName || 'User',
    email: clerkUser.emailAddresses[0]?.emailAddress || ''
  } : null;

  const login = () => {
    openSignIn();
  };

  const logout = () => {
    signOut();
  };

  const signup = () => {
    openSignUp();
  };

  // Don't render until Clerk is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout, 
      signup 
    }}>
      {children}
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
