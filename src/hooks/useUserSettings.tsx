
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface UserSettings {
  theme: string;
  currency: string;
  notifications: boolean;
  live_updates: boolean;
}

export const useUserSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    currency: 'USD',
    notifications: true,
    live_updates: true
  });
  const [loading, setLoading] = useState(false);

  // Load user settings from database
  const loadSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setSettings({
          theme: data.theme || 'dark',
          currency: data.currency || 'USD',
          notifications: data.notifications ?? true,
          live_updates: data.live_updates ?? true
        });
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save user settings to database
  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) {
      toast.error('Please sign in to save settings');
      return false;
    }

    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          theme: updatedSettings.theme,
          currency: updatedSettings.currency,
          notifications: updatedSettings.notifications,
          live_updates: updatedSettings.live_updates,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setSettings(updatedSettings);
      toast.success('Settings saved successfully');
      return true;
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Error saving settings:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      // Reset to defaults when user logs out
      setSettings({
        theme: 'dark',
        currency: 'USD',
        notifications: true,
        live_updates: true
      });
    }
  }, [user]);

  return {
    settings,
    loading,
    saveSettings,
    loadSettings
  };
};
