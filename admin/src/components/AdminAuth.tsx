import { useAuth, useUser, SignInButton } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Loader2, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AdminAuthProps {
  children: React.ReactNode;
}

export function AdminAuth({ children }: AdminAuthProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    setIsChecking(false);
  }, [isLoaded]);

  // Show loading while Clerk loads
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

  // User is signed in → allow access
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
        </CardContent>
      </Card>
    </div>
  );
}
