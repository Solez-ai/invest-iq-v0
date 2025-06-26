
import { useState, useEffect } from 'react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useAuth } from '@/hooks/useAuth';
import { SettingsHeader } from './Settings/SettingsHeader';
import { SignInPrompt } from './Settings/SignInPrompt';
import { AppearanceSettings } from './Settings/AppearanceSettings';
import { MarketDataSettings } from './Settings/MarketDataSettings';
import { NotificationSettings } from './Settings/NotificationSettings';
import { AboutSection } from './Settings/AboutSection';

export const Settings = () => {
  const { user } = useAuth();
  const { settings, loading, saving, saveSettings } = useUserSettings();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && document.documentElement.classList.contains('dark'));
  });

  // Only sync with user settings when they are first loaded
  useEffect(() => {
    if (!loading && user && settings.theme) {
      const shouldBeDark = settings.theme === 'dark';
      setIsDarkMode(shouldBeDark);
    }
  }, [settings.theme, loading, user]);

  // Handle theme changes
  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    
    // Update DOM immediately
    const root = document.documentElement;
    if (checked) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Save to database if user is signed in
    if (user && !saving) {
      saveSettings({ theme: checked ? 'dark' : 'light' });
    }
  };

  const handleCurrencyChange = (currency: string) => {
    if (user && !saving) {
      saveSettings({ currency });
    }
  };

  const handleLiveUpdatesChange = (enabled: boolean) => {
    console.log('Settings: Changing live updates to:', enabled);
    localStorage.setItem('liveUpdates', enabled.toString());
    window.dispatchEvent(new CustomEvent('liveUpdatesChanged', { detail: enabled }));
    
    if (user && !saving) {
      saveSettings({ live_updates: enabled });
    }
  };

  const handleNotificationsChange = (enabled: boolean) => {
    if (user && !saving) {
      saveSettings({ notifications: enabled });
    }
  };

  if (!user) {
    return <SignInPrompt />;
  }

  return (
    <div className="space-y-6">
      <SettingsHeader />
      
      <AppearanceSettings 
        isDarkMode={isDarkMode}
        onThemeChange={handleThemeChange}
        saving={saving}
      />

      <MarketDataSettings 
        currency={settings.currency}
        liveUpdates={settings.live_updates}
        onCurrencyChange={handleCurrencyChange}
        onLiveUpdatesChange={handleLiveUpdatesChange}
        saving={saving}
      />

      <NotificationSettings 
        notifications={settings.notifications}
        onNotificationsChange={handleNotificationsChange}
        saving={saving}
      />

      <AboutSection />
    </div>
  );
};
