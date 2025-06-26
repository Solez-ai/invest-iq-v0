
import { Globe } from 'lucide-react';

export const SignInPrompt = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <Globe className="h-12 w-12 text-muted-foreground" />
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
        <p className="text-muted-foreground">Please sign in to access your settings.</p>
      </div>
    </div>
  );
};
