
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface WatchlistItem {
  id: string;
  symbol: string;
  company_name: string | null;
  asset_type: string | null;
}

export const useUserWatchlist = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user's watchlist from database
  const loadWatchlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_watchlist')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setWatchlist(data || []);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to watchlist
  const addToWatchlist = async (symbol: string, companyName?: string, assetType?: string) => {
    if (!user) {
      toast.error('Please sign in to add items to your watchlist');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_watchlist')
        .insert({
          user_id: user.id,
          symbol,
          company_name: companyName,
          asset_type: assetType
        });

      if (error) throw error;
      
      toast.success(`${symbol} added to watchlist`);
      loadWatchlist(); // Refresh the list
      return true;
    } catch (error: any) {
      if (error.code === '23505') { // Unique constraint violation
        toast.error(`${symbol} is already in your watchlist`);
      } else {
        toast.error('Failed to add to watchlist');
        console.error('Error adding to watchlist:', error);
      }
      return false;
    }
  };

  // Remove item from watchlist
  const removeFromWatchlist = async (symbol: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('symbol', symbol);

      if (error) throw error;
      
      toast.success(`${symbol} removed from watchlist`);
      loadWatchlist(); // Refresh the list
      return true;
    } catch (error) {
      toast.error('Failed to remove from watchlist');
      console.error('Error removing from watchlist:', error);
      return false;
    }
  };

  // Check if item is in watchlist
  const isInWatchlist = (symbol: string) => {
    return watchlist.some(item => item.symbol === symbol);
  };

  useEffect(() => {
    if (user) {
      loadWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [user]);

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    loadWatchlist
  };
};
