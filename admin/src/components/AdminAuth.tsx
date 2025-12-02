import { useAuth, useUser, SignInButton } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AdminAuthProps {
  children: React.ReactNode;
}

export function AdminAuth({ children }: AdminAuthProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!isLoaded) return;
      
      if (!isSignedIn || !user) {
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }

      // Check if user has admin role in public metadata
      const userRole = user.publicMetadata?.role;
      const userId = user.id;
      
      // Temporary: Allow specific user IDs for testing (remove in production)
      const allowedTestUserIds = ['user_33dofSrp63OzwzyUhUGYAg4mQfb']; // Your actual user ID
      
      const isUserAdmin = userRole === 'admin' || allowedTestUserIds.includes(userId);
      
      setIsAdmin(isUserAdmin);
      setIsChecking(false);
    };

    checkAdminRole();
  }, [isSignedIn, isLoaded, user]);

  // Show loading while checking authentication
  if (!isLoaded || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#A00000]" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login page if not signed in
  if (!isSignedIn) {
    return <LoginPage />;
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return <AccessDeniedPage user={user} />;
  }

  // User is authenticated and is admin
  return <>{children}</>;
}

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A00000] to-[#CC5500] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Sign in to access the admin panel
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInButton mode="modal">
            <Button 
              className="w-full bg-[#A00000] hover:bg-[#800000] text-white py-3"
              size="lg"
            >
              Sign In with Clerk
            </Button>
          </SignInButton>
          <p className="text-xs text-gray-500 text-center">
            Only admin accounts can access this dashboard
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function AccessDeniedPage({ user }: { user: any }) {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <Card className="w-full max-w-md shadow-lg border-red-200">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-900">
            Access Denied
          </CardTitle>
          <p className="text-red-600 mt-2">
            You don't have admin privileges
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Signed in as:</strong> {user?.emailAddresses?.[0]?.emailAddress}
            </p>
            <p className="text-sm text-red-700 mt-1">
              This account doesn't have admin role assigned.
            </p>
          </div>
          <Button 
            onClick={() => signOut()}
            variant="outline"
            className="w-full border-red-300 text-red-700 hover:bg-red-50"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
