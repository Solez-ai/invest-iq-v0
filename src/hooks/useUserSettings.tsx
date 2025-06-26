
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
  const [saving, setSaving] = useState(false);

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

    if (saving) {
      console.log('Already saving settings, skipping...');
      return true;
    }

    setSaving(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      // First try to update existing record
      const { data: existingData, error: selectError } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      let error;
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_settings')
          .update({
            theme: updatedSettings.theme,
            currency: updatedSettings.currency,
            notifications: updatedSettings.notifications,
            live_updates: updatedSettings.live_updates,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            theme: updatedSettings.theme,
            currency: updatedSettings.currency,
            notifications: updatedSettings.notifications,
            live_updates: updatedSettings.live_updates,
            updated_at: new Date().toISOString()
          });
        error = insertError;
      }

      if (error) throw error;
      
      setSettings(updatedSettings);
      toast.success('Settings saved successfully');
      return true;
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Error saving settings:', error);
      return false;
    } finally {
      setSaving(false);
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
    saving,
    saveSettings,
    loadSettings
  };
};
