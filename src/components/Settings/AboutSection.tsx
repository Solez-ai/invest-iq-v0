
import { Globe } from 'lucide-react';

export const AboutSection = () => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-5 w-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-foreground">About Invest IQ</h2>
      </div>
      
      <div className="space-y-3 text-muted-foreground">
        <p>Version 4.0.0</p>
        <p>Your intelligent investment companion powered by real-time market data and AI analysis.</p>
        <div className="flex gap-4 text-sm">
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
          <a href="#" className="text-primary hover:underline">Support</a>
        </div>
      </div>
    </div>
  );
};
