
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Plus, Minus, Star } from 'lucide-react';
import { finnhubAPI, type StockQuote } from '@/utils/finnhubAPI';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StockCardProps {
  symbol: string;
  companyName?: string;
  assetType?: string;
  onClick?: () => void;
}

export const StockCard = ({ symbol, companyName, assetType, onClick }: StockCardProps) => {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
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
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchQuote, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

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
        <div className="h-4 bg-white/20 rounded mb-2"></div>
        <div className="h-6 bg-white/20 rounded mb-1"></div>
        <div className="h-4 bg-white/20 rounded w-20"></div>
      </div>
    );
  }

  if (!quote) return null;

  const isPositive = quote.dp >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const glowClass = isPositive ? 'glow-green' : 'glow-red';

  return (
    <div 
      className={cn(
        "glass-card p-4 cursor-pointer transition-all duration-200 hover:scale-105 relative",
        glowClass
      )}
      onClick={onClick}
    >
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
            "h-6 w-6 p-0 hover:bg-white/20",
            isPinned ? "text-yellow-400" : "text-white/60"
          )}
          onClick={togglePin}
        >
          <Star className="h-3 w-3" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-6 w-6 p-0 hover:bg-white/20",
            isInWatchlist ? "text-red-400" : "text-green-400"
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
            <h3 className="font-bold text-lg text-white">{symbol.replace(/^[A-Z]+:/, '')}</h3>
            {companyName && (
              <p className="text-sm text-gray-400 truncate">{companyName}</p>
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
            <span className="text-2xl font-bold text-white">
              ${quote.c.toFixed(2)}
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
          
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>H: ${quote.h.toFixed(2)}</span>
            <span>L: ${quote.l.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
