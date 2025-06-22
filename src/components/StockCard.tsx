
import { useEffect, useState } from 'react';
import { finnhubAPI, type StockQuote } from '@/utils/finnhubAPI';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import { useStockCardState } from '@/hooks/useStockCardState';
import { StockCardHeader } from './StockCardHeader';
import { StockCardPrice } from './StockCardPrice';

interface StockCardProps {
  symbol: string;
  companyName?: string;
  assetType?: string;
  onClick?: () => void;
  quote?: StockQuote; // Allow external quote to be passed in
  isRealTime?: boolean;
}

export const StockCard = ({ symbol, companyName, assetType, onClick, quote: externalQuote, isRealTime = false }: StockCardProps) => {
  const [liveUpdatesEnabled, setLiveUpdatesEnabled] = useState(() => {
    return localStorage.getItem('liveUpdates') === 'true';
  });
  const { currencySymbol } = useCurrency();

  const {
    quote,
    loading,
    isInWatchlist,
    isPinned,
    priceChanged,
    toggleWatchlist,
    togglePin
  } = useStockCardState({ symbol, externalQuote, liveUpdatesEnabled });

  // Listen for live updates setting changes
  useEffect(() => {
    const handleLiveUpdatesChange = (event: CustomEvent) => {
      console.log('StockCard: Live updates setting changed to:', event.detail);
      setLiveUpdatesEnabled(event.detail);
    };

    window.addEventListener('liveUpdatesChanged', handleLiveUpdatesChange as EventListener);
    return () => {
      window.removeEventListener('liveUpdatesChanged', handleLiveUpdatesChange as EventListener);
    };
  }, []);

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
      <StockCardHeader
        symbol={symbol}
        companyName={companyName}
        assetType={assetType}
        isRealTime={isRealTime}
        liveUpdatesEnabled={liveUpdatesEnabled}
        isPinned={isPinned}
        isInWatchlist={isInWatchlist}
        onTogglePin={togglePin}
        onToggleWatchlist={toggleWatchlist}
      />
      
      <StockCardPrice
        quote={quote}
        currencySymbol={currencySymbol}
        priceChanged={priceChanged}
        liveUpdatesEnabled={liveUpdatesEnabled}
      />
    </div>
  );
};
