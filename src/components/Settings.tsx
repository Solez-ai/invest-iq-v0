
import { useState, useEffect } from 'react';
import { Moon, Sun, Globe, DollarSign, Bell, Zap } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useAuth } from '@/hooks/useAuth';

export const Settings = () => {
  const { user } = useAuth();
  const { settings, loading, saveSettings } = useUserSettings();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Update theme when user changes it
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Save to database if user is signed in
    if (user) {
      saveSettings({ theme: isDarkMode ? 'dark' : 'light' });
    }
  }, [isDarkMode, user, saveSettings]);

  // Sync with user settings when loaded
  useEffect(() => {
    if (!loading && user) {
      setIsDarkMode(settings.theme === 'dark');
    }
  }, [settings, loading, user]);

  const handleCurrencyChange = (currency: string) => {
    if (user) {
      saveSettings({ currency });
    }
  };

  const handleLiveUpdatesChange = (enabled: boolean) => {
    console.log('Settings: Changing live updates to:', enabled);
    localStorage.setItem('liveUpdates', enabled.toString());
    window.dispatchEvent(new CustomEvent('liveUpdatesChanged', { detail: enabled }));
    
    if (user) {
      saveSettings({ live_updates: enabled });
    }
  };

  const handleNotificationsChange = (enabled: boolean) => {
    if (user) {
      saveSettings({ notifications: enabled });
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Globe className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground">Please sign in to access your settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your Invest IQ experience</p>
      </div>

      {/* Appearance */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          {isDarkMode ? <Moon className="h-5 w-5 text-purple-400" /> : <Sun className="h-5 w-5 text-yellow-500" />}
          <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">Dark Mode</label>
              <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
            </div>
            <Switch 
              checked={isDarkMode} 
              onCheckedChange={setIsDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Market Data */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-green-400" />
          <h2 className="text-xl font-semibold text-foreground">Market Data</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Primary Currency
            </label>
            <Select value={settings.currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-full bg-background/50 border-border text-foreground hover:bg-background/70 focus:ring-primary">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-xl border-border shadow-2xl">
                <SelectItem value="USD" className="text-foreground hover:bg-accent focus:bg-accent">USD - US Dollar</SelectItem>
                <SelectItem value="EUR" className="text-foreground hover:bg-accent focus:bg-accent">EUR - Euro</SelectItem>
                <SelectItem value="GBP" className="text-foreground hover:bg-accent focus:bg-accent">GBP - British Pound</SelectItem>
                <SelectItem value="INR" className="text-foreground hover:bg-accent focus:bg-accent">INR - Indian Rupee</SelectItem>
                <SelectItem value="CAD" className="text-foreground hover:bg-accent focus:bg-accent">CAD - Canadian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">Live Updates</label>
              <p className="text-xs text-muted-foreground">Real-time price updates every 15 seconds</p>
            </div>
            <Switch 
              checked={settings.live_updates} 
              onCheckedChange={handleLiveUpdatesChange}
            />
          </div>
        </div>
      </div>

      {/* Real-Time Features */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-yellow-400" />
          <h2 className="text-xl font-semibold text-foreground">Real-Time Features</h2>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${settings.live_updates ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-foreground">
                Live Updates: {settings.live_updates ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {settings.live_updates 
                ? 'Your dashboard and watchlist are receiving real-time price updates every 15 seconds.'
                : 'Enable Live Updates to get real-time price data automatically.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">Price Alerts</label>
              <p className="text-xs text-muted-foreground">Get notified when stocks hit your target prices</p>
            </div>
            <Switch 
              checked={settings.notifications} 
              onCheckedChange={handleNotificationsChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">Market News</label>
              <p className="text-xs text-muted-foreground">Receive breaking market news notifications</p>
            </div>
            <Switch checked={true} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">AI Insights</label>
              <p className="text-xs text-muted-foreground">Get AI-powered market insights and recommendations</p>
            </div>
            <Switch checked={true} />
          </div>
        </div>
      </div>

      {/* About */}
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
    </div>
  );
};
