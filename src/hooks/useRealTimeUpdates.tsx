
import { useState, useEffect, useCallback, useRef } from 'react';
import { finnhubAPI, type StockQuote } from '@/utils/finnhubAPI';

interface UseRealTimeUpdatesProps {
  symbols: string[];
  enabled?: boolean;
  interval?: number;
}

interface PriceUpdate {
  symbol: string;
  quote: StockQuote;
  timestamp: number;
  isNew?: boolean;
}

export const useRealTimeUpdates = ({ 
  symbols, 
  enabled = true, 
  interval = 15000 
}: UseRealTimeUpdatesProps) => {
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Listen for live updates setting changes
  const [liveUpdatesEnabled, setLiveUpdatesEnabled] = useState(() => {
    return localStorage.getItem('liveUpdates') === 'true';
  });

  useEffect(() => {
    const handleLiveUpdatesChange = (event: CustomEvent) => {
      console.log('Live updates setting changed:', event.detail);
      setLiveUpdatesEnabled(event.detail);
    };

    window.addEventListener('liveUpdatesChanged', handleLiveUpdatesChange as EventListener);
    return () => {
      window.removeEventListener('liveUpdatesChanged', handleLiveUpdatesChange as EventListener);
    };
  }, []);

  const fetchQuotes = useCallback(async (symbolsToFetch: string[]) => {
    if (!symbolsToFetch.length || !mountedRef.current) return;

    try {
      setLoading(true);
      const batchSize = 10; // Respect API rate limits
      const batches = [];
      
      for (let i = 0; i < symbolsToFetch.length; i += batchSize) {
        batches.push(symbolsToFetch.slice(i, i + batchSize));
      }

      const allQuotes: Record<string, StockQuote> = {};

      for (const batch of batches) {
        const promises = batch.map(async (symbol) => {
          try {
            // Use mock data for demo - in production this would be real API calls
            const quote = finnhubAPI.getMockQuote(symbol);
            return { symbol, quote };
          } catch (error) {
            console.error(`Error fetching quote for ${symbol}:`, error);
            return null;
          }
        });

        const results = await Promise.all(promises);
        results.forEach((result) => {
          if (result && mountedRef.current) {
            allQuotes[result.symbol] = result.quote;
          }
        });

        // Add small delay between batches to respect rate limits
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (mountedRef.current) {
        setQuotes(prevQuotes => {
          const newQuotes = { ...prevQuotes, ...allQuotes };
          
          // Trigger visual updates for changed prices
          Object.keys(allQuotes).forEach(symbol => {
            const oldQuote = prevQuotes[symbol];
            const newQuote = allQuotes[symbol];
            
            if (oldQuote && newQuote && oldQuote.c !== newQuote.c) {
              // Dispatch price change event for visual feedback
              window.dispatchEvent(new CustomEvent('priceChanged', {
                detail: { symbol, oldPrice: oldQuote.c, newPrice: newQuote.c }
              }));
            }
          });
          
          return newQuotes;
        });
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching real-time quotes:', error);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (symbols.length > 0) {
      fetchQuotes(symbols);
    }
  }, [symbols, fetchQuotes]);

  // Set up real-time polling - this is the key fix
  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const shouldStartPolling = enabled && liveUpdatesEnabled && symbols.length > 0;
    
    if (shouldStartPolling) {
      intervalRef.current = setInterval(() => {
        fetchQuotes(symbols);
      }, interval);

      console.log(`Real-time updates started for ${symbols.length} symbols (${interval/1000}s interval)`);
    } else {
      console.log('Real-time updates disabled');
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, liveUpdatesEnabled, symbols, interval, fetchQuotes]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const refreshNow = useCallback(() => {
    if (symbols.length > 0) {
      fetchQuotes(symbols);
    }
  }, [symbols, fetchQuotes]);

  return {
    quotes,
    loading,
    lastUpdate,
    isRealTimeEnabled: enabled && liveUpdatesEnabled,
    refreshNow
  };
};
