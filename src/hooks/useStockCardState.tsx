
import { useEffect, useState } from 'react';
import { finnhubAPI, type StockQuote } from '@/utils/finnhubAPI';

interface UseStockCardStateProps {
  symbol: string;
  externalQuote?: StockQuote;
  liveUpdatesEnabled: boolean;
}

export const useStockCardState = ({ symbol, externalQuote, liveUpdatesEnabled }: UseStockCardStateProps) => {
  const [quote, setQuote] = useState<StockQuote | null>(externalQuote || null);
  const [loading, setLoading] = useState(!externalQuote);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [priceChanged, setPriceChanged] = useState<'up' | 'down' | null>(null);

  // Use external quote if provided (for real-time updates)
  useEffect(() => {
    if (externalQuote && liveUpdatesEnabled) {
      const oldPrice = quote?.c;
      const newPrice = externalQuote.c;
      
      if (oldPrice && newPrice && oldPrice !== newPrice) {
        setPriceChanged(newPrice > oldPrice ? 'up' : 'down');
        setTimeout(() => setPriceChanged(null), 2000); // Clear animation after 2s
      }
      
      setQuote(externalQuote);
      setLoading(false);
    } else if (externalQuote && !liveUpdatesEnabled) {
      // Update quote but don't animate when live updates are disabled
      setQuote(externalQuote);
      setLoading(false);
      setPriceChanged(null);
    }
  }, [externalQuote, quote?.c, liveUpdatesEnabled]);

  // Listen for price change events only when live updates are enabled
  useEffect(() => {
    if (!liveUpdatesEnabled) return;

    const handlePriceChange = (event: CustomEvent) => {
      if (event.detail.symbol === symbol) {
        setPriceChanged(event.detail.newPrice > event.detail.oldPrice ? 'up' : 'down');
        setTimeout(() => setPriceChanged(null), 2000);
      }
    };

    window.addEventListener('priceChanged', handlePriceChange as EventListener);
    return () => {
      window.removeEventListener('priceChanged', handlePriceChange as EventListener);
    };
  }, [symbol, liveUpdatesEnabled]);

  // Initial fetch and storage checks
  useEffect(() => {
    const fetchQuote = async () => {
      if (externalQuote) return; // Don't fetch if external quote is provided
      
      try {
        setLoading(true);
        // For demo, use mock data
        const data = finnhubAPI.getMockQuote(symbol);
        setQuote(data);
        
        // Check if in watchlist
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        setIsInWatchlist(watchlist.includes(symbol));
        
        // Check if pinned
        const pinned = JSON.parse(localStorage.getItem('pinnedAssets') || '[]');
        setIsPinned(pinned.includes(symbol));
      } catch (error) {
        console.error('Error fetching quote:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [symbol, externalQuote]);

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    if (isInWatchlist) {
      const updated = watchlist.filter((item: string) => item !== symbol);
      localStorage.setItem('watchlist', JSON.stringify(updated));
      setIsInWatchlist(false);
    } else {
      localStorage.setItem('watchlist', JSON.stringify([...watchlist, symbol]));
      setIsInWatchlist(true);
    }
  };

  const togglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    const pinned = JSON.parse(localStorage.getItem('pinnedAssets') || '[]');
    
    if (isPinned) {
      const updated = pinned.filter((item: string) => item !== symbol);
      localStorage.setItem('pinnedAssets', JSON.stringify(updated));
      setIsPinned(false);
    } else {
      localStorage.setItem('pinnedAssets', JSON.stringify([...pinned, symbol]));
      setIsPinned(true);
    }
  };

  return {
    quote,
    loading,
    isInWatchlist,
    isPinned,
    priceChanged,
    toggleWatchlist,
    togglePin
  };
};
