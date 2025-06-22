import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Plus, Minus, Star } from 'lucide-react';
import { finnhubAPI, type StockQuote } from '@/utils/finnhubAPI';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';

interface StockCardProps {
  symbol: string;
  companyName?: string;
  assetType?: string;
  onClick?: () => void;
  quote?: StockQuote; // Allow external quote to be passed in
  isRealTime?: boolean;
}

export const StockCard = ({ symbol, companyName, assetType, onClick, quote: externalQuote, isRealTime = false }: StockCardProps) => {
  const [quote, setQuote] = useState<StockQuote | null>(externalQuote || null);
  const [loading, setLoading] = useState(!externalQuote);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [priceChanged, setPriceChanged] = useState<'up' | 'down' | null>(null);
  const [liveUpdatesEnabled, setLiveUpdatesEnabled] = useState(() => {
    return localStorage.getItem('liveUpdates') === 'true';
  });
  const { currencySymbol } = useCurrency();

  // Listen for live updates setting changes
  useEffect(() => {
    const handleLiveUpdatesChange = (event: CustomEvent) => {
      console.log('StockCard: Live updates setting changed to:', event.detail);
      setLiveUpdatesEnabled(event.detail);
      // Clear any price change animations when disabled
      if (!event.detail) {
        setPriceChanged(null);
      }
    };

    window.addEventListener('liveUpdatesChanged', handleLiveUpdatesChange as EventListener);
    return () => {
      window.removeEventListener('liveUpdatesChanged', handleLiveUpdatesChange as EventListener);
    };
  }, []);

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

  const getAssetIcon = () => {
    if (assetType === 'us') return '🇺🇸';
    if (assetType === 'global') return '🌍';
    if (assetType === 'etfs') return '📦';
    if (assetType === 'crypto') return '₿';
    return '';
  };

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

  if (loading) {
    return (
      <div className="glass-card p-4 animate-pulse">
        <div className="h-4 bg-muted rounded mb-2"></div>
        <div className="h-6 bg-muted rounded mb-1"></div>
        <div className="h-4 bg-muted rounded w-20"></div>
      </div>
    );
  }

  if (!quote) return null;

  const isPositive = quote.dp >= 0;
  const changeColor = isPositive ? 'profit' : 'loss';
  const glowClass = isPositive ? 'glow-green' : 'glow-red';

  return (
    <div 
      className={cn(
        "glass-card p-4 cursor-pointer transition-all duration-200 hover:scale-105 relative",
        glowClass,
        // Only apply price change animations when live updates are enabled
        liveUpdatesEnabled && priceChanged === 'up' && "animate-pulse bg-green-500/10 border-green-500/30",
        liveUpdatesEnabled && priceChanged === 'down' && "animate-pulse bg-red-500/10 border-red-500/30"
      )}
      onClick={onClick}
    >
      {/* Real-time indicator - only show when both isRealTime and liveUpdatesEnabled */}
      {isRealTime && liveUpdatesEnabled && (
        <div className="absolute top-1 left-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}
      
      {/* Asset Type Icon */}
      {assetType && (
        <div className="absolute top-2 left-2 text-xs">
          {getAssetIcon()}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-1">
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-6 w-6 p-0 hover:bg-accent",
            isPinned ? "text-yellow-500" : "text-muted-foreground"
          )}
          onClick={togglePin}
        >
          <Star className="h-3 w-3" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-6 w-6 p-0 hover:bg-accent",
            isInWatchlist ? "text-red-500" : "text-green-500"
          )}
          onClick={toggleWatchlist}
        >
          {isInWatchlist ? (
            <Minus className="h-3 w-3" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
        </Button>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-foreground">{symbol.replace(/^[A-Z]+:/, '')}</h3>
            {companyName && (
              <p className="text-sm text-muted-foreground truncate">{companyName}</p>
            )}
          </div>
          <div className={cn("flex items-center", changeColor)}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className={cn(
              "text-2xl font-bold text-foreground transition-colors duration-500",
              // Only apply price change colors when live updates are enabled
              liveUpdatesEnabled && priceChanged === 'up' && "text-green-500",
              liveUpdatesEnabled && priceChanged === 'down' && "text-red-500"
            )}>
              {currencySymbol}{quote.c.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className={changeColor}>
              {isPositive ? '+' : ''}{quote.d.toFixed(2)}
            </span>
            <span className={changeColor}>
              {isPositive ? '+' : ''}{quote.dp.toFixed(2)}%
            </span>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>H: {currencySymbol}{quote.h.toFixed(2)}</span>
            <span>L: {currencySymbol}{quote.l.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
