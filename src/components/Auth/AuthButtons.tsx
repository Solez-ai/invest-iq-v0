
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';

export const AuthButtons = () => {
  const { user, signOut, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          <span className="text-foreground">Hello, {user.user_metadata?.full_name || user.email}</span>
        </div>
        <Button
          onClick={signOut}
          variant="destructive"
          size="sm"
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setShowAuthModal(true)}
          variant="outline"
          size="sm"
          className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
        >
          Sign In
        </Button>
        <Button
          onClick={() => setShowAuthModal(true)}
          size="sm"
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white"
        >
          Sign Up
        </Button>
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};
