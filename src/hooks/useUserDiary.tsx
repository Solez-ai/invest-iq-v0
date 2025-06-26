
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface DiaryEntry {
  id: string;
  title: string;
  content: string | null;
  mood: string | null; // Changed from strict union to string | null
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useUserDiary = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user's diary entries from database
  const loadEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading diary entries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new diary entry
  const addEntry = async (
    title: string,
    content: string,
    mood: 'bullish' | 'bearish' | 'neutral',
    tags: string[]
  ) => {
    if (!user) {
      toast.error('Please sign in to save diary entries');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_diary_entries')
        .insert({
          user_id: user.id,
          title,
          content,
          mood,
          tags
        });

      if (error) throw error;
      
      toast.success('Diary entry saved successfully');
      loadEntries(); // Refresh the list
      return true;
    } catch (error) {
      toast.error('Failed to save diary entry');
      console.error('Error adding diary entry:', error);
      return false;
    }
  };

  // Delete diary entry
  const deleteEntry = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_diary_entries')
        .delete()
        .eq('user_id', user.id)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Diary entry deleted');
      loadEntries(); // Refresh the list
      return true;
    } catch (error) {
      toast.error('Failed to delete diary entry');
      console.error('Error deleting diary entry:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadEntries();
    } else {
      setEntries([]);
    }
  }, [user]);

  return {
    entries,
    loading,
    addEntry,
    deleteEntry,
    loadEntries
  };
};
